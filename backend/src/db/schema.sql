-- =====================================================================
--  AI LMS — PostgreSQL schema
--  Wiring: admin -> creates teachers & assigns grades/modules
--          teacher -> manages content/quizzes & students of their grade
--          student -> consumes content, quizzes, chatbot, challenges
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- enums ----------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin','teacher','student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('mcq','oneliner','brain_teaser','tinkering','computational','logical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE progress_status AS ENUM ('not_started','in_progress','completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- grades (classes 1-12) ----------
CREATE TABLE IF NOT EXISTS grades (
  id          SERIAL PRIMARY KEY,
  number      INT UNIQUE NOT NULL,          -- 1..12
  name        TEXT NOT NULL,                -- "Class 6"
  level_label TEXT,                         -- "Level I" for ATL mapping
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- users ----------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role          user_role NOT NULL,
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  grade_id      INT REFERENCES grades(id) ON DELETE SET NULL,   -- students: their class
  phone         TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,   -- admin/teacher who created
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_grade ON users(grade_id);

-- ---------- modules (curriculum modules within a grade) ----------
CREATE TABLE IF NOT EXISTS modules (
  id          SERIAL PRIMARY KEY,
  grade_id    INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  icon        TEXT,
  color       TEXT,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (grade_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_modules_grade ON modules(grade_id);

-- ---------- chapters (each curriculum topic/session = a chapter) ----------
CREATE TABLE IF NOT EXISTS chapters (
  id            SERIAL PRIMARY KEY,
  module_id     INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL,
  summary       TEXT,
  difficulty    TEXT DEFAULT 'beginner',     -- beginner|intermediate|advanced
  est_minutes   INT DEFAULT 60,
  hero_image    TEXT,
  -- rich structured content: array of typed blocks (heading/paragraph/image/diagram/code/callout/example/steps)
  content       JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index   INT NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_chapters_module ON chapters(module_id);

-- ---------- facts (Did-you-know per chapter) ----------
CREATE TABLE IF NOT EXISTS facts (
  id         SERIAL PRIMARY KEY,
  chapter_id INT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- quiz questions (MCQ / one-liner / brain teaser / tinkering / computational / logical) ----------
CREATE TABLE IF NOT EXISTS questions (
  id           SERIAL PRIMARY KEY,
  chapter_id   INT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  qtype        question_type NOT NULL DEFAULT 'mcq',
  prompt       TEXT NOT NULL,
  options      JSONB DEFAULT '[]'::jsonb,    -- for mcq
  answer       TEXT,                          -- correct option / expected answer
  explanation  TEXT,
  difficulty   TEXT DEFAULT 'beginner',
  points       INT DEFAULT 10,
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(qtype);

-- ---------- teacher assignments (admin wires teacher -> grade/module) ----------
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id          SERIAL PRIMARY KEY,
  teacher_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade_id    INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  module_id   INT REFERENCES modules(id) ON DELETE CASCADE,  -- NULL = all modules of grade
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, grade_id, module_id)
);
CREATE INDEX IF NOT EXISTS idx_ta_teacher ON teacher_assignments(teacher_id);

-- ---------- student progress ----------
CREATE TABLE IF NOT EXISTS progress (
  id           SERIAL PRIMARY KEY,
  student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id   INT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  status       progress_status NOT NULL DEFAULT 'not_started',
  best_score   INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, chapter_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress(student_id);

-- ---------- quiz attempts ----------
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          SERIAL PRIMARY KEY,
  student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id  INT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  score       INT NOT NULL DEFAULT 0,
  total       INT NOT NULL DEFAULT 0,
  details     JSONB DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON quiz_attempts(student_id);

-- ---------- chatbot messages ----------
CREATE TABLE IF NOT EXISTS chat_messages (
  id          SERIAL PRIMARY KEY,
  student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id  INT REFERENCES chapters(id) ON DELETE SET NULL,
  role        TEXT NOT NULL,    -- user | assistant
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_student ON chat_messages(student_id);

-- ---------- challenge submissions (brain teasers / tinkering challenges) ----------
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id          SERIAL PRIMARY KEY,
  student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id  INT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  qtype       question_type NOT NULL,
  prompt      TEXT NOT NULL,
  response    TEXT,
  ai_feedback TEXT,
  score       INT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- activity / audit log ----------
CREATE TABLE IF NOT EXISTS activity_log (
  id         SERIAL PRIMARY KEY,
  actor_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  entity     TEXT,
  entity_id  TEXT,
  meta       JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_chapters_updated ON chapters;
CREATE TRIGGER trg_chapters_updated BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
--  Phase 2 additions
-- =====================================================================

-- Extended user profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth     DATE,
  gender            TEXT,
  blood_group       TEXT,
  address_line1     TEXT,
  address_line2     TEXT,
  city              TEXT,
  state             TEXT,
  country           TEXT DEFAULT 'India',
  pincode           TEXT,
  parent_name       TEXT,
  parent_phone      TEXT,
  parent_email      TEXT,
  parent_relation   TEXT DEFAULT 'Parent',
  parent_occupation TEXT,
  school_name       TEXT,
  school_city       TEXT,
  roll_number       TEXT,
  admission_year    INT,
  hobbies           TEXT,
  languages         TEXT,
  bio               TEXT,
  emergency_contact TEXT,
  emergency_phone   TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI token/usage tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id                SERIAL PRIMARY KEY,
  user_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  feature           TEXT NOT NULL,
  prompt_tokens     INT NOT NULL DEFAULT 0,
  completion_tokens INT NOT NULL DEFAULT 0,
  total_tokens      INT NOT NULL DEFAULT 0,
  model             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_feature ON ai_usage(feature);

-- AI platform config key-value
CREATE TABLE IF NOT EXISTS ai_config (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO ai_config (key, value) VALUES
  ('provider','offline'),
  ('model','gpt-4o-mini'),
  ('base_url','https://api.openai.com/v1'),
  ('monthly_token_budget','1000000'),
  ('chatbot_enabled','true'),
  ('quiz_gen_enabled','true'),
  ('challenge_eval_enabled','true')
ON CONFLICT (key) DO NOTHING;

-- Schools
CREATE TABLE IF NOT EXISTS schools (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  code          TEXT UNIQUE,
  city          TEXT,
  state         TEXT,
  country       TEXT DEFAULT 'India',
  contact_email TEXT,
  contact_phone TEXT,
  principal     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teacher lesson plans
CREATE TABLE IF NOT EXISTS lesson_plans (
  id               SERIAL PRIMARY KEY,
  teacher_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade_id         INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  objectives       TEXT,
  duration_minutes INT DEFAULT 60,
  status           TEXT NOT NULL DEFAULT 'draft',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher ON lesson_plans(teacher_id);

DROP TRIGGER IF EXISTS trg_lessons_updated ON lesson_plans;
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON lesson_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
