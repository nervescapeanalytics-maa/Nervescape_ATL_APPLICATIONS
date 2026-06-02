import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { one, query } from '../db/pool';
import { signToken, authenticate, AuthUser } from '../middleware/auth';
import { asyncH, httpError } from '../middleware/error';

const router = Router();

const loginSchema = z.object({
  identifier: z.string().min(1), // email or username
  password: z.string().min(1),
  role: z.enum(['admin', 'teacher', 'student']).optional(),
});

router.post('/login', asyncH(async (req, res) => {
  const { identifier, password, role } = loginSchema.parse(req.body);
  const user = await one<any>(
    `SELECT id, role, full_name, email, grade_id, password_hash, is_active
     FROM users WHERE (lower(email) = lower($1) OR lower(username) = lower($1)) LIMIT 1`,
    [identifier]
  );
  if (!user || !user.is_active) throw httpError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw httpError(401, 'Invalid credentials');
  if (role && user.role !== role) throw httpError(403, `This account is not a ${role} account. Please use the ${user.role} login.`);

  await query(`UPDATE users SET last_login = now() WHERE id = $1`, [user.id]);
  const authUser: AuthUser = { id: user.id, role: user.role, full_name: user.full_name, email: user.email, grade_id: user.grade_id };
  const token = signToken(authUser);
  res.json({ token, user: authUser });
}));

router.get('/me', authenticate, asyncH(async (req, res) => {
  const u = await one<any>(
    `SELECT u.id, u.role, u.full_name, u.email, u.username, u.grade_id, g.name AS grade_name, u.avatar_url, u.last_login
     FROM users u LEFT JOIN grades g ON g.id = u.grade_id WHERE u.id = $1`,
    [req.user!.id]
  );
  if (!u) throw httpError(404, 'User not found');
  res.json({ user: u });
}));

const pwSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) });
router.post('/change-password', authenticate, asyncH(async (req, res) => {
  const { currentPassword, newPassword } = pwSchema.parse(req.body);
  const u = await one<any>(`SELECT password_hash FROM users WHERE id = $1`, [req.user!.id]);
  if (!u || !(await bcrypt.compare(currentPassword, u.password_hash))) throw httpError(401, 'Current password is incorrect');
  const hash = await bcrypt.hash(newPassword, 10);
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hash, req.user!.id]);
  res.json({ ok: true });
}));

export default router;
