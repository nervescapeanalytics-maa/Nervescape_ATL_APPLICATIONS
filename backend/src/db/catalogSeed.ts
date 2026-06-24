import { pool, one, query } from './pool';

const LEVELS = [
  { name: 'AI Sprouts', slug: 'ai-sprouts', order: 1, grade: 3 },
  { name: 'AI Explorers', slug: 'ai-explorers', order: 2, grade: 4 },
  { name: 'AI Beginners', slug: 'ai-beginners', order: 3, grade: 5 },
  { name: 'ATL Tinkering Level I', slug: 'atl-tinkering-i', order: 4, grade: 6 },
  { name: 'ATL Tinkering Level II', slug: 'atl-tinkering-ii', order: 5, grade: 7 },
  { name: 'ATL Tinkering Level III', slug: 'atl-tinkering-iii', order: 6, grade: 8 },
  { name: 'Advanced Foundations', slug: 'advanced-foundations', order: 7, grade: 9 },
  { name: 'Integrated Systems', slug: 'integrated-systems', order: 8, grade: 10 },
  { name: 'Professional Skills', slug: 'professional-skills', order: 9, grade: 11 },
  { name: 'Capstone & Innovation', slug: 'capstone-innovation', order: 10, grade: 12 },
];

/** Seed the 10 learning levels and wire grades.level_id. */
export async function seedCurriculumLevels() {
  for (const lv of LEVELS) {
    await pool.query(
      `INSERT INTO curriculum_levels (name, slug, description, order_index)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, order_index=EXCLUDED.order_index`,
      [lv.name, lv.slug, `Learning level for Class ${lv.grade} and mapped courses.`, lv.order]
    );
    const row = await one<any>(`SELECT id FROM curriculum_levels WHERE slug=$1`, [lv.slug]);
    if (row) {
      await pool.query(
        `UPDATE grades SET level_id=$1, level_label=COALESCE(level_label, $2) WHERE number=$3`,
        [row.id, lv.name, lv.grade]
      );
    }
  }
}

/** Import existing modules into the central catalog (idempotent). */
export async function importModulesToCatalog(adminId?: string | null) {
  const { rows: modules } = await query(
    `SELECT m.id, m.grade_id, m.title, m.slug, m.icon, m.color, m.description, m.order_index, m.catalog_id,
            g.number AS grade_number, g.level_id
     FROM modules m JOIN grades g ON g.id = m.grade_id
     WHERE m.catalog_id IS NULL
     ORDER BY g.number, m.order_index`
  );

  let imported = 0;
  for (const mod of modules) {
    const levelId = mod.level_id ?? (await one<any>(
      `SELECT id FROM curriculum_levels WHERE slug=$1`,
      [LEVELS.find((l) => l.grade === mod.grade_number)?.slug ?? 'atl-tinkering-i']
    ))?.id;

    const catSlug = `${mod.slug}-lv${levelId ?? mod.grade_number}`;
    let catalogId = (await one<any>(`SELECT id FROM course_catalog WHERE slug=$1`, [catSlug]))?.id as number | undefined;

    if (!catalogId) {
      const ins = await one<any>(
        `INSERT INTO course_catalog (level_id, title, slug, icon, color, description, status, order_index, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,'published',$7,$8)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title RETURNING id`,
        [levelId, mod.title, catSlug, mod.icon, mod.color, mod.description, mod.order_index, adminId]
      );
      catalogId = ins!.id;

      const { rows: chapters } = await query(
        `SELECT title, slug, summary, difficulty, est_minutes, content, order_index, is_published
         FROM chapters WHERE module_id=$1 ORDER BY order_index`,
        [mod.id]
      );
      for (const ch of chapters) {
        await pool.query(
          `INSERT INTO catalog_chapters (catalog_id, title, slug, summary, difficulty, est_minutes, content, order_index, is_published)
           VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9)
           ON CONFLICT (catalog_id, slug) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content`,
          [catalogId, ch.title, ch.slug, ch.summary, ch.difficulty, ch.est_minutes, JSON.stringify(ch.content ?? []),
           ch.order_index, ch.is_published]
        );
      }
      imported++;
    }

    await pool.query(`UPDATE modules SET catalog_id=$1 WHERE id=$2`, [catalogId, mod.id]);
    await pool.query(
      `INSERT INTO catalog_grade_map (catalog_id, grade_id, order_index, deployed_module_id)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (catalog_id, grade_id) DO UPDATE SET deployed_module_id=EXCLUDED.deployed_module_id`,
      [catalogId, mod.grade_id, mod.order_index, mod.id]
    );
  }
  return imported;
}

export async function seedCatalogRepository(adminId?: string | null) {
  await seedCurriculumLevels();
  const n = await importModulesToCatalog(adminId);
  console.log(`[seed] course repository: ${LEVELS.length} levels, ${n} courses imported to catalog`);
}
