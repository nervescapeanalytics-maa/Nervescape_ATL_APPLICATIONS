// =====================================================================
//  Seed: grades 1-12, full curriculum for classes 6/7/8, and demo users
//  wiring admin -> teachers -> students.
// =====================================================================
import bcrypt from 'bcryptjs';
import { pool } from './pool';
import { config } from '../config';
import { buildBlocks, GradeSpec } from './curriculum';
import { grade6 } from './grade6';
import { grade7 } from './grade7';
import { grade8 } from './grade8';
import { grade9, grade10, grade11, grade12 } from './grade9to12';
import { richElectronicsChapters, richRoboticsChapters, richIoTChapters } from './richChapters';
import { seedCatalogRepository } from './catalogSeed';
import { aiModuleForClass, aiGradeSpec } from './aiCourse';

// Merge rich chapters into grade9 — override stubs with full book-quality content
function mergeRichChapters(): void {
  const g9 = grade9;
  const richMap: Record<string, any[]> = {
    'adv-electronics-9': richElectronicsChapters,
    'autonomous-robotics-9': richRoboticsChapters,
    'iot-pipelines-9': richIoTChapters,
  };
  for (const mod of g9.modules) {
    const richList = richMap[mod.slug];
    if (!richList) continue;
    for (const richCh of richList) {
      const idx = mod.chapters.findIndex((c) => c.title === richCh.title);
      if (idx >= 0) mod.chapters[idx] = richCh;
      // else it's a new rich chapter not yet in the stub list — ignore for now
    }
  }
}
mergeRichChapters();

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Seed a single module (and its chapters/questions/facts) into an existing grade.
async function seedModule(gradeId: number, mod: GradeSpec['modules'][number], adminId: string, orderIndex: number) {
  const m = await pool.query(
    `INSERT INTO modules (grade_id, title, slug, icon, color, description, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (grade_id, slug) DO UPDATE SET title=EXCLUDED.title, icon=EXCLUDED.icon,
       color=EXCLUDED.color, description=EXCLUDED.description, order_index=EXCLUDED.order_index
     RETURNING id`,
    [gradeId, mod.title, mod.slug, mod.icon, mod.color, mod.description, orderIndex]
  );
  const moduleId = m.rows[0].id as number;

  let cOrder = 0;
  for (const ch of mod.chapters) {
    const chSlug = slugify(ch.title);
    const blocks = buildBlocks(ch);
    const c = await pool.query(
      `INSERT INTO chapters (module_id, title, slug, summary, difficulty, est_minutes, content, order_index, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$9)
       ON CONFLICT (module_id, slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary,
         difficulty=EXCLUDED.difficulty, est_minutes=EXCLUDED.est_minutes, content=EXCLUDED.content,
         order_index=EXCLUDED.order_index, updated_by=EXCLUDED.updated_by
       RETURNING id`,
      [moduleId, ch.title, chSlug, ch.summary, ch.difficulty, ch.est, JSON.stringify(blocks), cOrder++, adminId]
    );
    const chapterId = c.rows[0].id as number;

    // refresh facts & questions idempotently
    await pool.query('DELETE FROM facts WHERE chapter_id=$1', [chapterId]);
    for (const f of ch.facts) {
      await pool.query('INSERT INTO facts (chapter_id, text) VALUES ($1,$2)', [chapterId, f]);
    }
    await pool.query('DELETE FROM questions WHERE chapter_id=$1 AND ai_generated=FALSE', [chapterId]);
    for (const q of ch.questions) {
      await pool.query(
        `INSERT INTO questions (chapter_id, qtype, prompt, options, answer, explanation, difficulty, points, ai_generated, created_by)
         VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,FALSE,$9)`,
        [chapterId, q.qtype, q.prompt, JSON.stringify(q.options ?? []), q.answer ?? null,
         q.explanation ?? null, q.difficulty ?? 'beginner', q.points ?? 10, adminId]
      );
    }
  }
  return moduleId;
}

async function seedGrade(spec: GradeSpec, adminId: string) {
  const g = await pool.query(
    `INSERT INTO grades (number, name, level_label, description, is_active)
     VALUES ($1,$2,$3,$4,TRUE)
     ON CONFLICT (number) DO UPDATE SET name=EXCLUDED.name, level_label=EXCLUDED.level_label,
       description=EXCLUDED.description, is_active=TRUE
     RETURNING id`,
    [spec.number, spec.name, spec.level_label, spec.description]
  );
  const gradeId = g.rows[0].id as number;

  let mOrder = 0;
  for (const mod of spec.modules) {
    await seedModule(gradeId, mod, adminId, mOrder++);
  }
  return gradeId;
}

// Attach the 12-week AI course to classes 3-10. Classes 3-5 are activated
// (they had no curriculum before); classes 6-10 keep their existing
// modules and simply gain an extra "Artificial Intelligence" module.
async function seedAiCourse(adminId: string) {
  for (let n = 3; n <= 10; n++) {
    let gradeId: number;
    if (n <= 5) {
      // Activate the placeholder grade and give it the AI grade spec.
      const spec = aiGradeSpec(n);
      const g = await pool.query(
        `INSERT INTO grades (number, name, level_label, description, is_active)
         VALUES ($1,$2,$3,$4,TRUE)
         ON CONFLICT (number) DO UPDATE SET name=EXCLUDED.name, level_label=EXCLUDED.level_label,
           description=EXCLUDED.description, is_active=TRUE
         RETURNING id`,
        [spec.number, spec.name, spec.level_label, spec.description]
      );
      gradeId = g.rows[0].id as number;
    } else {
      // Existing active grade — just fetch its id, don't touch its metadata.
      const g = await pool.query('SELECT id FROM grades WHERE number=$1', [n]);
      if (!g.rows[0]) {
        throw new Error(`[seed] Grade ${n} not found — seed main curriculum before attaching AI course.`);
      }
      gradeId = g.rows[0].id as number;
    }
    // Place the AI module at the end of each grade's module list.
    const { rows } = await pool.query('SELECT COALESCE(MAX(order_index),-1)+1 AS next FROM modules WHERE grade_id=$1', [gradeId]);
    await seedModule(gradeId, aiModuleForClass(n), adminId, rows[0].next as number);
  }
  console.log('[seed] AI course attached to classes 3-10 (12-week roadmap)');
}

async function ensureUser(opts: {
  role: 'admin' | 'teacher' | 'student';
  fullName: string; email: string; username: string; password: string;
  gradeId?: number | null; createdBy?: string | null;
}) {
  const hash = await bcrypt.hash(opts.password, config.bcryptRounds);
  const r = await pool.query(
    `INSERT INTO users (role, full_name, email, username, password_hash, grade_id, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (email) DO UPDATE SET full_name=EXCLUDED.full_name, username=EXCLUDED.username,
       grade_id=EXCLUDED.grade_id, is_active=TRUE
     RETURNING id`,
    [opts.role, opts.fullName, opts.email, opts.username, hash, opts.gradeId ?? null, opts.createdBy ?? null]
  );
  return r.rows[0].id as string;
}

async function main() {
  console.log('[seed] starting...');

  // 1) grades 1-12 (6-12 active with content; 1-5 placeholder, inactive)
  for (let n = 1; n <= 12; n++) {
    if (n >= 6) continue; // 6-12 seeded explicitly below
    await pool.query(
      `INSERT INTO grades (number, name, level_label, description, is_active)
       VALUES ($1,$2,$3,$4,FALSE)
       ON CONFLICT (number) DO NOTHING`,
      [n, `Class ${n}`, null, `Curriculum for Class ${n} (coming soon).`]
    );
  }

  // 2) admin
  const adminId = await ensureUser({
    role: 'admin', fullName: 'LMS Administrator',
    email: config.seed.adminEmail, username: 'admin',
    password: config.seed.adminPassword,
  });
  console.log('[seed] admin ready:', config.seed.adminEmail);

  // 3) curriculum for 6/7/8 + 9/10/11/12
  const g6 = await seedGrade(grade6, adminId);
  const g7 = await seedGrade(grade7, adminId);
  const g8 = await seedGrade(grade8, adminId);
  const g9 = await seedGrade(grade9, adminId);
  const g10 = await seedGrade(grade10, adminId);
  const g11 = await seedGrade(grade11, adminId);
  const g12 = await seedGrade(grade12, adminId);
  console.log('[seed] curriculum loaded for classes 6,7,8,9,10,11,12');

  // 3b) 3-month AI course for classes 3-10 (activates 3,4,5)
  await seedAiCourse(adminId);

  // 3c) centralized course repository (levels + import existing modules)
  await seedCatalogRepository(adminId);

  // 4) demo teachers (one per active grade) wired by admin
  const teacherMap: Record<number, { id: string; gradeId: number }> = {
    6: { id: '', gradeId: g6 }, 7: { id: '', gradeId: g7 }, 8: { id: '', gradeId: g8 },
  };
  for (const n of [6, 7, 8]) {
    const tid = await ensureUser({
      role: 'teacher', fullName: `Teacher Class ${n}`,
      email: `teacher${n}@lms.local`, username: `teacher${n}`,
      password: config.seed.teacherPassword, gradeId: teacherMap[n].gradeId, createdBy: adminId,
    });
    teacherMap[n].id = tid;
    await pool.query(
      `INSERT INTO teacher_assignments (teacher_id, grade_id, module_id, assigned_by)
       VALUES ($1,$2,NULL,$3)
       ON CONFLICT (teacher_id, grade_id, module_id) DO NOTHING`,
      [tid, teacherMap[n].gradeId, adminId]
    );
  }
  console.log('[seed] teachers created & assigned');

  // 5) demo students (3 per active grade) created under their teacher
  for (const n of [6, 7, 8]) {
    for (let s = 1; s <= 3; s++) {
      await ensureUser({
        role: 'student', fullName: `Student ${n}-${s}`,
        email: `student${n}${s}@lms.local`, username: `student${n}${s}`,
        password: config.seed.studentPassword, gradeId: teacherMap[n].gradeId, createdBy: teacherMap[n].id,
      });
    }
  }
  console.log('[seed] demo students created');

  const counts = await pool.query(
    `SELECT
       (SELECT count(*) FROM grades WHERE is_active) AS active_grades,
       (SELECT count(*) FROM modules) AS modules,
       (SELECT count(*) FROM chapters) AS chapters,
       (SELECT count(*) FROM questions) AS questions,
       (SELECT count(*) FROM facts) AS facts,
       (SELECT count(*) FROM users) AS users`
  );
  console.log('[seed] summary:', counts.rows[0]);
  console.log('[seed] done.');
  await pool.end();
}

main().catch((e) => {
  console.error('[seed] failed', e);
  process.exit(1);
});
