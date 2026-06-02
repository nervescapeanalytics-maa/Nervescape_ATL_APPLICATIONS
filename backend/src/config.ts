import dotenv from 'dotenv';
import path from 'path';

// Load .env from APP_HOME root (one level above backend) or local
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to backend/.env if present

function int(v: string | undefined, def: number): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) ? n : def;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: int(process.env.DB_PORT, 5433),
    database: process.env.DB_NAME || 'lms_db',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'lms_app_pwd_2026',
  },
  api: {
    port: int(process.env.API_PORT, 4000),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },
  bcryptRounds: int(process.env.BCRYPT_ROUNDS, 10),
  ai: {
    provider: (process.env.AI_PROVIDER || 'offline').toLowerCase(),
    baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
  },
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@lms.local',
    adminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin@123',
    teacherPassword: process.env.SEED_TEACHER_PASSWORD || 'Teacher@123',
    studentPassword: process.env.SEED_STUDENT_PASSWORD || 'Student@123',
  },
};
