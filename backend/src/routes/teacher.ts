import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { one, query } from '../db/pool';
import { authenticate, authorize } from '../middleware/auth';
import { asyncH, httpError } from '../middleware/error';
import { config } from '../config';
import { generateQuestions, logAiUsage } from '../services/ai';

const router = Router();
router.use(authenticate, authorize('teacher', 'admin'));

// grades the teacher is assigned to (admin sees all)
async function teacherGradeIds(userId: string, role: string): Promise<number[] | null> {
  if (role === 'admin') return null; // null = all
  const { rows } = await query(`SELECT DISTINCT grade_id FROM teacher_assignments WHERE teacher_id=$1`, [userId]);
  return rows.map((r) => r.grade_id);
}

router.get('/overview', asyncH(async (req, res) => {
  const gids = await teacherGradeIds(req.user!.id, req.user!.role);
  const gradeFilter = gids ? `WHERE g.id = ANY($1)` : '';
  const params = gids ? [gids] : [];
  const { rows: grades } = await query(
    `SELECT g.id, g.name,
       (SELECT count(*) FROM modules m WHERE m.grade_id=g.id) AS modules,
       (SELECT count(*) FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=g.id) AS chapters,
       (SELECT count(*) FROM users u WHERE u.grade_id=g.id AND u.role='student') AS students
     FROM grades g ${gradeFilter} ORDER BY g.number`, params
  );
  res.json({ grades, assigned: gids });
}));

// ---- chapter editing ----
const blockSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  level: z.number().optional(),
  url: z.string().optional(),
  caption: z.string().optional(),
  items: z.array(z.string()).optional(),
  variant: z.string().optional(),
  language: z.string().optional(),
  code: z.string().optional(),
}).passthrough();

const chapterUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  summary: z.string().optional(),
  difficulty: z.string().optional(),
  est_minutes: z.number().int().optional(),
  hero_image: z.string().optional().nullable(),
  is_published: z.boolean().optional(),
  content: z.array(blockSchema).optional(),
});

router.put('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const d = chapterUpdateSchema.parse(req.body);
  const sets: string[] = [];
  const params: any[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`);
    params.push(k === 'content' ? JSON.stringify(v) : v);
  }
  sets.push(`updated_by=$${i++}`); params.push(req.user!.id);
  if (!sets.length) throw httpError(400, 'No fields to update');
  params.push(id);
  const ch = await one<any>(`UPDATE chapters SET ${sets.join(', ')} WHERE id=$${i} RETURNING id, title, is_published`, params);
  if (!ch) throw httpError(404, 'Chapter not found');
  await query(`INSERT INTO activity_log (actor_id, action, entity, entity_id) VALUES ($1,'edit_chapter','chapter',$2)`, [req.user!.id, String(id)]);
  res.json({ chapter: ch });
}));

// add a new chapter to a module
const newChapterSchema = z.object({
  module_id: z.number().int(),
  title: z.string().min(2),
  summary: z.string().optional(),
  difficulty: z.string().default('beginner'),
});
router.post('/chapters', asyncH(async (req, res) => {
  const d = newChapterSchema.parse(req.body);
  const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '-' + Date.now().toString(36);
  const ord = await one<any>(`SELECT COALESCE(max(order_index),0)+1 AS n FROM chapters WHERE module_id=$1`, [d.module_id]);
  const ch = await one<any>(
    `INSERT INTO chapters (module_id, title, slug, summary, difficulty, order_index, created_by, updated_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$7) RETURNING id, title, slug`,
    [d.module_id, d.title, slug, d.summary ?? '', d.difficulty, ord!.n, req.user!.id]
  );
  res.status(201).json({ chapter: ch });
}));

// ---- questions management ----
const questionSchema = z.object({
  chapter_id: z.number().int(),
  qtype: z.enum(['mcq', 'oneliner', 'brain_teaser', 'tinkering', 'computational', 'logical']),
  prompt: z.string().min(3),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
  explanation: z.string().optional(),
  difficulty: z.string().default('beginner'),
  points: z.number().int().default(10),
});

router.post('/questions', asyncH(async (req, res) => {
  const d = questionSchema.parse(req.body);
  const q = await one<any>(
    `INSERT INTO questions (chapter_id, qtype, prompt, options, answer, explanation, difficulty, points, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [d.chapter_id, d.qtype, d.prompt, JSON.stringify(d.options ?? []), d.answer ?? '', d.explanation ?? '', d.difficulty, d.points, req.user!.id]
  );
  res.status(201).json({ id: q!.id });
}));

router.put('/questions/:id', asyncH(async (req, res) => {
  const d = questionSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`);
    params.push(k === 'options' ? JSON.stringify(v) : v);
  }
  if (!sets.length) throw httpError(400, 'No fields');
  params.push(Number(req.params.id));
  const q = await one<any>(`UPDATE questions SET ${sets.join(', ')} WHERE id=$${i} RETURNING id`, params);
  if (!q) throw httpError(404, 'Question not found');
  res.json({ id: q.id });
}));

router.delete('/questions/:id', asyncH(async (req, res) => {
  await query(`DELETE FROM questions WHERE id=$1`, [Number(req.params.id)]);
  res.json({ ok: true });
}));

// ---- AI: generate questions and (optionally) save ----
const genSchema = z.object({
  chapter_id: z.number().int(),
  count: z.number().int().min(1).max(10).default(5),
  qtype: z.enum(['mcq', 'oneliner', 'brain_teaser', 'tinkering', 'computational', 'logical']).default('mcq'),
  save: z.boolean().default(false),
});
router.post('/ai/generate-questions', asyncH(async (req, res) => {
  const d = genSchema.parse(req.body);
  const ch = await one<any>(`SELECT title, summary FROM chapters WHERE id=$1`, [d.chapter_id]);
  if (!ch) throw httpError(404, 'Chapter not found');
  const { questions: generated, usage } = await generateQuestions(ch.title, ch.summary || '', d.count, d.qtype, req.user!.id);
  await logAiUsage(req.user!.id, 'quiz_gen', usage, 'default');
  if (d.save) {
    for (const g of generated) {
      await query(
        `INSERT INTO questions (chapter_id, qtype, prompt, options, answer, explanation, difficulty, points, ai_generated, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,10,true,$8)`,
        [d.chapter_id, g.qtype, g.prompt, JSON.stringify(g.options ?? []), g.answer, g.explanation, g.difficulty, req.user!.id]
      );
    }
  }
  res.json({ generated, saved: d.save });
}));

// ---- students of teacher's grades ----
router.get('/students', asyncH(async (req, res) => {
  const gids = await teacherGradeIds(req.user!.id, req.user!.role);
  const params: any[] = [];
  let where = `u.role='student'`;
  if (gids) { params.push(gids); where += ` AND u.grade_id = ANY($1)`; }
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email, u.grade_id, g.name AS grade, u.is_active,
       (SELECT count(*) FROM progress p WHERE p.student_id=u.id AND p.status='completed') AS completed,
       (SELECT COALESCE(round(avg(score::numeric/NULLIF(total,0)*100)),0) FROM quiz_attempts qa WHERE qa.student_id=u.id) AS avg_quiz
     FROM users u LEFT JOIN grades g ON g.id=u.grade_id WHERE ${where} ORDER BY u.full_name`, params
  );
  res.json({ students: rows });
}));

const newStudentSchema = z.object({ full_name: z.string().min(2), email: z.string().email(), grade_id: z.number().int(), password: z.string().min(6).optional() });
router.post('/students', asyncH(async (req, res) => {
  const d = newStudentSchema.parse(req.body);
  const gids = await teacherGradeIds(req.user!.id, req.user!.role);
  if (gids && !gids.includes(d.grade_id)) throw httpError(403, 'You are not assigned to this class');
  if (await one(`SELECT 1 FROM users WHERE lower(email)=lower($1)`, [d.email])) throw httpError(409, 'Email already in use');
  const pwd = d.password || config.seed.studentPassword;
  const hash = await bcrypt.hash(pwd, config.bcryptRounds);
  const u = await one<any>(
    `INSERT INTO users (role, full_name, email, password_hash, grade_id, created_by)
     VALUES ('student',$1,$2,$3,$4,$5) RETURNING id, full_name, email, grade_id`,
    [d.full_name, d.email, hash, d.grade_id, req.user!.id]
  );
  res.status(201).json({ student: u, defaultPassword: d.password ? undefined : pwd });
}));

// progress of one student
router.get('/students/:id/progress', asyncH(async (req, res) => {
  const { rows } = await query(
    `SELECT c.id AS chapter_id, c.title, m.title AS module, p.status, p.best_score, p.completed_at
     FROM chapters c JOIN modules m ON m.id=c.module_id
     LEFT JOIN progress p ON p.chapter_id=c.id AND p.student_id=$1
     WHERE m.grade_id = (SELECT grade_id FROM users WHERE id=$1)
     ORDER BY m.order_index, c.order_index`, [req.params.id]
  );
  res.json({ progress: rows });
}));

// ---- lesson plans ----
const lessonSchema = z.object({
  grade_id: z.number().int(),
  title: z.string().min(2),
  description: z.string().optional(),
  objectives: z.string().optional(),
  duration_minutes: z.number().int().optional().default(60),
  status: z.enum(['draft', 'published']).default('draft'),
  notes: z.string().optional(),
});

router.get('/lessons', asyncH(async (req, res) => {
  const gids = await teacherGradeIds(req.user!.id, req.user!.role);
  const params: any[] = [req.user!.id];
  let where = req.user!.role === 'admin' ? '' : `AND lp.teacher_id=$1`;
  if (gids) { params.push(gids); where += ` AND lp.grade_id = ANY($${params.length})`; }
  const { rows } = await query(
    `SELECT lp.id, lp.title, lp.description, lp.objectives, lp.duration_minutes, lp.status, lp.notes,
            lp.created_at, lp.updated_at, g.name AS grade_name, u.full_name AS teacher_name
     FROM lesson_plans lp
     JOIN grades g ON g.id = lp.grade_id
     JOIN users u ON u.id = lp.teacher_id
     WHERE 1=1 ${where}
     ORDER BY lp.updated_at DESC`, params
  );
  res.json({ lessons: rows });
}));

router.post('/lessons', asyncH(async (req, res) => {
  const d = lessonSchema.parse(req.body);
  const gids = await teacherGradeIds(req.user!.id, req.user!.role);
  if (gids && !gids.includes(d.grade_id)) throw httpError(403, 'Grade not assigned');
  const lp = await one<any>(
    `INSERT INTO lesson_plans (teacher_id, grade_id, title, description, objectives, duration_minutes, status, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, title, status`,
    [req.user!.id, d.grade_id, d.title, d.description ?? '', d.objectives ?? '', d.duration_minutes, d.status, d.notes ?? '']
  );
  res.status(201).json({ lesson: lp });
}));

router.put('/lessons/:id', asyncH(async (req, res) => {
  const d = lessonSchema.partial().parse(req.body);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const [k, v] of Object.entries(d)) {
    if (v === undefined) continue;
    sets.push(`${k}=$${i++}`); params.push(v);
  }
  if (!sets.length) throw httpError(400, 'No fields');
  params.push(Number(req.params.id));
  const lp = await one<any>(`UPDATE lesson_plans SET ${sets.join(', ')}, updated_at=now() WHERE id=$${i} AND teacher_id=$${i+1} RETURNING id`, [...params, req.user!.id]);
  if (!lp) throw httpError(404, 'Lesson plan not found');
  res.json({ ok: true });
}));

router.delete('/lessons/:id', asyncH(async (req, res) => {
  await query(`DELETE FROM lesson_plans WHERE id=$1 AND teacher_id=$2`, [Number(req.params.id), req.user!.id]);
  res.json({ ok: true });
}));

// ---- reports ----
router.get('/reports', asyncH(async (req, res) => {
  const gids = await teacherGradeIds(req.user!.id, req.user!.role);
  const params: any[] = [];
  let gradeWhere = '';
  if (gids) { params.push(gids); gradeWhere = `AND g.id = ANY($1)`; }
  const { rows: gradeStats } = await query(
    `SELECT g.name AS grade,
            COUNT(DISTINCT u.id) AS students,
            COUNT(DISTINCT p.student_id) FILTER (WHERE p.status='completed') AS active_learners,
            COALESCE(ROUND(AVG(p.best_score) FILTER (WHERE p.best_score > 0)), 0) AS avg_score,
            COUNT(DISTINCT p.chapter_id) FILTER (WHERE p.status='completed') AS completions
     FROM grades g
     LEFT JOIN users u ON u.grade_id = g.id AND u.role = 'student'
     LEFT JOIN progress p ON p.student_id = u.id
     WHERE 1=1 ${gradeWhere}
     GROUP BY g.id, g.name, g.number
     ORDER BY g.number`, params
  );
  const { rows: topStudents } = await query(
    `SELECT u.full_name, g.name AS grade,
            COALESCE(SUM(p.best_score), 0) AS xp,
            COUNT(p.chapter_id) FILTER (WHERE p.status='completed') AS completed
     FROM users u
     LEFT JOIN grades g ON g.id = u.grade_id
     LEFT JOIN progress p ON p.student_id = u.id
     WHERE u.role='student' ${gids ? `AND u.grade_id = ANY($1)` : ''}
     GROUP BY u.id, u.full_name, g.name
     ORDER BY xp DESC LIMIT 10`, params
  );
  res.json({ gradeStats, topStudents });
}));

export default router;
