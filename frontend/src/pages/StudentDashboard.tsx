import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '../api';
import { useAuth } from '../auth';
import Layout from '../components/Layout';
import Chatbot from '../components/Chatbot';

interface Chapter { id: number; title: string; summary: string; difficulty: string; est_minutes: number; status?: string; best_score?: number; }
interface Module { id: number; title: string; icon: string; color: string; description: string; chapters: Chapter[]; }

export default function StudentDashboard() {
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    apiGet('/student/dashboard').then(setDash).catch(() => {});
    apiGet<{ modules: Module[] }>('/student/courses').then((r) => setModules(r.modules)).catch(() => {});
  }, []);

  return (
    <>
      <Layout
        title="Student Dashboard"
        subtitle="Learn, build and innovate — your maker journey starts here"
        active={tab}
        onTab={setTab}
        tabs={[
          { key: 'overview', label: 'Dashboard', icon: '🏠', group: 'Overview' },
          { key: 'learn', label: 'My Courses', icon: '📚', group: 'My Learning' },
          { key: 'projects', label: 'Projects', icon: '🛠', group: 'My Learning' },
          { key: 'challenges', label: 'Challenges', icon: '⚡', group: 'Challenges & Innovation' },
          { key: 'leaderboard', label: 'Leaderboard', icon: '🏆', group: 'Community' },
          { key: 'mentor', label: 'AI Mentor', icon: '🤖', group: 'AI & Mentors' },
          { key: 'report', label: 'Progress Report', icon: '📊', group: 'My Progress' },
          { key: 'profile', label: 'My Profile', icon: '👤', group: 'Settings' },
        ]}
      >
        {tab === 'overview' && <Overview dash={dash} modules={modules} setTab={setTab} />}
        {tab === 'learn' && <Learn modules={modules} />}
        {tab === 'projects' && <Projects modules={modules} />}
        {tab === 'challenges' && <Challenges modules={modules} />}
        {tab === 'leaderboard' && <Leaderboard />}
        {tab === 'mentor' && <AIMentor />}
        {tab === 'report' && <ProgressReport />}
        {tab === 'profile' && <MyProfile />}
      </Layout>
      <Chatbot />
    </>
  );
}

/* ---------------- helpers ---------------- */
function pct(m: Module) {
  if (!m.chapters.length) return 0;
  const done = m.chapters.filter((c) => c.status === 'completed').length;
  return Math.round((done / m.chapters.length) * 100);
}
function Bar({ value, color }: { value: number; color?: string }) {
  return <div className="pbar"><span style={{ width: `${value}%`, background: color || 'linear-gradient(90deg,var(--primary),var(--primary-2))' }} /></div>;
}
function Panel({ title, icon, sub, action, children }: any) {
  return (
    <div className="card pad panel">
      <div className="panel-head">
        <div><h3>{icon} {title}</h3>{sub && <div className="muted" style={{ fontSize: 13 }}>{sub}</div>}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ---------------- OVERVIEW (main dashboard) ---------------- */
function Overview({ dash, modules, setTab }: { dash: any; modules: Module[]; setTab: (t: string) => void }) {
  const nav = useNavigate();
  const { user } = useAuth();
  if (!dash) return <div className="spinner" />;

  const allCh = modules.flatMap((m) => m.chapters);
  const nextUp = allCh.filter((c) => c.status !== 'completed').slice(0, 4);
  const t = dash.totals;
  const overall = t.total_chapters ? Math.round((t.completed / t.total_chapters) * 100) : 0;

  return (
    <div className="grid dash">
      {/* hero / welcome */}
      <div className="card pad dash-hero">
        <div>
          <span className="kicker">{dash.grade?.name} · {dash.grade?.level_label}</span>
          <h2 style={{ margin: '10px 0 6px' }}>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 520 }}>
            Keep building your maker journey. You've completed <b>{t.completed}</b> of <b>{t.total_chapters}</b> chapters.
            Tinker, code and innovate your way to the top of the leaderboard!
          </p>
          <div className="hero-cta" style={{ marginTop: 18 }}>
            {nextUp[0] && <button className="btn glow" onClick={() => nav(`/student/chapter/${nextUp[0].id}`)}>▶ Continue: {nextUp[0].title}</button>}
            <button className="btn ghost" onClick={() => setTab('challenges')}>⚡ Innovation Challenges</button>
          </div>
        </div>
        <div className="ring-wrap">
          <Ring value={overall} label="Course Progress" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-row">
        <Kpi icon="📘" n={t.total_chapters} l="Total Chapters" c="var(--primary-2)" />
        <Kpi icon="✅" n={t.completed} l="Completed" c="var(--green)" />
        <Kpi icon="🧠" n={t.quizzes_taken} l="Quizzes Taken" c="var(--purple)" />
        <Kpi icon="⭐" n={t.xp} l="XP Earned" c="var(--yellow)" />
      </div>

      <div className="dash-cols">
        <div className="grid" style={{ gap: 16 }}>
          {/* Robotics Foundation */}
          <Panel title="Robotics Foundation" icon="🤖" sub="Core tracks aligned to ATL Tinkering" action={<button className="btn ghost sm" onClick={() => setTab('learn')}>View all →</button>}>
            <div className="grid" style={{ gap: 10 }}>
              {modules.slice(0, 5).map((m) => (
                <div key={m.id} className="track-row" onClick={() => setTab('learn')}>
                  <span className="track-ico" style={{ background: m.color || '#1f2a49' }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="row between"><b>{m.title}</b><span className="muted" style={{ fontSize: 12 }}>{pct(m)}%</span></div>
                    <Bar value={pct(m)} />
                  </div>
                </div>
              ))}
              {!modules.length && <div className="muted">Your class curriculum will appear here.</div>}
            </div>
          </Panel>

          {/* Project-Based Learning */}
          <Panel title="Project-Based Learning" icon="🛠" sub="Hands-on builds that turn theory into machines" action={<button className="btn ghost sm" onClick={() => setTab('projects')}>Open →</button>}>
            <div className="proj-grid">
              {PROJECTS.slice(0, 4).map((p) => (
                <div key={p.t} className="proj-mini">
                  <span style={{ fontSize: 22 }}>{p.i}</span>
                  <div><b>{p.t}</b><div className="muted" style={{ fontSize: 12 }}>{p.level}</div></div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Assessment with AI/LLM */}
          <Panel title="AI Assessment Center" icon="🧪" sub="LLM-evaluated quizzes, brain teasers & tinkering tasks">
            <div className="grid" style={{ gap: 10 }}>
              {ASSESS.map((a) => (
                <div key={a.t} className="assess-row">
                  <span className="assess-ico" style={{ color: a.c }}>{a.i}</span>
                  <div style={{ flex: 1 }}><b>{a.t}</b><div className="muted" style={{ fontSize: 12 }}>{a.d}</div></div>
                  <button className="btn ghost sm" onClick={() => setTab(a.tab)}>Start</button>
                </div>
              ))}
            </div>
          </Panel>

          {/* Computational + Logical thinking */}
          <Panel title="Think Like an Engineer" icon="🧩" sub="Computational + logical thinking woven into every topic">
            <div className="think-grid">
              <div className="think-card comp">
                <h4>🧠 Computational Thinking</h4>
                <ul>{COMP.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="think-card logic">
                <h4>🔎 Logical Thinking</h4>
                <ul>{LOGIC.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          {/* Continue learning */}
          <Panel title="Continue Learning" icon="▶">
            <div className="grid" style={{ gap: 8 }}>
              {nextUp.map((c) => (
                <div key={c.id} className="chapter-row" onClick={() => nav(`/student/chapter/${c.id}`)}>
                  <div><b>{c.title}</b><div className="muted" style={{ fontSize: 12 }}>{c.summary?.slice(0, 60)}…</div></div>
                  <span className={`tag ${c.difficulty}`}>{c.difficulty}</span>
                </div>
              ))}
              {!nextUp.length && <div className="muted">🎉 All chapters completed — amazing!</div>}
            </div>
          </Panel>

          {/* Innovation Challenges */}
          <Panel title="Innovation Challenges" icon="⚡" action={<button className="btn ghost sm" onClick={() => setTab('challenges')}>All →</button>}>
            <div className="grid" style={{ gap: 8 }}>
              {CHALLENGES.slice(0, 3).map((c) => (
                <div key={c.t} className="chal-row">
                  <span style={{ fontSize: 20 }}>{c.i}</span>
                  <div style={{ flex: 1 }}><b>{c.t}</b><div className="muted" style={{ fontSize: 12 }}>{c.d}</div></div>
                  <span className="tag advanced">{c.xp} XP</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Mentor Interaction */}
          <Panel title="Mentor Interaction" icon="🧑‍🏫" sub="Your AI mentor + ATL coaches">
            <div className="mentor-box">
              <div className="row" style={{ gap: 10 }}>
                <div className="avatar" style={{ background: 'linear-gradient(135deg,var(--purple),var(--pink))' }}>AI</div>
                <div><b>Nerve AI Mentor</b><div className="muted" style={{ fontSize: 12 }}>Online · ask anything, anytime</div></div>
              </div>
              <p className="muted" style={{ fontSize: 13, margin: '12px 0' }}>Stuck on a circuit or an algorithm? Open the chat to get hints, explanations and step-by-step guidance.</p>
              <div className="row wrap" style={{ gap: 8 }}>
                {MENTORS.map((m) => (
                  <div key={m.n} className="mentor-chip"><span className="dot" style={{ background: m.s ? 'var(--green)' : 'var(--muted)' }} />{m.n} · <span className="muted">{m.r}</span></div>
                ))}
              </div>
            </div>
          </Panel>

          {/* ATL Activities */}
          <Panel title="ATL Lab Activities" icon="🔬" sub="This term's tinkering lab schedule">
            <div className="grid" style={{ gap: 8 }}>
              {ATL.map((a) => (
                <div key={a.t} className="atl-row">
                  <span className="atl-date">{a.d}</span>
                  <div style={{ flex: 1 }}><b>{a.t}</b><div className="muted" style={{ fontSize: 12 }}>{a.lab}</div></div>
                  <span className={`tag ${a.st === 'Open' ? 'beginner' : 'intermediate'}`}>{a.st}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* AI Features */}
          <Panel title="AI Superpowers" icon="✨" sub="Smart features powering your learning">
            <div className="grid" style={{ gap: 8 }}>
              {AIFEATURES.map((f) => (
                <div key={f.t} className="ai-feat"><span style={{ fontSize: 18 }}>{f.i}</span> <div><b>{f.t}</b><div className="muted" style={{ fontSize: 12 }}>{f.d}</div></div></div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const r = 52, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <div className="ring">
      <svg viewBox="0 0 130 130" width="130" height="130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="12" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#rg)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 65 65)" />
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4cc9f0" /><stop offset="1" stopColor="#f72585" /></linearGradient></defs>
        <text x="65" y="62" textAnchor="middle" fontSize="26" fontWeight="800" fill="#e8edf7">{value}%</text>
        <text x="65" y="82" textAnchor="middle" fontSize="10" fill="#93a0c0">complete</text>
      </svg>
      <div className="muted" style={{ fontSize: 12, textAlign: 'center' }}>{label}</div>
    </div>
  );
}
function Kpi({ icon, n, l, c }: any) {
  return <div className="card kpi"><span className="kpi-ico" style={{ color: c }}>{icon}</span><div><div className="kpi-n">{n}</div><div className="muted" style={{ fontSize: 13 }}>{l}</div></div></div>;
}

/* ---------------- curated content ---------------- */
const PROJECTS = [
  { i: '🚗', t: 'Line-Follower Robot', level: 'Robotics · Intermediate', d: 'Build a robot that tracks a path using IR sensors and a microcontroller.' },
  { i: '🛑', t: 'Obstacle-Avoider Bot', level: 'Robotics · Intermediate', d: 'Use ultrasonic sensors to dodge obstacles autonomously.' },
  { i: '🌱', t: 'Smart Plant Monitor', level: 'IoT · Beginner', d: 'Sense soil moisture and alert when your plant needs water.' },
  { i: '🏠', t: 'Home Automation Node', level: 'AIoT · Advanced', d: 'Control lights and fans over Wi-Fi with an ESP board.' },
  { i: '🖐', t: 'Gesture-Controlled Car', level: 'Robotics · Advanced', d: 'Drive a car with hand gestures using an accelerometer.' },
  { i: '👁', t: 'Object Detector (CV)', level: 'AI/ML · Advanced', d: 'Train a starter computer-vision model to recognize objects.' },
];
const ASSESS = [
  { i: '📝', t: 'Chapter Quiz', d: 'MCQs auto-graded instantly', c: 'var(--primary-2)', tab: 'learn' },
  { i: '🧠', t: 'Brain Teasers', d: 'AI-evaluated reasoning puzzles', c: 'var(--purple)', tab: 'challenges' },
  { i: '🛠', t: 'Tinkering Tasks', d: 'Open-ended builds reviewed by AI', c: 'var(--green)', tab: 'challenges' },
];
const COMP = ['Decomposition — break big problems into parts', 'Pattern recognition — spot what repeats', 'Abstraction — focus on what matters', 'Algorithms — write step-by-step logic'];
const LOGIC = ['Sequencing & conditionals', 'Cause-and-effect reasoning', 'Debugging by elimination', 'If-this-then-that thinking'];
const CHALLENGES = [
  { i: '🏁', t: 'Speed Bot Sprint', d: 'Fastest line-follower wins', xp: 150 },
  { i: '♻️', t: 'Eco-Innovation', d: 'Build a sustainability gadget', xp: 200 },
  { i: '🤖', t: 'AI for Good', d: 'Solve a community problem with AI', xp: 250 },
  { i: '🧱', t: '3D Design Jam', d: 'Model & print a useful tool', xp: 120 },
];
const MENTORS = [
  { n: 'Ms. Rao', r: 'Robotics Coach', s: true },
  { n: 'Mr. Khan', r: 'Electronics', s: true },
  { n: 'Ms. Iyer', r: 'AI/ML Mentor', s: false },
];
const ATL = [
  { d: 'Mon', t: 'Breadboarding Basics', lab: 'Electronics Bench', st: 'Open' },
  { d: 'Wed', t: 'Arduino Blink & Sense', lab: 'Robotics Lab', st: 'Open' },
  { d: 'Fri', t: '3D Print Your Keychain', lab: 'Fabrication Lab', st: 'Booked' },
];
const AIFEATURES = [
  { i: '💬', t: '24×7 AI Doubt Solver', d: 'Context-aware answers on any chapter' },
  { i: '🎯', t: 'Adaptive Hints', d: 'Difficulty adjusts to your progress' },
  { i: '📊', t: 'Smart Progress Insights', d: 'Know exactly what to revise next' },
];

/* ---------------- LEARN ---------------- */
function Learn({ modules }: { modules: Module[] }) {
  const nav = useNavigate();
  const [open, setOpen] = useState<number | null>(modules[0]?.id ?? null);
  useEffect(() => { if (open == null && modules[0]) setOpen(modules[0].id); }, [modules]);
  if (!modules.length) return <div className="spinner" />;
  return (
    <div className="grid">
      {modules.map((m) => {
        const done = m.chapters.filter((c) => c.status === 'completed').length;
        const isOpen = open === m.id;
        return (
          <div key={m.id} className={`card course-card ${isOpen ? 'open' : ''}`}>
            <div className="course-head" onClick={() => setOpen(isOpen ? null : m.id)}>
              <span className="course-ico" style={{ background: m.color || 'var(--primary-soft)' }}>{m.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: 17 }}>{m.title}</h3>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{m.description}</div>
              </div>
              <span className="tag">{done}/{m.chapters.length} done</span>
              <span className="course-chev">{isOpen ? '▾' : '▸'}</span>
            </div>
            {isOpen && (
              <div className="course-body">
                {m.chapters.map((c, i) => (
                  <div key={c.id} className="chapter-row pro" onClick={() => nav(`/student/chapter/${c.id}`)}>
                    <span className="chapter-num">{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>{c.status === 'completed' && <span className="check">✔ </span>}{c.title}</b>
                      <div className="muted" style={{ fontSize: 13 }}>{c.summary}</div>
                    </div>
                    <div className="row" style={{ gap: 10 }}>
                      <span className={`tag ${c.difficulty}`}>{c.difficulty}</span>
                      <span className="muted" style={{ fontSize: 12, minWidth: 36, textAlign: 'right' }}>{c.est_minutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- PROJECTS ---------------- */
function Projects({ modules }: { modules: Module[] }) {
  const nav = useNavigate();
  const firstChapter = modules.flatMap((m) => m.chapters)[0];
  return (
    <div className="grid">
      <Panel title="Project-Based Learning" icon="🛠" sub="Pick a build, follow the chapters, and ship your project">
        <div className="proj-grid lg">
          {PROJECTS.map((p) => (
            <div key={p.t} className="card pad proj-card">
              <span style={{ fontSize: 32 }}>{p.i}</span>
              <h3 style={{ margin: '10px 0 4px' }}>{p.t}</h3>
              <span className="tag">{p.level}</span>
              <p className="muted" style={{ fontSize: 13 }}>{p.d}</p>
              <button className="btn ghost sm" onClick={() => firstChapter && nav(`/student/chapter/${firstChapter.id}`)}>Start project →</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- CHALLENGES ---------------- */
function Challenges({ modules }: { modules: Module[] }) {
  const nav = useNavigate();
  const chapters = modules.flatMap((m) => m.chapters);
  return (
    <div className="grid">
      <Panel title="Innovation Challenges" icon="⚡" sub="Compete, create and earn XP. Submit through any chapter's Challenges tab for AI feedback.">
        <div className="proj-grid lg">
          {CHALLENGES.map((c) => (
            <div key={c.t} className="card pad proj-card">
              <span style={{ fontSize: 32 }}>{c.i}</span>
              <h3 style={{ margin: '10px 0 4px' }}>{c.t}</h3>
              <span className="tag advanced">{c.xp} XP</span>
              <p className="muted" style={{ fontSize: 13 }}>{c.d}</p>
              <button className="btn ghost sm" onClick={() => chapters[0] && nav(`/student/chapter/${chapters[0].id}`)}>Take challenge →</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- LEADERBOARD ---------------- */
function Leaderboard() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { apiGet('/student/leaderboard').then(setData).catch(() => {}); }, []);
  if (!data) return <div className="spinner" />;
  return (
    <div className="card pad">
      <h2 style={{ marginTop: 0 }}>🏆 Class Leaderboard</h2>
      <div className="grid" style={{ gap: 8 }}>
        {data.leaderboard.map((r: any, i: number) => (
          <div key={r.id} className={`leader-row ${r.id === data.me ? 'me' : ''}`}>
            <div className="row"><span className="rank">#{i + 1}</span> {r.full_name}{r.id === data.me && ' (you)'}</div>
            <div className="row"><span className="tag">{r.completed} done</span> <b>{r.xp} XP</b></div>
          </div>
        ))}
        {data.leaderboard.length === 0 && <div className="muted">No scores yet — be the first to top the board!</div>}
      </div>
    </div>
  );
}

// ============================================================
// NEW STUDENT TABS
// ============================================================

function AIMentor() {
  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#0d1b3e,#1e3a6e)' }}>
        <div>
          <span className="kicker">AI MENTOR</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>TinkerBot — Your 24×7 AI Mentor 🤖</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>Ask any question about your chapters, get hints for challenges, and get personalised learning guidance.</p>
        </div>
      </div>
      <div className="card pad">
        <p style={{ fontSize: 14 }}>The AI Mentor chatbot is available on every chapter page. Click <b>🤖 TinkerBot</b> in the bottom-right corner to start chatting.</p>
        <div className="proj-grid lg">
          {[
            { i: '💡', t: 'Ask Concept Questions', d: 'Get clear explanations of any topic in your chapter' },
            { i: '🛠', t: 'Get Tinkering Hints', d: 'Stuck on a build? TinkerBot gives step-by-step guidance' },
            { i: '🧠', t: 'Logic & Brain Teaser Help', d: 'Break down complex problems with AI-guided reasoning' },
            { i: '📖', t: 'Chapter Summaries', d: 'Quick revision summaries for last-minute prep' },
          ].map(f => (
            <div key={f.t} className="card pad proj-card">
              <span style={{ fontSize: 28 }}>{f.i}</span>
              <h3 style={{ margin: '8px 0 4px', fontSize: 14 }}>{f.t}</h3>
              <p className="muted" style={{ fontSize: 13 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressReport() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { apiGet<any>('/student/report').then(setData).catch(() => {}); }, []);
  if (!data) return <div className="spinner" />;
  const s = data.summary;
  return (
    <div className="grid">
      <div className="kpi-row">
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--green)' }}>✅</span><div><div className="kpi-n">{s?.completed || 0}</div><div className="muted" style={{ fontSize: 13 }}>Chapters Done</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--yellow)' }}>⭐</span><div><div className="kpi-n">{s?.xp || 0}</div><div className="muted" style={{ fontSize: 13 }}>Total XP</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--purple)' }}>🧠</span><div><div className="kpi-n">{s?.quizzes || 0}</div><div className="muted" style={{ fontSize: 13 }}>Quizzes Taken</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--primary)' }}>📈</span><div><div className="kpi-n">{s?.avg_score || 0}%</div><div className="muted" style={{ fontSize: 13 }}>Avg Score</div></div></div>
      </div>
      <div className="card pad">
        <h3 style={{ margin: '0 0 14px' }}>Module-wise Progress</h3>
        <table>
          <thead><tr><th>Module</th><th>Completed</th><th>Total</th><th>Avg Score</th><th>Progress</th></tr></thead>
          <tbody>
            {data.byModule.map((m: any) => {
              const pct = Number(m.total_chapters) ? Math.round(Number(m.completed) / Number(m.total_chapters) * 100) : 0;
              return (
                <tr key={m.module_title}>
                  <td><span style={{ marginRight: 6 }}>{m.icon}</span><b>{m.module_title}</b></td>
                  <td>{m.completed}</td>
                  <td>{m.total_chapters}</td>
                  <td><span style={{ color: Number(m.avg_score) >= 70 ? 'var(--green)' : Number(m.avg_score) >= 40 ? 'var(--yellow)' : 'var(--muted)' }}>{m.avg_score}%</span></td>
                  <td style={{ width: 120 }}>
                    <div style={{ background: 'var(--border)', borderRadius: 6, height: 8 }}>
                      <div style={{ width: `${pct}%`, background: 'linear-gradient(90deg,var(--primary),var(--primary-2))', height: '100%', borderRadius: 6 }} />
                    </div>
                    <span className="muted" style={{ fontSize: 11 }}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
            {data.byModule.length === 0 && <tr><td colSpan={5} className="muted">No progress yet. Start your first chapter!</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    apiGet<any>('/student/profile').then(r => { setProfile(r.profile); setForm(r.profile || {}); }).catch(() => {});
  }, []);

  function f(k: string) { return form[k] ?? ''; }
  function set(k: string, v: any) { setForm((p: any) => ({ ...p, [k]: v })); }

  async function save() {
    setErr(''); setSaved(false);
    try {
      await apiPut('/student/profile', form);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e: any) { setErr(e.message); }
  }

  if (!profile) return <div className="spinner" />;

  return (
    <div className="grid">
      <div className="card pad" style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'linear-gradient(120deg,var(--primary-soft),#fff)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff', flexShrink: 0 }}>
          {(user?.full_name || 'S')[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{profile.full_name}</h2>
          <p className="muted" style={{ margin: '4px 0 0' }}>{profile.email} · {profile.grade_name || 'No class assigned'}</p>
        </div>
      </div>

      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
        {['personal','parent','school','account'].map(t => (
          <button key={t} className={`btn sm ${activeTab === t ? '' : 'ghost'}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {err && <div className="err">{err}</div>}
      {saved && <div className="card pad" style={{ borderColor: 'var(--green)', fontSize: 13 }}>✓ Profile saved successfully!</div>}

      {activeTab === 'personal' && (
        <div className="card pad grid" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>Personal Information</h3>
          <div className="field"><label>Full Name</label><input value={f('full_name')} onChange={e => set('full_name', e.target.value)} /></div>
          <div className="field"><label>Phone</label><input value={f('phone')} onChange={e => set('phone', e.target.value)} /></div>
          <div className="field"><label>Date of Birth</label><input type="date" value={f('date_of_birth') ? f('date_of_birth').split('T')[0] : ''} onChange={e => set('date_of_birth', e.target.value)} /></div>
          <div className="field"><label>Gender</label>
            <select value={f('gender')} onChange={e => set('gender', e.target.value)}>
              <option value="">— select —</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="field"><label>Blood Group</label>
            <select value={f('blood_group')} onChange={e => set('blood_group', e.target.value)}>
              <option value="">— select —</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="field"><label>Bio</label><textarea rows={3} value={f('bio')} onChange={e => set('bio', e.target.value)} placeholder="A little about yourself..." /></div>
          <div className="field"><label>Hobbies</label><input value={f('hobbies')} onChange={e => set('hobbies', e.target.value)} placeholder="e.g. Robotics, Drawing, Cricket" /></div>
          <div className="field"><label>Languages</label><input value={f('languages')} onChange={e => set('languages', e.target.value)} placeholder="e.g. English, Hindi" /></div>
          <div className="field"><label>Address</label><input value={f('address_line1')} onChange={e => set('address_line1', e.target.value)} /></div>
          <div className="field"><label>City</label><input value={f('city')} onChange={e => set('city', e.target.value)} /></div>
          <div className="field"><label>State</label><input value={f('state')} onChange={e => set('state', e.target.value)} /></div>
          <div className="field"><label>PIN Code</label><input value={f('pincode')} onChange={e => set('pincode', e.target.value)} /></div>
        </div>
      )}

      {activeTab === 'parent' && (
        <div className="card pad grid" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>Parent / Guardian Details</h3>
          <div className="field"><label>Parent / Guardian Name</label><input value={f('parent_name')} onChange={e => set('parent_name', e.target.value)} /></div>
          <div className="field"><label>Relation</label>
            <select value={f('parent_relation')} onChange={e => set('parent_relation', e.target.value)}>
              <option>Parent</option><option>Father</option><option>Mother</option><option>Guardian</option>
            </select>
          </div>
          <div className="field"><label>Parent Phone</label><input value={f('parent_phone')} onChange={e => set('parent_phone', e.target.value)} /></div>
          <div className="field"><label>Parent Email</label><input type="email" value={f('parent_email')} onChange={e => set('parent_email', e.target.value)} /></div>
          <div className="field"><label>Occupation</label><input value={f('parent_occupation')} onChange={e => set('parent_occupation', e.target.value)} /></div>
          <div className="field"><label>Emergency Contact</label><input value={f('emergency_contact')} onChange={e => set('emergency_contact', e.target.value)} /></div>
          <div className="field"><label>Emergency Phone</label><input value={f('emergency_phone')} onChange={e => set('emergency_phone', e.target.value)} /></div>
        </div>
      )}

      {activeTab === 'school' && (
        <div className="card pad grid" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>School Information</h3>
          <div className="field"><label>School Name</label><input value={f('school_name')} onChange={e => set('school_name', e.target.value)} /></div>
          <div className="field"><label>School City</label><input value={f('school_city')} onChange={e => set('school_city', e.target.value)} /></div>
          <div className="field"><label>Roll Number</label><input value={f('roll_number')} onChange={e => set('roll_number', e.target.value)} /></div>
          <div className="field"><label>Admission Year</label><input type="number" value={f('admission_year')} onChange={e => set('admission_year', e.target.value ? Number(e.target.value) : null)} /></div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="card pad grid" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>Account Information</h3>
          <p className="muted" style={{ fontSize: 13 }}>To change your password, contact your teacher or admin.</p>
          <table>
            <tbody>
              {[['Email', profile.email],['Username', profile.username || '—'],['Class', profile.grade_name || '—'],['Member since', new Date(profile.created_at).toLocaleDateString()]].map(([l,v]) => (
                <tr key={l}><td style={{ color: 'var(--muted)', width: 140 }}>{l}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn" onClick={save} style={{ alignSelf: 'flex-start' }}>Save Profile</button>
    </div>
  );
}
