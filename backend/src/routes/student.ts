import { Router } from 'express';
import { z } from 'zod';
import { one, query } from '../db/pool';
import { authenticate, authorize } from '../middleware/auth';
import { asyncH, httpError } from '../middleware/error';
import { chatbotAnswer, evaluateChallenge, logAiUsage, ChatMessage } from '../services/ai';

const router = Router();
router.use(authenticate, authorize('student'));

async function myGrade(req: any): Promise<number> {
  const u = await one<any>(`SELECT grade_id FROM users WHERE id=$1`, [req.user.id]);
  if (!u?.grade_id) throw httpError(400, 'No class assigned to your account. Please contact your teacher.');
  return u.grade_id;
}

// dashboard
router.get('/dashboard', asyncH(async (req, res) => {
  const gradeId = await myGrade(req);
  const grade = await one<any>(`SELECT id, name, level_label FROM grades WHERE id=$1`, [gradeId]);
  const totals = await one<any>(
    `SELECT
       (SELECT count(*) FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=$1 AND c.is_published) AS total_chapters,
       (SELECT count(*) FROM progress p JOIN chapters c ON c.id=p.chapter_id JOIN modules m ON m.id=c.module_id
         WHERE p.student_id=$2 AND p.status='completed' AND m.grade_id=$1) AS completed,
       (SELECT count(*) FROM quiz_attempts WHERE student_id=$2) AS quizzes_taken,
       (SELECT COALESCE(sum(best_score),0) FROM progress WHERE student_id=$2) AS xp`,
    [gradeId, req.user!.id]
  );
  const { rows: recent } = await query(
    `SELECT c.id, c.title, p.status, p.best_score, p.updated_at
     FROM progress p JOIN chapters c ON c.id=p.chapter_id
     WHERE p.student_id=$1 ORDER BY p.updated_at DESC LIMIT 5`, [req.user!.id]
  );
  res.json({ grade, totals, recent });
}));

// my modules + chapters with progress
router.get('/courses', asyncH(async (req, res) => {
  const gradeId = await myGrade(req);
  const { rows: modules } = await query(
    `SELECT id, title, slug, icon, color, description, order_index FROM modules WHERE grade_id=$1 ORDER BY order_index, id`, [gradeId]
  );
  const { rows: chapters } = await query(
    `SELECT c.id, c.module_id, c.title, c.slug, c.summary, c.difficulty, c.est_minutes, c.order_index,
            COALESCE(p.status,'not_started') AS status, COALESCE(p.best_score,0) AS best_score
     FROM chapters c JOIN modules m ON m.id=c.module_id
     LEFT JOIN progress p ON p.chapter_id=c.id AND p.student_id=$2
     WHERE m.grade_id=$1 AND c.is_published ORDER BY c.order_index, c.id`, [gradeId, req.user!.id]
  );
  const byModule: Record<number, any[]> = {};
  for (const ch of chapters) (byModule[ch.module_id] ||= []).push(ch);
  res.json({ modules: modules.map((m) => ({ ...m, chapters: byModule[m.id] || [] })) });
}));

// mark chapter started/completed
const progressSchema = z.object({ chapter_id: z.number().int(), status: z.enum(['in_progress', 'completed']) });
router.post('/progress', asyncH(async (req, res) => {
  const d = progressSchema.parse(req.body);
  await query(
    `INSERT INTO progress (student_id, chapter_id, status, completed_at)
     VALUES ($1,$2,$3, CASE WHEN $3='completed' THEN now() ELSE NULL END)
     ON CONFLICT (student_id, chapter_id) DO UPDATE SET status=EXCLUDED.status,
        completed_at = CASE WHEN EXCLUDED.status='completed' THEN now() ELSE progress.completed_at END,
        updated_at=now()`,
    [req.user!.id, d.chapter_id, d.status]
  );
  res.json({ ok: true });
}));

// submit quiz (mcq/oneliner auto-graded by matching answer)
const submitSchema = z.object({
  chapter_id: z.number().int(),
  answers: z.array(z.object({ question_id: z.number().int(), response: z.string() })),
});
router.post('/quiz/submit', asyncH(async (req, res) => {
  const d = submitSchema.parse(req.body);
  const ids = d.answers.map((a) => a.question_id);
  if (!ids.length) throw httpError(400, 'No answers submitted');
  const { rows: questions } = await query(
    `SELECT id, qtype, answer, explanation, points FROM questions WHERE id = ANY($1) AND chapter_id=$2`, [ids, d.chapter_id]
  );
  const qmap = new Map(questions.map((q) => [q.id, q]));
  let score = 0; let total = 0; const details: any[] = [];
  for (const a of d.answers) {
    const q = qmap.get(a.question_id);
    if (!q) continue;
    total += q.points;
    const norm = (s: string) => s.trim().toLowerCase();
    const correct = ['mcq', 'oneliner', 'computational', 'logical'].includes(q.qtype) && q.answer && norm(a.response) === norm(q.answer);
    if (correct) score += q.points;
    details.push({ question_id: q.id, correct: !!correct, correctAnswer: q.answer, explanation: q.explanation });
  }
  const pct = total ? Math.round((score / total) * 100) : 0;
  await query(`INSERT INTO quiz_attempts (student_id, chapter_id, score, total, details) VALUES ($1,$2,$3,$4,$5)`,
    [req.user!.id, d.chapter_id, score, total, JSON.stringify(details)]);
  await query(
    `INSERT INTO progress (student_id, chapter_id, status, best_score, completed_at)
     VALUES ($1,$2,'completed',$3, now())
     ON CONFLICT (student_id, chapter_id) DO UPDATE SET best_score=GREATEST(progress.best_score,$3),
       status='completed', completed_at=COALESCE(progress.completed_at, now()), updated_at=now()`,
    [req.user!.id, d.chapter_id, pct]
  );
  res.json({ score, total, percent: pct, details });
}));

// leaderboard within my class
router.get('/leaderboard', asyncH(async (req, res) => {
  const gradeId = await myGrade(req);
  const { rows } = await query(
    `SELECT u.id, u.full_name, COALESCE(sum(p.best_score),0) AS xp,
            count(*) FILTER (WHERE p.status='completed') AS completed
     FROM users u LEFT JOIN progress p ON p.student_id=u.id
     WHERE u.role='student' AND u.grade_id=$1
     GROUP BY u.id, u.full_name ORDER BY xp DESC, completed DESC LIMIT 20`, [gradeId]
  );
  res.json({ leaderboard: rows, me: req.user!.id });
}));

// ---- chatbot ----
router.get('/chat/:chapterId?', asyncH(async (req, res) => {
  const chapterId = req.params.chapterId ? Number(req.params.chapterId) : null;
  const { rows } = await query(
    `SELECT role, content, created_at FROM chat_messages WHERE student_id=$1 AND ($2::int IS NULL OR chapter_id=$2)
     ORDER BY created_at ASC LIMIT 50`, [req.user!.id, chapterId]
  );
  res.json({ messages: rows });
}));

const chatSchema = z.object({ chapter_id: z.number().int().nullable().optional(), message: z.string().min(1).max(1000) });
router.post('/chat', asyncH(async (req, res) => {
  const d = chatSchema.parse(req.body);
  const chapterId = d.chapter_id ?? null;
  let chapterTitle: string | null = null;
  if (chapterId) chapterTitle = (await one<any>(`SELECT title FROM chapters WHERE id=$1`, [chapterId]))?.title ?? null;
  const { rows: hist } = await query(
    `SELECT role, content FROM chat_messages WHERE student_id=$1 AND ($2::int IS NULL OR chapter_id=$2) ORDER BY created_at DESC LIMIT 6`,
    [req.user!.id, chapterId]
  );
  const history: ChatMessage[] = hist.reverse().map((h) => ({ role: h.role, content: h.content }));
  const { answer, usage } = await chatbotAnswer(req.user!.full_name, chapterTitle, history, d.message);
  await logAiUsage(req.user!.id, 'chatbot', usage, 'default');
  await query(`INSERT INTO chat_messages (student_id, chapter_id, role, content) VALUES ($1,$2,'user',$3)`, [req.user!.id, chapterId, d.message]);
  await query(`INSERT INTO chat_messages (student_id, chapter_id, role, content) VALUES ($1,$2,'assistant',$3)`, [req.user!.id, chapterId, answer]);
  res.json({ answer });
}));

// ---- challenges (brain teaser / tinkering) ----
const challengeSchema = z.object({ chapter_id: z.number().int(), qtype: z.enum(['brain_teaser', 'tinkering', 'computational', 'logical']), prompt: z.string(), response: z.string().min(1) });
router.post('/challenge/submit', asyncH(async (req, res) => {
  const d = challengeSchema.parse(req.body);
  const { feedback, score, usage } = await evaluateChallenge(d.prompt, d.response, req.user!.id);
  await logAiUsage(req.user!.id, 'challenge_eval', usage, 'default');
  await query(
    `INSERT INTO challenge_submissions (student_id, chapter_id, qtype, prompt, response, ai_feedback, score)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [req.user!.id, d.chapter_id, d.qtype, d.prompt, d.response, feedback, score]
  );
  res.json({ feedback, score });
}));

// ---- profile ----
router.get('/profile', asyncH(async (req, res) => {
  const u = await one<any>(
    `SELECT u.id, u.full_name, u.email, u.username, u.grade_id, g.name AS grade_name,
            u.phone, u.avatar_url, u.created_at,
            p.date_of_birth, p.gender, p.blood_group, p.address_line1, p.address_line2,
            p.city, p.state, p.country, p.pincode,
            p.parent_name, p.parent_phone, p.parent_email, p.parent_relation, p.parent_occupation,
            p.school_name, p.school_city, p.roll_number, p.admission_year,
            p.hobbies, p.languages, p.bio, p.emergency_contact, p.emergency_phone
     FROM users u
     LEFT JOIN grades g ON g.id = u.grade_id
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id=$1`, [req.user!.id]
  );
  res.json({ profile: u });
}));

const profileUpdateSchema = z.object({
  full_name: z.string().min(2).optional(),
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

router.put('/profile', asyncH(async (req, res) => {
  const data = profileUpdateSchema.parse(req.body);
  const { full_name, phone, ...ext } = data;
  if (full_name !== undefined || phone !== undefined) {
    const sets: string[] = []; const vals: any[] = [];
    let i = 1;
    if (full_name !== undefined) { sets.push(`full_name=$${i++}`); vals.push(full_name); }
    if (phone !== undefined) { sets.push(`phone=$${i++}`); vals.push(phone); }
    vals.push(req.user!.id);
    if (sets.length) await query(`UPDATE users SET ${sets.join(', ')}, updated_at=now() WHERE id=$${i}`, vals);
  }
  const extKeys = Object.keys(ext).filter(k => (ext as any)[k] !== undefined) as (keyof typeof ext)[];
  if (extKeys.length) {
    const cols = extKeys.join(', ');
    const vals = [req.user!.id, ...extKeys.map(k => (ext as any)[k])];
    const placeholders = extKeys.map((_, i) => `$${i + 2}`).join(', ');
    const updates = extKeys.map((k, i) => `${k}=$${i + 2}`).join(', ');
    await query(
      `INSERT INTO user_profiles (user_id, ${cols}) VALUES ($1, ${placeholders})
       ON CONFLICT (user_id) DO UPDATE SET ${updates}, updated_at=now()`, vals
    );
  }
  res.json({ ok: true });
}));

// ---- progress report ----
router.get('/report', asyncH(async (req, res) => {
  const gradeId = await myGrade(req);
  const { rows: byModule } = await query(
    `SELECT m.title AS module_title, m.icon,
            COUNT(c.id) AS total_chapters,
            COUNT(p.chapter_id) FILTER (WHERE p.status='completed') AS completed,
            COALESCE(AVG(p.best_score) FILTER (WHERE p.best_score > 0), 0)::int AS avg_score
     FROM modules m
     LEFT JOIN chapters c ON c.module_id = m.id AND c.is_published
     LEFT JOIN progress p ON p.chapter_id = c.id AND p.student_id = $2
     WHERE m.grade_id = $1
     GROUP BY m.id, m.title, m.icon, m.order_index
     ORDER BY m.order_index`, [gradeId, req.user!.id]
  );
  const summary = await one<any>(
    `SELECT
       COUNT(p.chapter_id) FILTER (WHERE p.status='completed') AS completed,
       COUNT(DISTINCT qa.id) AS quizzes,
       COALESCE(SUM(p.best_score), 0) AS xp,
       COALESCE(AVG(p.best_score) FILTER (WHERE p.best_score > 0), 0)::int AS avg_score
     FROM users u
     LEFT JOIN progress p ON p.student_id = u.id
     LEFT JOIN quiz_attempts qa ON qa.student_id = u.id
     WHERE u.id = $1`, [req.user!.id]
  );
  res.json({ byModule, summary });
}));

export default router;
