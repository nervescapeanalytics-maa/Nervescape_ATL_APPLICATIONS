import { Router } from 'express';
import { z } from 'zod';
import { one, query } from '../db/pool';
import { authenticate } from '../middleware/auth';
import { asyncH, httpError } from '../middleware/error';

const router = Router();
router.use(authenticate);

// Grades list (auth users)
router.get('/grades', asyncH(async (_req, res) => {
  const { rows } = await query(`SELECT id, number, name, level_label, description FROM grades WHERE is_active ORDER BY number`);
  res.json({ grades: rows });
}));

// Modules of a grade with chapter list
router.get('/grades/:gradeId/modules', asyncH(async (req, res) => {
  const gradeId = Number(req.params.gradeId);
  const { rows: modules } = await query(
    `SELECT id, title, slug, icon, color, description, order_index FROM modules WHERE grade_id=$1 ORDER BY order_index, id`,
    [gradeId]
  );
  const { rows: chapters } = await query(
    `SELECT c.id, c.module_id, c.title, c.slug, c.summary, c.difficulty, c.est_minutes, c.order_index, c.is_published
     FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=$1 ORDER BY c.order_index, c.id`,
    [gradeId]
  );
  const byModule: Record<number, any[]> = {};
  for (const ch of chapters) (byModule[ch.module_id] ||= []).push(ch);
  res.json({ modules: modules.map((m) => ({ ...m, chapters: byModule[m.id] || [] })) });
}));

// Full chapter content (with facts + question counts by type)
router.get('/chapters/:id', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const chapter = await one<any>(
    `SELECT c.*, m.title AS module_title, m.grade_id, g.name AS grade_name
     FROM chapters c JOIN modules m ON m.id=c.module_id JOIN grades g ON g.id=m.grade_id WHERE c.id=$1`,
    [id]
  );
  if (!chapter) throw httpError(404, 'Chapter not found');
  const { rows: facts } = await query(`SELECT id, text FROM facts WHERE chapter_id=$1 ORDER BY id`, [id]);
  const { rows: qcount } = await query(
    `SELECT qtype, count(*)::int AS n FROM questions WHERE chapter_id=$1 GROUP BY qtype`, [id]
  );
  res.json({ chapter, facts, questionCounts: qcount });
}));

// Questions for a chapter, optionally filtered by type. Students get no answers unless includeAnswers (teacher/admin)
router.get('/chapters/:id/questions', asyncH(async (req, res) => {
  const id = Number(req.params.id);
  const type = req.query.type as string | undefined;
  const isStaff = req.user!.role !== 'student';
  const params: any[] = [id];
  let sql = `SELECT id, qtype, prompt, options, difficulty, points${isStaff ? ', answer, explanation, ai_generated' : ''} FROM questions WHERE chapter_id=$1`;
  if (type) { params.push(type); sql += ` AND qtype=$2`; }
  sql += ` ORDER BY id`;
  const { rows } = await query(sql, params);
  res.json({ questions: rows });
}));

export default router;
