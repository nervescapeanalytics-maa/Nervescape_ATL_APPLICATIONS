import { Router } from 'express';
import { z } from 'zod';
import { one, query } from '../db/pool';
import { authenticate, authorize } from '../middleware/auth';
import { asyncH, httpError } from '../middleware/error';
import { deployCatalogToGrade, setCatalogMappings, syncAllDeployments } from '../services/catalogSync';

const router = Router();
router.use(authenticate, authorize('admin'));

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// ── Overview ─────────────────────────────────────────────────────────────────
router.get('/overview', asyncH(async (_req, res) => {
  const { rows: levels } = await query(
    `SELECT l.id, l.name, l.slug, l.description, l.order_index, l.is_active,
            (SELECT count(*) FROM course_catalog c WHERE c.level_id=l.id) AS course_count,
            (SELECT count(DISTINCT cgm.grade_id) FROM course_catalog c
             JOIN catalog_grade_map cgm ON cgm.catalog_id=c.id WHERE c.level_id=l.id) AS class_count
     FROM curriculum_levels l ORDER BY l.order_index`
  );
  const stats = await one<any>(
    `SELECT
       (SELECT count(*) FROM course_catalog) AS courses,
       (SELECT count(*) FROM catalog_chapters) AS chapters,
       (SELECT count(*) FROM catalog_grade_map) AS mappings`
  );
  res.json({ levels, stats });
}));

// ── Learning levels ──────────────────────────────────────────────────────────
router.get('/levels', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT l.*,
            (SELECT count(*) FROM course_catalog c WHERE c.level_id=l.id) AS course_count,
            (SELECT count(*) FROM grades g WHERE g.level_id=l.id AND g.is_active) AS primary_classes
     FROM curriculum_levels l ORDER BY l.order_index`
  );
  res.json({ levels: rows });
}));

const levelSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  order_index: z.number().int().optional(),
  is_active: z.boolean().optional(),
});
router.put('/levels/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = levelSchema.parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`); params.push(v);
  }
  if (!sets.length) throw httpError(400, 'No fields');
  params.push(id);
  const row = await one<any>(`UPDATE curriculum_levels SET ${sets.join(', ')} WHERE id=$${i} RETURNING *`, params);
  if (!row) throw httpError(404, 'Level not found');
  res.json({ level: row });
}));

// ── Course catalog CRUD ──────────────────────────────────────────────────────
router.get('/courses', asyncH(async (req, res) => {
  const levelId = req.query.levelId ? Number(req.query.levelId) : null;
  const params: any[] = [];
  let where = '';
  if (levelId) { where = 'WHERE c.level_id=$1'; params.push(levelId); }
  const { rows } = await query(
    `SELECT c.*, l.name AS level_name,
            (SELECT count(*) FROM catalog_chapters ch WHERE ch.catalog_id=c.id) AS chapter_count,
            (SELECT count(*) FROM catalog_grade_map m WHERE m.catalog_id=c.id) AS mapped_classes,
            COALESCE(
              (SELECT json_agg(json_build_object('grade_id', g.id, 'grade_name', g.name, 'grade_number', g.number))
               FROM catalog_grade_map m JOIN grades g ON g.id=m.grade_id WHERE m.catalog_id=c.id),
              '[]'::json
            ) AS mappings
     FROM course_catalog c
     LEFT JOIN curriculum_levels l ON l.id=c.level_id
     ${where}
     ORDER BY l.order_index NULLS LAST, c.order_index, c.title`,
    params
  );
  res.json({ courses: rows });
}));

router.get('/courses/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const course = await one<any>(
    `SELECT c.*, l.name AS level_name FROM course_catalog c
     LEFT JOIN curriculum_levels l ON l.id=c.level_id WHERE c.id=$1`, [id]
  );
  if (!course) throw httpError(404, 'Course not found');
  const { rows: chapters } = await query(
    `SELECT id, title, slug, summary, difficulty, est_minutes, order_index, is_published,
            length(content::text) AS content_size
     FROM catalog_chapters WHERE catalog_id=$1 ORDER BY order_index, id`, [id]
  );
  const { rows: mappings } = await query(
    `SELECT m.grade_id, g.name AS grade_name, g.number AS grade_number, m.deployed_module_id
     FROM catalog_grade_map m JOIN grades g ON g.id=m.grade_id WHERE m.catalog_id=$1 ORDER BY g.number`, [id]
  );
  res.json({ course, chapters, mappings });
}));

const catalogSchema = z.object({
  level_id: z.number().int().nullable().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  order_index: z.number().int().optional(),
});

router.post('/courses', asyncH(async (req, res) => {
  const d = catalogSchema.parse(req.body);
  const slug = d.slug || slugify(d.title);
  const ord = d.level_id
    ? await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM course_catalog WHERE level_id=$1`, [d.level_id])
    : await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM course_catalog`);
  const row = await one<any>(
    `INSERT INTO course_catalog (level_id, title, slug, icon, color, description, status, order_index, created_by, updated_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) RETURNING *`,
    [d.level_id ?? null, d.title, slug, d.icon ?? '📘', d.color ?? '#6366f1', d.description ?? '',
     d.status ?? 'draft', d.order_index ?? ord!.n, req.user!.id]
  );
  res.status(201).json({ course: row });
}));

const levelAssignSchema = z.object({ level_id: z.number().int().nullable() });
router.patch('/courses/:id/level', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const { level_id } = levelAssignSchema.parse(req.body);
  const row = await one<any>(
    `UPDATE course_catalog SET level_id=$1, updated_by=$2 WHERE id=$3 RETURNING *`,
    [level_id, req.user!.id, id]
  );
  if (!row) throw httpError(404, 'Course not found');
  res.json({ course: row });
}));

router.put('/courses/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = catalogSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`); params.push(v);
  }
  if (!sets.length) throw httpError(400, 'No fields');
  sets.push(`updated_by=$${i++}`); params.push(req.user!.id);
  params.push(id);
  const row = await one<any>(`UPDATE course_catalog SET ${sets.join(', ')} WHERE id=$${i} RETURNING *`, params);
  if (!row) throw httpError(404, 'Course not found');
  res.json({ course: row });
}));

router.delete('/courses/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  await query(`UPDATE modules SET catalog_id=NULL WHERE catalog_id=$1`, [id]);
  const r = await query(`DELETE FROM course_catalog WHERE id=$1`, [id]);
  if (!r.rowCount) throw httpError(404, 'Course not found');
  res.json({ ok: true });
}));

// ── Catalog chapters ─────────────────────────────────────────────────────────
const chapSchema = z.object({
  title: z.string().min(2),
  summary: z.string().optional(),
  difficulty: z.string().optional(),
  est_minutes: z.number().int().optional(),
  order_index: z.number().int().optional(),
  is_published: z.boolean().optional(),
  content: z.array(z.any()).optional(),
});

router.post('/courses/:id/chapters', asyncH(async (req, res) => {
  const catalogId = Number(req.params.id);
  const d = chapSchema.parse(req.body);
  const slug = slugify(d.title) + '-' + Date.now().toString(36).slice(-4);
  const ord = await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM catalog_chapters WHERE catalog_id=$1`, [catalogId]);
  const row = await one<any>(
    `INSERT INTO catalog_chapters (catalog_id, title, slug, summary, difficulty, est_minutes, content, order_index, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9) RETURNING *`,
    [catalogId, d.title, slug, d.summary ?? '', d.difficulty ?? 'beginner', d.est_minutes ?? 60,
     JSON.stringify(d.content ?? []), d.order_index ?? ord!.n, d.is_published ?? true]
  );
  res.status(201).json({ chapter: row });
}));

router.get('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const ch = await one<any>(`SELECT * FROM catalog_chapters WHERE id=$1`, [id]);
  if (!ch) throw httpError(404, 'Chapter not found');
  res.json({ chapter: ch });
}));

router.put('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = chapSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    if (k === 'content') { sets.push(`content=$${i++}::jsonb`); params.push(JSON.stringify(v)); }
    else { sets.push(`${k}=$${i++}`); params.push(v); }
  }
  if (!sets.length) throw httpError(400, 'No fields');
  params.push(id);
  const row = await one<any>(`UPDATE catalog_chapters SET ${sets.join(', ')} WHERE id=$${i} RETURNING *`, params);
  if (!row) throw httpError(404, 'Chapter not found');
  res.json({ chapter: row });
}));

router.delete('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const r = await query(`DELETE FROM catalog_chapters WHERE id=$1`, [id]);
  if (!r.rowCount) throw httpError(404, 'Chapter not found');
  res.json({ ok: true });
}));

// ── Class mapping & sync ─────────────────────────────────────────────────────
router.put('/courses/:id/mappings', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const gradeIds = z.array(z.number().int()).parse(req.body.grade_ids ?? []);
  await setCatalogMappings(id, gradeIds, req.user!.id);
  const { rows } = await query(
    `SELECT m.grade_id, g.name AS grade_name, g.number AS grade_number, m.deployed_module_id
     FROM catalog_grade_map m JOIN grades g ON g.id=m.grade_id WHERE m.catalog_id=$1 ORDER BY g.number`, [id]
  );
  res.json({ mappings: rows });
}));

router.post('/courses/:id/sync', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const n = await syncAllDeployments(id, req.user!.id);
  res.json({ ok: true, synced_classes: n });
}));

router.post('/courses/:id/deploy/:gradeId', asyncH(async (req, res) => {
  const catalogId = Number(req.params.id);
  const gradeId = Number(req.params.gradeId);
  const moduleId = await deployCatalogToGrade(catalogId, gradeId, req.user!.id);
  res.json({ ok: true, module_id: moduleId });
}));

export default router;
