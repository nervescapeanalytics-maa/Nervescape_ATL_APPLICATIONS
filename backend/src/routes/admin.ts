import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { one, query } from '../db/pool';
import { authenticate, authorize } from '../middleware/auth';
import { asyncH, httpError } from '../middleware/error';
import { config } from '../config';
import { invalidateFeatureCache } from '../services/ai';

const router = Router();
router.use(authenticate, authorize('admin'));

// ---- dashboard analytics ----
router.get('/overview', asyncH(async (_req, res) => {
  const stats = await one<any>(
    `SELECT
       (SELECT count(*) FROM users WHERE role='teacher') AS teachers,
       (SELECT count(*) FROM users WHERE role='student') AS students,
       (SELECT count(*) FROM grades WHERE is_active) AS classes,
       (SELECT count(*) FROM modules) AS modules,
       (SELECT count(*) FROM chapters) AS chapters,
       (SELECT count(*) FROM questions) AS questions,
       (SELECT count(*) FROM quiz_attempts) AS attempts`
  );
  const { rows: perGrade } = await query(
    `SELECT g.id, g.name,
       (SELECT count(*) FROM users u WHERE u.grade_id=g.id AND u.role='student') AS students,
       (SELECT count(*) FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=g.id) AS chapters
     FROM grades g WHERE g.is_active ORDER BY g.number`
  );
  const { rows: recent } = await query(
    `SELECT a.action, a.entity, a.created_at, u.full_name AS actor
     FROM activity_log a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT 15`
  );
  res.json({ stats, perGrade, recent });
}));

// ---- users CRUD ----
router.get('/users', asyncH(async (req, res) => {
  const role = req.query.role as string | undefined;
  const params: any[] = [];
  let sql = `SELECT u.id, u.role, u.full_name, u.email, u.username, u.grade_id, g.name AS grade_name,
                    u.is_active, u.last_login, u.created_at
             FROM users u LEFT JOIN grades g ON g.id=u.grade_id`;
  if (role) { params.push(role); sql += ` WHERE u.role=$1`; }
  sql += ` ORDER BY u.role, u.created_at DESC`;
  const { rows } = await query(sql, params);
  res.json({ users: rows });
}));

const createUserSchema = z.object({
  role: z.enum(['teacher', 'student', 'admin']),
  full_name: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  grade_id: z.number().int().optional().nullable(),
  phone: z.string().optional(),
});

router.post('/users', asyncH(async (req, res) => {
  const data = createUserSchema.parse(req.body);
  const exists = await one(`SELECT 1 FROM users WHERE lower(email)=lower($1)`, [data.email]);
  if (exists) throw httpError(409, 'Email already in use');
  const defaultPwd = data.role === 'admin' ? 'Admin@2026' : data.role === 'teacher' ? config.seed.teacherPassword : config.seed.studentPassword;
  const pwd = data.password || defaultPwd;
  const hash = await bcrypt.hash(pwd, config.bcryptRounds);
  const u = await one<any>(
    `INSERT INTO users (role, full_name, email, username, password_hash, grade_id, phone, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, role, full_name, email, username, grade_id`,
    [data.role, data.full_name, data.email, data.username || null, hash, data.grade_id ?? null, data.phone ?? null, req.user!.id]
  );
  await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'create_user',$2,$3)`,
    [req.user!.id, data.role, u!.id]);
  res.status(201).json({ user: u, defaultPassword: data.password ? undefined : pwd });
}));

const updateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).optional().nullable(),
  grade_id: z.number().int().optional().nullable(),
  is_active: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

router.put('/users/:id', asyncH(async (req, res) => {
  const data = updateUserSchema.parse(req.body);
  const sets: string[] = [];
  const params: any[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(data)) {
    if (k === 'password') continue;
    if (v !== undefined) { sets.push(`${k}=$${i++}`); params.push(v); }
  }
  if (data.password) { sets.push(`password_hash=$${i++}`); params.push(await bcrypt.hash(data.password, config.bcryptRounds)); }
  if (!sets.length) throw httpError(400, 'No fields to update');
  params.push(req.params.id);
  const u = await one<any>(`UPDATE users SET ${sets.join(', ')} WHERE id=$${i} RETURNING id, role, full_name, email, grade_id, is_active`, params);
  if (!u) throw httpError(404, 'User not found');
  res.json({ user: u });
}));

router.delete('/users/:id', asyncH(async (req, res) => {
  if (req.params.id === req.user!.id) throw httpError(400, 'You cannot delete your own account');
  const r = await query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
  if (!r.rowCount) throw httpError(404, 'User not found');
  res.json({ ok: true });
}));

// ---- teacher assignments (wire teacher -> grade/module) ----
router.get('/assignments', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT ta.id, ta.teacher_id, t.full_name AS teacher, t.email AS teacher_email,
            ta.grade_id, g.name AS grade,
            ta.module_id, m.title AS module, m.icon AS module_icon,
            (SELECT count(*)::int FROM users u WHERE u.role='student' AND u.grade_id=ta.grade_id) AS students,
            (SELECT count(*)::int FROM chapters c JOIN modules mm ON mm.id=c.module_id
              WHERE mm.grade_id=ta.grade_id AND ($1::int IS NULL OR mm.id=ta.module_id)) AS chapters,
            ta.created_at
     FROM teacher_assignments ta
     JOIN users t ON t.id=ta.teacher_id
     JOIN grades g ON g.id=ta.grade_id
     LEFT JOIN modules m ON m.id=ta.module_id
     ORDER BY t.full_name, g.number`, [null]
  );
  res.json({ assignments: rows });
}));

const assignSchema = z.object({ teacher_id: z.string().uuid(), grade_id: z.number().int(), module_id: z.number().int().nullable().optional() });
router.post('/assignments', asyncH(async (req, res) => {
  const d = assignSchema.parse(req.body);
  const a = await one<any>(
    `INSERT INTO teacher_assignments (teacher_id, grade_id, module_id, assigned_by)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (teacher_id, grade_id, module_id) DO NOTHING
     RETURNING id`,
    [d.teacher_id, d.grade_id, d.module_id ?? null, req.user!.id]
  );
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'assign_teacher', 'teacher_assignments', a?.id ? String(a.id) : '-',
     JSON.stringify({ teacher_id: d.teacher_id, grade_id: d.grade_id, module_id: d.module_id ?? null })]
  );
  res.status(201).json({ id: a?.id ?? null });
}));

// Bulk assign — wire one teacher to many grades and/or many modules
const bulkAssignSchema = z.object({
  teacher_id: z.string().uuid(),
  grade_ids: z.array(z.number().int()).default([]),
  module_ids: z.array(z.number().int()).default([]),
});
router.post('/assignments/bulk', asyncH(async (req, res) => {
  const d = bulkAssignSchema.parse(req.body);
  let created = 0;
  // grade-level (module_id NULL) for each grade
  for (const gid of d.grade_ids) {
    const r = await one<any>(
      `INSERT INTO teacher_assignments (teacher_id, grade_id, module_id, assigned_by)
       VALUES ($1,$2,NULL,$3) ON CONFLICT (teacher_id, grade_id, module_id) DO NOTHING RETURNING id`,
      [d.teacher_id, gid, req.user!.id]
    );
    if (r) created++;
  }
  // module-specific assignments — derive grade_id from module
  if (d.module_ids.length) {
    const { rows: mods } = await query<{ id: number; grade_id: number }>(
      `SELECT id, grade_id FROM modules WHERE id = ANY($1)`, [d.module_ids]
    );
    for (const m of mods) {
      const r = await one<any>(
        `INSERT INTO teacher_assignments (teacher_id, grade_id, module_id, assigned_by)
         VALUES ($1,$2,$3,$4) ON CONFLICT (teacher_id, grade_id, module_id) DO NOTHING RETURNING id`,
        [d.teacher_id, m.grade_id, m.id, req.user!.id]
      );
      if (r) created++;
    }
  }
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'assign_teacher_bulk', 'teacher_assignments', d.teacher_id, JSON.stringify({ created, ...d })]
  );
  res.status(201).json({ created });
}));

router.delete('/assignments/:id', asyncH(async (req, res) => {
  await query(`DELETE FROM teacher_assignments WHERE id=$1`, [Number(req.params.id)]);
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)`,
    [req.user!.id, 'unassign_teacher', 'teacher_assignments', req.params.id]
  );
  res.json({ ok: true });
}));

// ---- modules CRUD (Item 14: Course management) ----
const moduleSchema = z.object({
  grade_id: z.number().int(),
  title: z.string().min(2),
  slug: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  order_index: z.number().int().optional(),
});
router.post('/modules', asyncH(async (req, res) => {
  const d = moduleSchema.parse(req.body);
  const slug = (d.slug || d.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const ord = await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM modules WHERE grade_id=$1`, [d.grade_id]);
  const m = await one<any>(
    `INSERT INTO modules (grade_id, title, slug, icon, color, description, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, title, slug`,
    [d.grade_id, d.title, slug, d.icon ?? '📘', d.color ?? '#6366f1', d.description ?? '', d.order_index ?? ord!.n]
  );
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'create_module', 'module', String(m!.id), JSON.stringify({ grade_id: d.grade_id, title: d.title })]
  );
  res.status(201).json({ module: m });
}));

router.put('/modules/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = moduleSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`); params.push(v);
  }
  if (!sets.length) throw httpError(400, 'No fields');
  params.push(id);
  const m = await one<any>(`UPDATE modules SET ${sets.join(', ')} WHERE id=$${i} RETURNING id, title`, params);
  if (!m) throw httpError(404, 'Module not found');
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'update_module', 'module', String(id), JSON.stringify(d)]
  );
  res.json({ module: m });
}));

router.delete('/modules/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const usage = await one<any>(`SELECT count(*)::int AS n FROM chapters WHERE module_id=$1`, [id]);
  if (usage && usage.n > 0) {
    throw httpError(409, `Module has ${usage.n} chapter(s). Delete chapters first or use ?force=1.`);
  }
  await query(`DELETE FROM teacher_assignments WHERE module_id=$1`, [id]);
  const r = await query(`DELETE FROM modules WHERE id=$1`, [id]);
  if (!r.rowCount) throw httpError(404, 'Module not found');
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)`,
    [req.user!.id, 'delete_module', 'module', String(id)]
  );
  res.json({ ok: true });
}));

// ---- chapter CRUD (admin) ----
// (teacher.ts already exposes POST /teacher/chapters and PUT /teacher/chapters/:id;
//  expose the same for admins plus a DELETE)
const chapterCreateSchema = z.object({
  module_id: z.number().int(),
  title: z.string().min(2),
  summary: z.string().optional(),
  difficulty: z.string().default('beginner'),
  est_minutes: z.number().int().optional(),
});
router.post('/chapters', asyncH(async (req, res) => {
  const d = chapterCreateSchema.parse(req.body);
  const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + Date.now().toString(36);
  const ord = await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM chapters WHERE module_id=$1`, [d.module_id]);
  const ch = await one<any>(
    `INSERT INTO chapters (module_id, title, slug, summary, difficulty, est_minutes, order_index, created_by, updated_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING id, title, slug`,
    [d.module_id, d.title, slug, d.summary ?? '', d.difficulty, d.est_minutes ?? 60, ord!.n, req.user!.id]
  );
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)`,
    [req.user!.id, 'create_chapter', 'chapter', String(ch!.id)]
  );
  res.status(201).json({ chapter: ch });
}));

const chapterPatchSchema = z.object({
  title: z.string().min(2).optional(),
  summary: z.string().optional(),
  difficulty: z.string().optional(),
  est_minutes: z.number().int().optional(),
  order_index: z.number().int().optional(),
  is_published: z.boolean().optional(),
  hero_image: z.string().nullable().optional(),
  content: z.array(z.any()).optional(),       // rich block content editable by admin
});
router.put('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = chapterPatchSchema.parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    // content is a JSON array — cast to jsonb in the SET clause
    if (k === 'content') {
      sets.push(`content=$${i++}::jsonb`);
      params.push(JSON.stringify(v));
    } else {
      sets.push(`${k}=$${i++}`); params.push(v);
    }
  }
  sets.push(`updated_by=$${i++}`); params.push(req.user!.id);
  if (sets.length === 1) throw httpError(400, 'No fields');
  params.push(id);
  const ch = await one<any>(`UPDATE chapters SET ${sets.join(', ')} WHERE id=$${i} RETURNING id, title, is_published`, params);
  if (!ch) throw httpError(404, 'Chapter not found');
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'update_chapter', 'chapter', String(id), JSON.stringify({ ...d, content: d.content ? `[${d.content.length} blocks]` : undefined })]
  );
  res.json({ chapter: ch });
}));

router.delete('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  // cascade in correct order
  await query(`DELETE FROM facts WHERE chapter_id=$1`, [id]);
  await query(`DELETE FROM questions WHERE chapter_id=$1`, [id]);
  await query(`DELETE FROM challenge_submissions WHERE chapter_id=$1`, [id]);
  await query(`DELETE FROM chat_messages WHERE chapter_id=$1`, [id]);
  await query(`DELETE FROM quiz_attempts WHERE chapter_id=$1`, [id]);
  await query(`DELETE FROM progress WHERE chapter_id=$1`, [id]);
  const r = await query(`DELETE FROM chapters WHERE id=$1`, [id]);
  if (!r.rowCount) throw httpError(404, 'Chapter not found');
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)`,
    [req.user!.id, 'delete_chapter', 'chapter', String(id)]
  );
  res.json({ ok: true });
}));

// ---- activity feed ----
router.get('/activity', asyncH(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Number(req.query.offset) || 0;
  const { rows } = await query(
    `SELECT a.id, a.action, a.entity, a.entity_id, a.created_at,
            u.full_name AS actor, u.role AS actor_role
     FROM activity_log a
     LEFT JOIN users u ON u.id = a.actor_id
     ORDER BY a.created_at DESC
     LIMIT $1 OFFSET $2`, [limit, offset]
  );
  const total = await one<any>(`SELECT count(*)::int AS n FROM activity_log`);
  res.json({ activities: rows, total: total?.n ?? 0 });
}));

// ---- user extended profile (admin view/edit) ----
const adminProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).optional().nullable(),
  grade_id: z.number().int().optional().nullable(),
  is_active: z.boolean().optional(),
  phone: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  blood_group: z.string().optional().nullable(),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  parent_name: z.string().optional().nullable(),
  parent_phone: z.string().optional().nullable(),
  parent_email: z.string().email().optional().nullable(),
  parent_relation: z.string().optional().nullable(),
  parent_occupation: z.string().optional().nullable(),
  school_name: z.string().optional().nullable(),
  school_city: z.string().optional().nullable(),
  roll_number: z.string().optional().nullable(),
  admission_year: z.number().int().optional().nullable(),
  hobbies: z.string().optional().nullable(),
  languages: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  emergency_contact: z.string().optional().nullable(),
  emergency_phone: z.string().optional().nullable(),
});

router.get('/users/:id/profile', asyncH(async (req, res) => {
  const u = await one<any>(
    `SELECT u.id, u.role, u.full_name, u.email, u.username, u.grade_id, g.name AS grade_name,
            u.phone, u.avatar_url, u.is_active, u.last_login, u.created_at,
            p.date_of_birth, p.gender, p.blood_group, p.address_line1, p.address_line2,
            p.city, p.state, p.country, p.pincode,
            p.parent_name, p.parent_phone, p.parent_email, p.parent_relation, p.parent_occupation,
            p.school_name, p.school_city, p.roll_number, p.admission_year,
            p.hobbies, p.languages, p.bio, p.emergency_contact, p.emergency_phone
     FROM users u
     LEFT JOIN grades g ON g.id = u.grade_id
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id = $1`, [req.params.id]
  );
  if (!u) throw httpError(404, 'User not found');
  res.json({ profile: u });
}));

router.put('/users/:id/profile', asyncH(async (req, res) => {
  const data = adminProfileSchema.parse(req.body);
  const baseFields: Record<string, any> = {};
  const extFields: Record<string, any> = {};
  const BASE_COLS = new Set(['full_name', 'email', 'username', 'grade_id', 'is_active', 'phone']);
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    if (BASE_COLS.has(k)) baseFields[k] = v;
    else extFields[k] = v;
  }
  if (Object.keys(baseFields).length) {
    const sets: string[] = []; const vals: any[] = []; let i = 1;
    for (const [k, v] of Object.entries(baseFields)) { sets.push(`${k}=$${i++}`); vals.push(v); }
    vals.push(req.params.id);
    await query(`UPDATE users SET ${sets.join(', ')}, updated_at=now() WHERE id=$${i}`, vals);
  }
  const extKeys = Object.keys(extFields);
  if (extKeys.length) {
    const cols = extKeys.join(', ');
    const vals = [req.params.id, ...extKeys.map(k => extFields[k])];
    const placeholders = extKeys.map((_, i) => `$${i + 2}`).join(', ');
    const updates = extKeys.map((k, i) => `${k}=$${i + 2}`).join(', ');
    await query(
      `INSERT INTO user_profiles (user_id, ${cols}) VALUES ($1, ${placeholders})
       ON CONFLICT (user_id) DO UPDATE SET ${updates}, updated_at=now()`, vals
    );
  }
  res.json({ ok: true });
}));

router.post('/users/:id/reset-password', asyncH(async (req, res) => {
  const { password } = z.object({ password: z.string().min(6) }).parse(req.body);
  const hash = await bcrypt.hash(password, config.bcryptRounds);
  const u = await one<any>(`UPDATE users SET password_hash=$1, updated_at=now() WHERE id=$2 RETURNING id`, [hash, req.params.id]);
  if (!u) throw httpError(404, 'User not found');
  await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'reset_password','user',$2)`, [req.user!.id, req.params.id]);
  res.json({ ok: true });
}));

// ---- schools CRUD ----
const schoolSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().default('India'),
  contact_email: z.string().email().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  principal: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

router.get('/schools', asyncH(async (_req, res) => {
  const { rows } = await query(`SELECT * FROM schools ORDER BY name`);
  res.json({ schools: rows });
}));

router.post('/schools', asyncH(async (req, res) => {
  const d = schoolSchema.parse(req.body);
  const s = await one<any>(
    `INSERT INTO schools (name, code, city, state, country, contact_email, contact_phone, principal, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [d.name, d.code ?? null, d.city ?? null, d.state ?? null, d.country ?? 'India',
     d.contact_email ?? null, d.contact_phone ?? null, d.principal ?? null, d.is_active ?? true]
  );
  res.status(201).json({ school: s });
}));

router.put('/schools/:id', asyncH(async (req, res) => {
  const d = schoolSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`); params.push(v);
  }
  if (!sets.length) throw httpError(400, 'No fields');
  params.push(Number(req.params.id));
  const s = await one<any>(`UPDATE schools SET ${sets.join(', ')} WHERE id=$${i} RETURNING id`, params);
  if (!s) throw httpError(404, 'School not found');
  res.json({ ok: true });
}));

router.delete('/schools/:id', asyncH(async (req, res) => {
  await query(`DELETE FROM schools WHERE id=$1`, [Number(req.params.id)]);
  res.json({ ok: true });
}));

// ---- AI monitoring ----
router.get('/ai/usage', asyncH(async (_req, res) => {
  const summary = await one<any>(
    `SELECT
       COALESCE(SUM(total_tokens), 0)::int AS total_tokens,
       COALESCE(SUM(prompt_tokens), 0)::int AS prompt_tokens,
       COALESCE(SUM(completion_tokens), 0)::int AS completion_tokens,
       COUNT(*)::int AS total_calls
     FROM ai_usage WHERE created_at >= date_trunc('month', now())`
  );
  const { rows: byFeature } = await query(
    `SELECT feature, COUNT(*)::int AS calls, COALESCE(SUM(total_tokens),0)::int AS tokens
     FROM ai_usage WHERE created_at >= date_trunc('month', now())
     GROUP BY feature ORDER BY tokens DESC`
  );
  const { rows: daily } = await query(
    `SELECT date_trunc('day', created_at)::date AS day, COALESCE(SUM(total_tokens),0)::int AS tokens
     FROM ai_usage WHERE created_at >= now() - interval '30 days'
     GROUP BY 1 ORDER BY 1`
  );
  const { rows: configRows } = await query(`SELECT key, value FROM ai_config ORDER BY key`);
  const aiCfg: Record<string, string> = {};
  for (const r of configRows) aiCfg[r.key] = r.value;
  res.json({ summary, byFeature, daily, config: aiCfg });
}));

router.put('/ai/config', asyncH(async (req, res) => {
  const updates = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(updates)) {
    await query(
      `INSERT INTO ai_config (key, value, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=now()`, [key, String(value)]
    );
  }
  res.json({ ok: true });
}));

// ---- grades list (for dropdowns + management) ----
router.get('/grades', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT g.id, g.number, g.name, g.level_label, g.description, g.is_active, g.created_at,
       (SELECT count(*)::int FROM modules m WHERE m.grade_id=g.id) AS modules,
       (SELECT count(*)::int FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=g.id) AS chapters,
       (SELECT count(*)::int FROM users u WHERE u.role='student' AND u.grade_id=g.id) AS students
     FROM grades g ORDER BY g.number`
  );
  res.json({ grades: rows });
}));

// ============================================================
// PHASE 2: per-feature LLM config, IAM matrix, retention, reports
// ============================================================

// Per-feature LLM configuration (Item 11)
router.get('/ai/features', asyncH(async (_req, res) => {
  const { rows: features } = await query(
    `SELECT feature_key, display_name, provider, model, base_url,
            CASE WHEN api_key IS NULL OR api_key='' THEN '' ELSE '••••••' END AS api_key_mask,
            (api_key IS NOT NULL AND api_key<>'') AS has_key,
            monthly_budget, enabled, updated_at
       FROM ai_features ORDER BY feature_key`
  );
  // per-feature current month token usage
  const { rows: usage } = await query(
    `SELECT feature, COALESCE(SUM(total_tokens),0)::int AS tokens, COUNT(*)::int AS calls
       FROM ai_usage WHERE created_at >= date_trunc('month', now())
       GROUP BY feature`
  );
  const usageMap: Record<string, { tokens: number; calls: number }> = {};
  for (const u of usage) usageMap[u.feature] = { tokens: u.tokens, calls: u.calls };
  // per-feature daily usage (last 14 days) for sparkline
  const { rows: daily } = await query(
    `SELECT feature, date_trunc('day', created_at)::date AS day, COALESCE(SUM(total_tokens),0)::int AS tokens
       FROM ai_usage WHERE created_at >= now() - interval '14 days'
       GROUP BY 1,2 ORDER BY 2`
  );
  const dailyMap: Record<string, { day: string; tokens: number }[]> = {};
  for (const d of daily) {
    const day = (d.day instanceof Date ? d.day.toISOString().slice(0, 10) : String(d.day));
    (dailyMap[d.feature] ||= []).push({ day, tokens: d.tokens });
  }
  const enriched = features.map((f) => ({
    ...f,
    used_tokens: usageMap[f.feature_key]?.tokens || 0,
    calls_this_month: usageMap[f.feature_key]?.calls || 0,
    daily: dailyMap[f.feature_key] || [],
  }));
  res.json({ features: enriched });
}));

const featureUpdateSchema = z.object({
  display_name: z.string().min(1).optional(),
  provider: z.enum(['offline', 'openai', 'gemini', 'claude', 'anthropic', 'custom']).optional(),
  model: z.string().min(1).optional(),
  base_url: z.string().min(1).optional(),
  api_key: z.string().optional(),  // empty string = clear; literal "••••••" = keep
  monthly_budget: z.number().int().positive().optional(),
  enabled: z.boolean().optional(),
});
router.put('/ai/features/:key', asyncH(async (req, res) => {
  const key = req.params.key;
  const d = featureUpdateSchema.parse(req.body);
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (k === 'api_key' && v === '••••••') continue; // preserve existing
    fields.push(`${k} = $${i++}`);
    values.push(v);
  }
  if (!fields.length) return res.json({ ok: true });
  fields.push(`updated_at = now()`);
  values.push(key);
  await query(`UPDATE ai_features SET ${fields.join(', ')} WHERE feature_key = $${i}`, values);
  invalidateFeatureCache();
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'ai_feature_update', 'ai_features', key, JSON.stringify({ ...d, api_key: d.api_key ? '***' : undefined })]
  );
  res.json({ ok: true });
}));

// ---- IAM permissions matrix (Item 17) ----
router.get('/iam/permissions', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT role, resource, can_view, can_create, can_edit, can_delete, updated_at
       FROM iam_permissions ORDER BY role, resource`
  );
  res.json({ permissions: rows });
}));

const iamUpdateSchema = z.object({
  can_view: z.boolean().optional(),
  can_create: z.boolean().optional(),
  can_edit: z.boolean().optional(),
  can_delete: z.boolean().optional(),
});
router.put('/iam/permissions/:role/:resource', asyncH(async (req, res) => {
  const { role, resource } = req.params;
  const d = iamUpdateSchema.parse(req.body);
  if (role === 'admin') {
    // Guardrail: do not let admin lock themselves out by removing view rights from admin-managed resources
    if (d.can_view === false) throw httpError(400, 'Cannot disable admin view permission');
  }
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(d)) {
    fields.push(`${k} = $${i++}`);
    values.push(v);
  }
  if (!fields.length) return res.json({ ok: true });
  fields.push(`updated_at = now()`);
  values.push(role, resource);
  await query(
    `UPDATE iam_permissions SET ${fields.join(', ')} WHERE role = $${i} AND resource = $${i + 1}`,
    values
  );
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'iam_update', 'iam_permissions', `${role}:${resource}`, JSON.stringify(d)]
  );
  res.json({ ok: true });
}));

// ---- Log retention policy (Item 18) ----
const RETENTION_KEYS = ['retention_activity_days', 'retention_ai_usage_days', 'retention_chat_days', 'retention_quiz_days'] as const;

router.get('/retention', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT key, value, updated_at FROM ai_config WHERE key = ANY($1)`,
    [RETENTION_KEYS]
  );
  const map: Record<string, { value: string; updated_at: any }> = {};
  for (const r of rows) map[r.key] = { value: r.value, updated_at: r.updated_at };
  // Counts of records older than each retention threshold (so admin can preview)
  const stats = await one<any>(`SELECT
    (SELECT count(*) FROM activity_log) AS activity_total,
    (SELECT count(*) FROM ai_usage)     AS ai_usage_total,
    (SELECT count(*) FROM chat_messages) AS chat_total,
    (SELECT count(*) FROM quiz_attempts) AS quiz_total`);
  res.json({ retention: map, stats });
}));

router.put('/retention', asyncH(async (req, res) => {
  const updates = req.body as Record<string, number | string>;
  for (const [key, value] of Object.entries(updates)) {
    if (!RETENTION_KEYS.includes(key as any)) continue;
    const days = Math.max(7, Math.min(3650, Number(value) || 180));
    await query(
      `INSERT INTO ai_config (key, value, updated_at) VALUES ($1,$2,now())
       ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=now()`,
      [key, String(days)]
    );
  }
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'retention_update', 'ai_config', 'retention', JSON.stringify(updates)]
  );
  res.json({ ok: true });
}));

router.post('/retention/purge', asyncH(async (req, res) => {
  const { rows: cfg } = await query(
    `SELECT key, value FROM ai_config WHERE key = ANY($1)`,
    [RETENTION_KEYS]
  );
  const days: Record<string, number> = {};
  for (const r of cfg) days[r.key] = Math.max(7, Number(r.value) || 180);
  const purged = {
    activity: 0,
    ai_usage: 0,
    chat: 0,
    quiz: 0,
  };
  if (days['retention_activity_days']) {
    const r = await query(`DELETE FROM activity_log WHERE created_at < now() - ($1 || ' days')::interval`, [days['retention_activity_days']]);
    purged.activity = r.rowCount || 0;
  }
  if (days['retention_ai_usage_days']) {
    const r = await query(`DELETE FROM ai_usage WHERE created_at < now() - ($1 || ' days')::interval`, [days['retention_ai_usage_days']]);
    purged.ai_usage = r.rowCount || 0;
  }
  if (days['retention_chat_days']) {
    const r = await query(`DELETE FROM chat_messages WHERE created_at < now() - ($1 || ' days')::interval`, [days['retention_chat_days']]);
    purged.chat = r.rowCount || 0;
  }
  if (days['retention_quiz_days']) {
    const r = await query(`DELETE FROM quiz_attempts WHERE created_at < now() - ($1 || ' days')::interval`, [days['retention_quiz_days']]);
    purged.quiz = r.rowCount || 0;
  }
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'retention_purge', 'maintenance', 'manual', JSON.stringify(purged)]
  );
  res.json({ ok: true, purged });
}));

// ---- Reports management (Item 16) ----
router.get('/reports/students', asyncH(async (req, res) => {
  const gradeId = req.query.grade_id ? Number(req.query.grade_id) : null;
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email, u.username, g.name AS grade,
            COALESCE(p.completed,0)::int AS chapters_completed,
            COALESCE(p.avg_score,0)::int AS avg_score,
            COALESCE(qa.attempts,0)::int AS quiz_attempts,
            u.last_login, u.created_at
       FROM users u
       LEFT JOIN grades g ON g.id = u.grade_id
       LEFT JOIN (SELECT student_id, count(*) FILTER (WHERE status='completed') AS completed,
                         AVG(best_score)::int AS avg_score
                  FROM progress GROUP BY student_id) p ON p.student_id = u.id
       LEFT JOIN (SELECT student_id, count(*) AS attempts FROM quiz_attempts GROUP BY student_id) qa ON qa.student_id = u.id
       WHERE u.role = 'student' AND ($1::int IS NULL OR u.grade_id = $1)
       ORDER BY u.full_name`,
    [gradeId]
  );
  res.json({ rows });
}));

router.get('/reports/teachers', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email, u.username,
            COALESCE(ta.assignments,0)::int AS class_assignments,
            COALESCE(lp.lesson_plans,0)::int AS lesson_plans,
            COALESCE(qg.quiz_gen_calls,0)::int AS quiz_gen_calls,
            u.last_login, u.created_at
       FROM users u
       LEFT JOIN (SELECT teacher_id, count(*) AS assignments FROM teacher_assignments GROUP BY teacher_id) ta ON ta.teacher_id = u.id
       LEFT JOIN (SELECT teacher_id, count(*) AS lesson_plans FROM lesson_plans GROUP BY teacher_id) lp ON lp.teacher_id = u.id
       LEFT JOIN (SELECT user_id, count(*) AS quiz_gen_calls FROM ai_usage WHERE feature='quiz_gen' GROUP BY user_id) qg ON qg.user_id = u.id
       WHERE u.role = 'teacher'
       ORDER BY u.full_name`
  );
  res.json({ rows });
}));

router.get('/reports/ai', asyncH(async (req, res) => {
  const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
  const { rows } = await query(
    `SELECT feature, model, COUNT(*)::int AS calls,
            COALESCE(SUM(prompt_tokens),0)::int AS prompt_tokens,
            COALESCE(SUM(completion_tokens),0)::int AS completion_tokens,
            COALESCE(SUM(total_tokens),0)::int AS total_tokens,
            MAX(created_at) AS last_call
       FROM ai_usage WHERE created_at >= now() - ($1 || ' days')::interval
       GROUP BY feature, model ORDER BY total_tokens DESC`,
    [days]
  );
  res.json({ rows, days });
}));

// ---- Audit log (Item 15) — extended with filters & meta ----
router.get('/audit', asyncH(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const offset = Number(req.query.offset) || 0;
  const action = (req.query.action as string) || '';
  const entity = (req.query.entity as string) || '';
  const actorId = (req.query.actor_id as string) || '';
  const since = (req.query.since as string) || ''; // ISO date
  const until = (req.query.until as string) || '';
  const where: string[] = [];
  const args: any[] = [];
  let i = 1;
  if (action) { where.push(`a.action = $${i++}`); args.push(action); }
  if (entity) { where.push(`a.entity = $${i++}`); args.push(entity); }
  if (actorId) { where.push(`a.actor_id = $${i++}`); args.push(actorId); }
  if (since) { where.push(`a.created_at >= $${i++}`); args.push(since); }
  if (until) { where.push(`a.created_at <= $${i++}`); args.push(until); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT a.id, a.action, a.entity, a.entity_id, a.meta, a.created_at,
            u.full_name AS actor, u.role AS actor_role, u.email AS actor_email
       FROM activity_log a
       LEFT JOIN users u ON u.id = a.actor_id
       ${whereSql}
       ORDER BY a.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...args, limit, offset]
  );
  const total = await one<any>(`SELECT count(*)::int AS n FROM activity_log a ${whereSql}`, args);
  // facets for filter dropdowns
  const { rows: actions } = await query(`SELECT DISTINCT action FROM activity_log ORDER BY action LIMIT 100`);
  const { rows: entities } = await query(`SELECT DISTINCT entity FROM activity_log WHERE entity IS NOT NULL ORDER BY entity LIMIT 100`);
  res.json({ activities: rows, total: total?.n ?? 0, actions: actions.map((a) => a.action), entities: entities.map((e) => e.entity) });
}));

// ---- grades (classes) management ----
const gradeSchema = z.object({
  number: z.number().int().min(1).max(12),
  name: z.string().min(2),
  level_label: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

router.post('/grades', asyncH(async (req, res) => {
  const d = gradeSchema.parse(req.body);
  const existing = await one<any>(`SELECT id, is_active FROM grades WHERE number=$1`, [d.number]);
  if (existing) {
    // activate existing placeholder grade
    const g = await one<any>(
      `UPDATE grades SET name=$1, level_label=$2, description=$3, is_active=TRUE WHERE id=$4 RETURNING id, number, name, is_active`,
      [d.name, d.level_label ?? null, d.description ?? null, existing.id]
    );
    await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'activate_grade','grade',$2)`, [req.user!.id, String(existing.id)]);
    res.json({ grade: g });
  } else {
    const g = await one<any>(
      `INSERT INTO grades (number, name, level_label, description, is_active) VALUES ($1,$2,$3,$4,TRUE) RETURNING id, number, name, is_active`,
      [d.number, d.name, d.level_label ?? null, d.description ?? null]
    );
    await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'create_grade','grade',$2)`, [req.user!.id, String(g!.id)]);
    res.status(201).json({ grade: g });
  }
}));

router.put('/grades/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = gradeSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`); params.push(v);
  }
  if (!sets.length) throw httpError(400, 'No fields to update');
  params.push(id);
  const g = await one<any>(`UPDATE grades SET ${sets.join(', ')} WHERE id=$${i} RETURNING id, number, name, is_active`, params);
  if (!g) throw httpError(404, 'Grade not found');
  await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'update_grade','grade',$2)`, [req.user!.id, String(id)]);
  res.json({ grade: g });
}));

// =====================================================================
// TEACHING ROLES — named permission bundles for teachers
// =====================================================================
router.get('/roles', asyncH(async (_req, res) => {
  const { rows: roles } = await query(
    `SELECT tr.id, tr.name, tr.description, tr.color, tr.created_at,
       (SELECT count(*)::int FROM teaching_role_assignments tra WHERE tra.role_id=tr.id) AS teacher_count,
       json_agg(json_build_object('scope_id',trs.id,'grade_id',trs.grade_id,'grade_name',g.name,'module_id',trs.module_id,'module_title',m.title,'module_icon',m.icon) ORDER BY g.number, m.order_index) FILTER (WHERE trs.id IS NOT NULL) AS scopes
     FROM teaching_roles tr
     LEFT JOIN teaching_role_scopes trs ON trs.role_id=tr.id
     LEFT JOIN grades g ON g.id=trs.grade_id
     LEFT JOIN modules m ON m.id=trs.module_id
     GROUP BY tr.id ORDER BY tr.name`
  );
  res.json({ roles });
}));

const roleSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().optional(),
  color: z.string().optional(),
  scopes: z.array(z.object({ grade_id: z.number().int(), module_id: z.number().int().nullable().optional() })).default([]),
});

router.post('/roles', asyncH(async (req, res) => {
  const d = roleSchema.parse(req.body);
  const role = await one<any>(
    `INSERT INTO teaching_roles (name, description, color, created_by) VALUES ($1,$2,$3,$4) RETURNING id, name`,
    [d.name, d.description ?? '', d.color ?? '#6366f1', req.user!.id]
  );
  if (d.scopes.length) {
    for (const s of d.scopes) {
      await query(
        `INSERT INTO teaching_role_scopes (role_id, grade_id, module_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
        [role!.id, s.grade_id, s.module_id ?? null]
      );
    }
  }
  await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'create_role','teaching_role',$2)`, [req.user!.id, String(role!.id)]);
  res.status(201).json({ role });
}));

router.put('/roles/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = roleSchema.partial().parse(req.body);
  if (d.name || d.description !== undefined || d.color) {
    const sets: string[] = []; const params: any[] = []; let i = 1;
    if (d.name) { sets.push(`name=$${i++}`); params.push(d.name); }
    if (d.description !== undefined) { sets.push(`description=$${i++}`); params.push(d.description); }
    if (d.color) { sets.push(`color=$${i++}`); params.push(d.color); }
    params.push(id);
    if (sets.length) await query(`UPDATE teaching_roles SET ${sets.join(', ')} WHERE id=$${i}`, params);
  }
  // Replace scopes if provided
  if (d.scopes !== undefined) {
    await query(`DELETE FROM teaching_role_scopes WHERE role_id=$1`, [id]);
    for (const s of d.scopes) {
      await query(
        `INSERT INTO teaching_role_scopes (role_id, grade_id, module_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
        [id, s.grade_id, s.module_id ?? null]
      );
    }
  }
  res.json({ ok: true });
}));

router.delete('/roles/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  // Remove all assignments first
  await query(`DELETE FROM teaching_role_assignments WHERE role_id=$1`, [id]);
  await query(`DELETE FROM teaching_role_scopes WHERE role_id=$1`, [id]);
  const r = await query(`DELETE FROM teaching_roles WHERE id=$1`, [id]);
  if (!r.rowCount) throw httpError(404, 'Role not found');
  res.json({ ok: true });
}));

// Assign/revoke role to a teacher
router.post('/roles/:id/assign', asyncH(async (req, res) => {
  const roleId = Number(req.params.id);
  const { teacher_id } = z.object({ teacher_id: z.string().uuid() }).parse(req.body);
  await query(
    `INSERT INTO teaching_role_assignments (teacher_id, role_id, assigned_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
    [teacher_id, roleId, req.user!.id]
  );
  // Sync teacher_assignments from role scopes
  const { rows: scopes } = await query(`SELECT grade_id, module_id FROM teaching_role_scopes WHERE role_id=$1`, [roleId]);
  for (const s of scopes) {
    await query(
      `INSERT INTO teacher_assignments (teacher_id, grade_id, module_id, assigned_by) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [teacher_id, s.grade_id, s.module_id ?? null, req.user!.id]
    );
  }
  await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'assign_role','teaching_role',$2)`, [req.user!.id, String(roleId)]);
  res.json({ ok: true });
}));

router.delete('/roles/:id/assign/:teacherId', asyncH(async (req, res) => {
  const roleId = Number(req.params.id);
  const teacherId = req.params.teacherId;
  await query(`DELETE FROM teaching_role_assignments WHERE role_id=$1 AND teacher_id=$2`, [roleId, teacherId]);
  res.json({ ok: true });
}));

// Get teachers with their assigned roles
router.get('/roles/teachers', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email,
       COALESCE(json_agg(json_build_object('role_id',tr.id,'role_name',tr.name,'color',tr.color)) FILTER (WHERE tr.id IS NOT NULL), '[]') AS roles
     FROM users u
     LEFT JOIN teaching_role_assignments tra ON tra.teacher_id=u.id
     LEFT JOIN teaching_roles tr ON tr.id=tra.role_id
     WHERE u.role='teacher' AND u.is_active
     GROUP BY u.id ORDER BY u.full_name`
  );
  res.json({ teachers: rows });
}));

// ---- curriculum library (full tree: grades → modules → chapters) ----
router.get('/curriculum', asyncH(async (_req, res) => {
  const { rows: grades } = await query(`SELECT id, number, name, level_label, is_active FROM grades ORDER BY number`);
  const { rows: modules } = await query(
    `SELECT m.id, m.grade_id, m.title, m.icon, m.color, m.order_index,
       (SELECT count(*)::int FROM chapters c WHERE c.module_id=m.id) AS chapter_count,
       (SELECT count(*)::int FROM chapters c WHERE c.module_id=m.id AND c.is_published) AS published_count,
       (SELECT count(*)::int FROM questions q JOIN chapters c ON c.id=q.chapter_id WHERE c.module_id=m.id) AS question_count
     FROM modules m ORDER BY m.grade_id, m.order_index`
  );
  const { rows: chapterRows } = await query(
    `SELECT c.id, c.module_id, c.title, c.difficulty, c.est_minutes, c.is_published, c.order_index,
       (SELECT count(*)::int FROM questions q WHERE q.chapter_id=c.id) AS questions
     FROM chapters c ORDER BY c.module_id, c.order_index`
  );
  // Build tree
  const chaptersByModule = chapterRows.reduce((acc: any, c) => {
    if (!acc[c.module_id]) acc[c.module_id] = [];
    acc[c.module_id].push(c);
    return acc;
  }, {} as Record<number, any[]>);
  const modulesByGrade = modules.reduce((acc: any, m) => {
    if (!acc[m.grade_id]) acc[m.grade_id] = [];
    acc[m.grade_id].push({ ...m, chapters: chaptersByModule[m.id] || [] });
    return acc;
  }, {} as Record<number, any[]>);
  const tree = grades.map((g) => ({ ...g, modules: modulesByGrade[g.id] || [] }));
  // Innovation tracks = distinct module titles across all grades
  const { rows: tracks } = await query(
    `SELECT m.title, m.icon, m.color,
       count(DISTINCT m.grade_id)::int AS grades_count,
       count(DISTINCT c.id)::int AS chapter_count,
       count(DISTINCT q.id)::int AS question_count
     FROM modules m
     LEFT JOIN chapters c ON c.module_id=m.id
     LEFT JOIN questions q ON q.chapter_id=c.id
     GROUP BY m.title, m.icon, m.color
     ORDER BY chapter_count DESC`
  );
  res.json({ tree, tracks });
}));

// ---- multi-class student access ----
// Validate the :id path param is a well-formed UUID *and* belongs to a student.
// Returns the student id (throws 400 on malformed UUID, 404 if not a student).
// NOTE: the whole router is already gated by authorize('admin'); this app uses a
// global-admin model, so any authenticated admin may manage student access.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function requireStudentId(rawId: string): Promise<string> {
  if (!rawId || !UUID_RE.test(rawId)) throw httpError(400, 'Invalid student id');
  const student = await one<any>(`SELECT id, role FROM users WHERE id=$1`, [rawId]);
  if (!student || student.role !== 'student') throw httpError(404, 'Student not found');
  return rawId;
}

// GET  /admin/students/:id/grade-access  — list grades student can access
router.get('/students/:id/grade-access', asyncH(async (req, res) => {
  const studentId = await requireStudentId(req.params.id);
  const { rows } = await query(
    `SELECT sga.id, sga.grade_id, g.name AS grade_name, g.number AS grade_number,
            sga.created_at, u.full_name AS granted_by_name
     FROM student_grade_access sga
     JOIN grades g ON g.id = sga.grade_id
     LEFT JOIN users u ON u.id = sga.granted_by
     WHERE sga.student_id = $1
     ORDER BY g.number`,
    [studentId]
  );
  res.json({ access: rows });
}));

// POST /admin/students/:id/grade-access  — grant access to a class
router.post('/students/:id/grade-access', asyncH(async (req, res) => {
  const studentId = await requireStudentId(req.params.id);
  const gradeId = Number(req.body.grade_id);
  if (!Number.isInteger(gradeId) || gradeId <= 0) throw httpError(400, 'grade_id required');
  // Verify the target grade exists (avoids a foreign-key 500 on bad input)
  const grade = await one<any>(`SELECT id FROM grades WHERE id=$1`, [gradeId]);
  if (!grade) throw httpError(404, 'Class not found');
  await query(
    `INSERT INTO student_grade_access (student_id, grade_id, granted_by)
     VALUES ($1,$2,$3) ON CONFLICT (student_id, grade_id) DO NOTHING`,
    [studentId, gradeId, req.user!.id]
  );
  await query(
    `INSERT INTO activity_log (actor_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, 'grant_grade_access', 'student', studentId, JSON.stringify({ grade_id: gradeId })]
  );
  res.status(201).json({ ok: true });
}));

// DELETE /admin/students/:id/grade-access/:gradeId — revoke access
router.delete('/students/:id/grade-access/:gradeId', asyncH(async (req, res) => {
  const studentId = await requireStudentId(req.params.id);
  const gradeId = Number(req.params.gradeId);
  if (!Number.isInteger(gradeId) || gradeId <= 0) throw httpError(400, 'Invalid grade id');
  await query(`DELETE FROM student_grade_access WHERE student_id=$1 AND grade_id=$2`, [studentId, gradeId]);
  res.json({ ok: true });
}));

export default router;
