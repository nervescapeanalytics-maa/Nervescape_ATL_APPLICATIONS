# Nervescape LMS — Empowering Innovation in Education (Classes 1–12)

A production-grade, AI-powered Learning Management System with a single landing
login page and three separate portals (**Admin → Teacher → Student**), fully wired.
Live curriculum is provided for **Class 6, 7 and 8** (ATL Tinkering Levels I–III):
electronics, robotics, mechanics, 3D printing, IoT, woodworking, data visualization
and design/entrepreneurial thinking.

Every chapter is taught beginner → advanced with layman explanations, real-world
examples, inline diagrams, "Did you know?" facts, an AI quiz, AI one-liners,
**Brain Teasers**, **Tinkering Challenges**, computational/logical-thinking prompts,
and an AI doubt-solving **chatbot**.

---

## Architecture

```
                ┌──────────────────────── host (appuser) ───────────────────────┐
 Browser  ──►   │  frontend container (nginx :8080)                              │
                │     • serves React SPA                                         │
                │     • proxies /api ──► backend container                       │
                │                                                                │
                │  backend container (Node/Express :4000 → host :4001)           │
                │     • REST API, JWT auth, AI service                           │
                │            │                                                   │
                │            ▼ host.containers.internal:5433                     │
                │  PostgreSQL 18  (STANDALONE, native, NOT containerized)        │
                │     data dir: /home/appuser/DB_HOME/pgdata                     │
                └────────────────────────────────────────────────────────────────┘
```

- **Application** (dockerized): `/home/appuser/APP_HOME`
- **Database** (standalone on filesystem): `/home/appuser/DB_HOME`
- Everything runs as the **`appuser`** user (rootless podman).

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18 + TypeScript + Vite, served by nginx |
| Backend  | Node 20 + Express + TypeScript, JWT, bcrypt, zod, helmet, rate-limit |
| Database | PostgreSQL 18 (native, standalone) |
| AI       | OpenAI-compatible provider with a built-in **offline fallback** engine (quiz generation, chatbot, challenge evaluation) |
| Runtime  | Rootless **podman** / podman-compose |

---

## Quick start

### 1. Database (standalone, native — already initialized)
```bash
# as appuser
bash scripts/db-start.sh     # start PostgreSQL 18 (port 5433, data in DB_HOME)
bash scripts/db-status.sh    # check status
bash scripts/db-stop.sh      # stop
```

### 2. Apply schema + seed curriculum (first time only)
```bash
cd backend
npm install
npm run build
npm run migrate     # creates tables
npm run seed        # grades 1-12, full content for 6/7/8, demo users
```

### 3. Run the dockerized app
```bash
# uses scripts/compose.sh which sets the rootless podman environment
bash scripts/compose.sh build
bash scripts/compose.sh up -d
bash scripts/compose.sh logs -f      # tail logs
bash scripts/compose.sh down         # stop
```

Open **http://localhost:8080**

> Backend image listens on container port 4000, published to host **4001**.
> nginx (frontend) serves the UI on **8080** and proxies `/api` to the backend.

---

## Demo accounts

| Role    | Login (email or username)        | Password     |
|---------|----------------------------------|--------------|
| Admin   | `admin@lms.local` / `admin`      | `Admin@123`  |
| Teacher | `teacher6@lms.local` / `teacher6`| `Teacher@123`|
| Student | `student61@lms.local`/`student61`| `Student@123`|

Teachers exist for classes 6, 7, 8 (`teacher6/7/8`). Students `student61…student83`.
**Change all default passwords for production** (see `.env`).

---

## How Admin → Teacher → Student is wired

1. **Admin** creates teachers & students, and assigns teachers to classes
   (`teacher_assignments`). Admin sees global analytics.
2. **Teacher** sees only their assigned class(es), edits chapters, manages the
   question bank, generates AI questions, and adds/tracks their students.
3. **Student** sees only their class curriculum, learns chapters, takes AI quizzes,
   attempts brain teasers / tinkering challenges, climbs the class leaderboard,
   and asks the AI chatbot for help.

---

## AI features

- **Per-chapter AI quiz** (auto-graded MCQs with explanations).
- **AI one-liners** and computational/logical-thinking questions.
- **Brain Teasers & Tinkering Challenges** with AI feedback + scoring.
- **Doubt-solving chatbot** (chapter-aware) on the student screen.
- **Teacher AI question generator** (MCQ / one-liner / teaser / tinkering / logical / computational).

By default `AI_PROVIDER=offline` uses the built-in engine (no external calls). To
use a real LLM, set in `.env`:
```
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```
Any OpenAI-compatible endpoint works (set `AI_BASE_URL` accordingly).

---

## Configuration (`.env` at APP_HOME root)

| Var | Default | Notes |
|-----|---------|-------|
| `DB_HOST` | `127.0.0.1` | overridden to `host.containers.internal` in compose |
| `DB_PORT` | `5433` | standalone PostgreSQL |
| `API_PORT`| `4001` | host port for backend |
| `WEB_PORT`| `8080` | host port for the UI |
| `JWT_SECRET` | … | **change in production** |
| `AI_PROVIDER` | `offline` | `offline` or `openai` |

---

## Project layout

```
APP_HOME/
├─ docker-compose.yml         # app stack (backend + frontend); DB is external
├─ .env                       # configuration
├─ scripts/                   # db-start/stop/status + compose helper
├─ backend/                   # Express + TS API
│  ├─ Dockerfile
│  └─ src/
│     ├─ db/ (schema.sql, migrate, seed, curriculum builder, grade6/7/8)
│     ├─ middleware/ (auth, error)
│     ├─ routes/ (auth, public, content, admin, teacher, student)
│     └─ services/ai.ts
└─ frontend/                  # React + Vite SPA
   ├─ Dockerfile, nginx.conf
   └─ src/ (pages, components, api, auth)
```

## Content footprint (seeded)

- 3 active classes (6, 7, 8) + placeholders for the rest of 1–12
- 14 modules, 34 chapters, 100+ facts, 200+ questions across all question types

## Curriculum extensibility

Curriculum is authored as compact `ChapterSpec` objects in
`backend/src/db/grade6.ts|grade7.ts|grade8.ts` and expanded into rich content
blocks by `curriculum.ts`. Teachers can also edit chapters and add questions live
from the Teacher portal. To add Classes 1–5 or 9–12, add a new `gradeN.ts`,
include it in `seed.ts`, and re-run `npm run seed`.

---

## Security notes

- Passwords hashed with bcrypt; JWT bearer auth; role-based authorization.
- `helmet`, CORS, and rate-limiting on auth routes.
- Backend container runs as the non-root `node` user.
- Rotate `JWT_SECRET` and all seed passwords before production use.
