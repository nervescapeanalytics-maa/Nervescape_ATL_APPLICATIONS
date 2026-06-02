import { Router } from 'express';
import { query } from '../db/pool';
import { asyncH } from '../middleware/error';

const router = Router();

// Public landing data: active classes + high-level catalog (no auth)
router.get('/grades', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT g.id, g.number, g.name, g.level_label, g.description,
            (SELECT count(*) FROM modules m WHERE m.grade_id = g.id) AS module_count,
            (SELECT count(*) FROM chapters c JOIN modules m ON m.id=c.module_id WHERE m.grade_id=g.id) AS chapter_count
     FROM grades g WHERE g.is_active = true ORDER BY g.number`
  );
  res.json({ grades: rows });
}));

router.get('/stats', asyncH(async (_req, res) => {
  const { rows } = await query(
    `SELECT
       (SELECT count(*) FROM grades WHERE is_active) AS classes,
       (SELECT count(*) FROM modules) AS modules,
       (SELECT count(*) FROM chapters) AS chapters,
       (SELECT count(*) FROM questions) AS questions,
       (SELECT count(*) FROM users WHERE role='student') AS students,
       (SELECT count(*) FROM users WHERE role='teacher') AS teachers`
  );
  res.json({ stats: rows[0] });
}));

router.get('/health', asyncH(async (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
}));

export default router;
