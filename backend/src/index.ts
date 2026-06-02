import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { pool } from './db/pool';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import contentRoutes from './routes/content';
import adminRoutes from './routes/admin';
import teacherRoutes from './routes/teacher';
import studentRoutes from './routes/student';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('tiny'));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', ai: config.ai.provider, time: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: 'degraded', db: 'unavailable' });
  }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const port = config.api.port;
app.listen(port, () => {
  console.log(`[lms-api] listening on :${port} (env=${config.env}, ai=${config.ai.provider})`);
});
