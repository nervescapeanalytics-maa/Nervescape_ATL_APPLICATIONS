import { pool, one, query } from '../db/pool';

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

/** Deploy (or refresh) a catalog course onto a grade — returns module id. */
export async function deployCatalogToGrade(catalogId: number, gradeId: number, adminId?: string | null): Promise<number> {
  const cat = await one<any>(
    `SELECT id, title, slug, icon, color, description, order_index FROM course_catalog WHERE id=$1`,
    [catalogId]
  );
  if (!cat) throw new Error(`Catalog course ${catalogId} not found`);

  const map = await one<any>(
    `SELECT id, deployed_module_id FROM catalog_grade_map WHERE catalog_id=$1 AND grade_id=$2`,
    [catalogId, gradeId]
  );

  let moduleId = map?.deployed_module_id as number | null;

  if (moduleId) {
    const exists = await one<any>(`SELECT id FROM modules WHERE id=$1`, [moduleId]);
    if (!exists) moduleId = null;
  }

  if (!moduleId) {
    const existing = await one<any>(
      `SELECT id FROM modules WHERE grade_id=$1 AND catalog_id=$2`,
      [gradeId, catalogId]
    );
    moduleId = existing?.id ?? null;
  }

  if (!moduleId) {
    const ord = await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM modules WHERE grade_id=$1`, [gradeId]);
    const ins = await one<any>(
      `INSERT INTO modules (grade_id, catalog_id, title, slug, icon, color, description, order_index)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (grade_id, slug) DO UPDATE SET catalog_id=EXCLUDED.catalog_id, title=EXCLUDED.title,
         icon=EXCLUDED.icon, color=EXCLUDED.color, description=EXCLUDED.description
       RETURNING id`,
      [gradeId, catalogId, cat.title, `${cat.slug}-${gradeId}`, cat.icon, cat.color, cat.description ?? '', cat.order_index ?? ord!.n]
    );
    moduleId = ins!.id as number;
  } else {
    await pool.query(
      `UPDATE modules SET catalog_id=$1, title=$2, icon=$3, color=$4, description=$5 WHERE id=$6`,
      [catalogId, cat.title, cat.icon, cat.color, cat.description ?? '', moduleId]
    );
  }

  const { rows: catalogChapters } = await query(
    `SELECT title, slug, summary, difficulty, est_minutes, content, order_index, is_published
     FROM catalog_chapters WHERE catalog_id=$1 ORDER BY order_index, id`,
    [catalogId]
  );

  for (const ch of catalogChapters) {
    const chSlug = ch.slug || slugify(ch.title);
    await pool.query(
      `INSERT INTO chapters (module_id, title, slug, summary, difficulty, est_minutes, content, order_index, is_published, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$10)
       ON CONFLICT (module_id, slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary,
         difficulty=EXCLUDED.difficulty, est_minutes=EXCLUDED.est_minutes, content=EXCLUDED.content,
         order_index=EXCLUDED.order_index, is_published=EXCLUDED.is_published, updated_by=EXCLUDED.updated_by`,
      [moduleId, ch.title, chSlug, ch.summary ?? '', ch.difficulty, ch.est_minutes, JSON.stringify(ch.content ?? []),
       ch.order_index, ch.is_published, adminId ?? null]
    );
  }

  if (map) {
    await pool.query(`UPDATE catalog_grade_map SET deployed_module_id=$1 WHERE id=$2`, [moduleId, map.id]);
  } else {
    const ord = await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM catalog_grade_map WHERE grade_id=$1`, [gradeId]);
    await pool.query(
      `INSERT INTO catalog_grade_map (catalog_id, grade_id, order_index, deployed_module_id)
       VALUES ($1,$2,$3,$4) ON CONFLICT (catalog_id, grade_id) DO UPDATE SET deployed_module_id=EXCLUDED.deployed_module_id`,
      [catalogId, gradeId, ord!.n, moduleId]
    );
  }

  return moduleId;
}

/** Push catalog metadata + chapters to every mapped class. */
export async function syncAllDeployments(catalogId: number, adminId?: string | null): Promise<number> {
  const { rows } = await query(`SELECT grade_id FROM catalog_grade_map WHERE catalog_id=$1`, [catalogId]);
  let n = 0;
  for (const r of rows) {
    await deployCatalogToGrade(catalogId, r.grade_id, adminId);
    n++;
  }
  return n;
}

/** Set which grades a catalog course is mapped to; deploys to new mappings, removes unmapped links. */
export async function setCatalogMappings(catalogId: number, gradeIds: number[], adminId?: string | null): Promise<void> {
  const unique = [...new Set(gradeIds)];
  const { rows: current } = await query(`SELECT grade_id FROM catalog_grade_map WHERE catalog_id=$1`, [catalogId]);
  const currentIds = new Set(current.map((r) => r.grade_id as number));
  const targetIds = new Set(unique);

  for (const gid of unique) {
    if (!currentIds.has(gid)) await deployCatalogToGrade(catalogId, gid, adminId);
  }

  for (const r of current) {
    if (!targetIds.has(r.grade_id)) {
      await pool.query(`DELETE FROM catalog_grade_map WHERE catalog_id=$1 AND grade_id=$2`, [catalogId, r.grade_id]);
    }
  }

  for (const gid of unique) {
    await deployCatalogToGrade(catalogId, gid, adminId);
  }
}
