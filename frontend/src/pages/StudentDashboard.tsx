import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api';
import { useAuth } from '../auth';
import Layout from '../components/Layout';
import Chatbot from '../components/Chatbot';

interface Chapter { id: number; title: string; summary: string; difficulty: string; est_minutes: number; status?: string; best_score?: number; }
interface Module { id: number; title: string; icon: string; color: string; description: string; chapters: Chapter[]; }

const ACCENTS = ['#1E88E5', '#7c3aed', '#0ea5e9', '#16a34a', '#e11d48', '#f59e0b'];
function applyTheme(t: string) {
  document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  localStorage.setItem('ns-theme', t);
}
function applyAccent(c: string) {
  document.documentElement.style.setProperty('--primary', c);
  document.documentElement.style.setProperty('--primary-2', c);
  localStorage.setItem('ns-accent', c);
}

export default function StudentDashboard() {
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    applyTheme(localStorage.getItem('ns-theme') || 'light');
    const a = localStorage.getItem('ns-accent');
    if (a) applyAccent(a);
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
        menu={[
          { key: 'profile', label: 'My Profile', icon: '👤', onClick: () => setTab('profile') },
          { key: 'settings', label: 'Settings', icon: '⚙️', onClick: () => setTab('settings') },
        ]}
        tabs={[
          { key: 'overview', label: 'Dashboard', icon: '🏠', group: 'Overview' },
          { key: 'learn', label: 'My Courses', icon: '📚', group: 'My Learning' },
          { key: 'projects', label: 'Projects', icon: '🛠', group: 'My Learning' },
          { key: 'challenges', label: 'Challenges', icon: '⚡', group: 'Challenges & Innovation' },
          { key: 'leaderboard', label: 'Leaderboard', icon: '🏆', group: 'Community' },
          { key: 'mentor', label: 'AI Mentor', icon: '🤖', group: 'AI & Mentors' },
          { key: 'report', label: 'Progress Report', icon: '📊', group: 'My Progress' },
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
        {tab === 'settings' && <Settings />}
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

      {/* analytics / visuals */}
      <div className="analytics-row">
        <div className="card pad">
          <div className="panel-head"><div><h3>📈 Weekly Activity</h3><div className="muted" style={{ fontSize: 13 }}>XP earned over the last 7 days</div></div></div>
          <BarChart data={WEEKLY} />
        </div>
        <div className="card pad analytics-donut">
          <div className="panel-head"><div><h3>🧩 Overall Completion</h3><div className="muted" style={{ fontSize: 13 }}>{t.completed} of {t.total_chapters} chapters</div></div></div>
          <Donut value={overall} label="complete" />
        </div>
        <div className="card pad">
          <div className="panel-head"><div><h3>🎯 Skill Focus</h3><div className="muted" style={{ fontSize: 13 }}>Where your effort goes</div></div></div>
          <SkillBars data={SKILLS} />
        </div>
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
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="12" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#rg)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 65 65)" />
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#bbdefb" /></linearGradient></defs>
        <text x="65" y="62" textAnchor="middle" fontSize="26" fontWeight="800" fill="#ffffff">{value}%</text>
        <text x="65" y="82" textAnchor="middle" fontSize="10" fill="#dbeafe">complete</text>
      </svg>
      <div className="muted" style={{ fontSize: 12, textAlign: 'center' }}>{label}</div>
    </div>
  );
}
function Kpi({ icon, n, l, c }: any) {
  return <div className="card kpi"><span className="kpi-ico" style={{ color: c }}>{icon}</span><div><div className="kpi-n">{n}</div><div className="muted" style={{ fontSize: 13 }}>{l}</div></div></div>;
}

/* ---------------- charts / visuals ---------------- */
const WEEKLY = [
  { d: 'Mon', v: 40 }, { d: 'Tue', v: 65 }, { d: 'Wed', v: 30 }, { d: 'Thu', v: 82 },
  { d: 'Fri', v: 55 }, { d: 'Sat', v: 95 }, { d: 'Sun', v: 48 },
];
const SKILLS = [
  { t: 'Electronics', v: 72, c: 'var(--primary)' },
  { t: 'Robotics', v: 58, c: 'var(--purple)' },
  { t: 'Coding', v: 64, c: 'var(--green)' },
  { t: '3D Design', v: 40, c: 'var(--yellow)' },
  { t: 'AI / ML', v: 33, c: 'var(--pink)' },
];
function BarChart({ data }: { data: { d: string; v: number }[] }) {
  const max = Math.max(...data.map((x) => x.v), 1);
  return (
    <div className="barchart">
      {data.map((x) => (
        <div key={x.d} className="barchart-col" title={`${x.v} XP`}>
          <div className="barchart-track"><span style={{ height: `${(x.v / max) * 100}%` }} /></div>
          <small>{x.d}</small>
        </div>
      ))}
    </div>
  );
}
function Donut({ value, label }: { value: number; label: string }) {
  const r = 46, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <div className="donut">
      <svg viewBox="0 0 120 120" width="150" height="150">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-2)" strokeWidth="14" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#dg)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 60 60)" />
        <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1E88E5" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
        <text x="60" y="58" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--text)">{value}%</text>
        <text x="60" y="77" textAnchor="middle" fontSize="10" fill="var(--muted)">{label}</text>
      </svg>
    </div>
  );
}
function SkillBars({ data }: { data: { t: string; v: number; c: string }[] }) {
  return (
    <div className="skill-bars">
      {data.map((s) => (
        <div key={s.t} className="skill-row">
          <span className="skill-name">{s.t}</span>
          <div className="skill-track"><span style={{ width: `${s.v}%`, background: s.c }} /></div>
          <span className="skill-val">{s.v}%</span>
        </div>
      ))}
    </div>
  );
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

  const allCh = modules.flatMap((m) => m.chapters);
  const doneCh = allCh.filter((c) => c.status === 'completed').length;
  const overall = allCh.length ? Math.round((doneCh / allCh.length) * 100) : 0;

  return (
    <div className="grid learn-wrap">
      {/* summary header */}
      <div className="learn-hero">
        <div className="learn-hero-text">
          <span className="kicker" style={{ color: '#bcd6ff' }}>My Courses</span>
          <h2 style={{ margin: '6px 0 4px', color: '#fff' }}>Your learning library</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
            {modules.length} modules · {allCh.length} chapters · {doneCh} completed
          </p>
        </div>
        <div className="learn-hero-stats">
          <div><b>{overall}%</b><span>Overall</span></div>
          <div><b>{doneCh}</b><span>Done</span></div>
          <div><b>{allCh.length - doneCh}</b><span>To go</span></div>
        </div>
      </div>

      {/* module cards */}
      <div className="learn-grid">
        {modules.map((m) => {
          const done = m.chapters.filter((c) => c.status === 'completed').length;
          const mp = m.chapters.length ? Math.round((done / m.chapters.length) * 100) : 0;
          const isOpen = open === m.id;
          return (
            <div key={m.id} className={`course-card2 ${isOpen ? 'open' : ''}`}>
              <div className="course2-head" onClick={() => setOpen(isOpen ? null : m.id)}>
                <span className="course2-ico" style={{ background: m.color || 'var(--primary)' }}>{m.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row between" style={{ gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{m.title}</h3>
                    <span className="course2-chev">{isOpen ? '▾' : '▸'}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{m.description}</div>
                  <div className="course2-meta">
                    <div className="course2-bar"><span style={{ width: `${mp}%` }} /></div>
                    <span className="course2-pct">{mp}%</span>
                    <span className="tag" style={{ flexShrink: 0 }}>{done}/{m.chapters.length}</span>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="course2-body">
                  {m.chapters.map((c, i) => (
                    <div key={c.id} className="ch-card" onClick={() => nav(`/student/chapter/${c.id}`)}>
                      <span className={`ch-status ${c.status === 'completed' ? 'done' : ''}`}>{c.status === 'completed' ? '✓' : String(i + 1).padStart(2, '0')}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <b style={{ fontSize: 14 }}>{c.title}</b>
                        <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{c.summary}</div>
                        <div className="ch-tags">
                          <span className={`tag ${c.difficulty}`}>{c.difficulty}</span>
                          <span className="ch-time">⏱ {c.est_minutes}m</span>
                        </div>
                      </div>
                      <span className="ch-go">→</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
  const QUICK = [
    { i: '💡', t: 'Ask Concept Questions', p: 'Explain the concept of sensors and how they work, with a simple real-life example.' },
    { i: '🛠', t: 'Get Tinkering Hints', p: 'I am building a line-follower robot but it keeps drifting off the line. Give me step-by-step hints to fix it.' },
    { i: '🧠', t: 'Logic & Brain Teaser Help', p: 'Give me a fun logic brain teaser and guide me to solve it step by step.' },
    { i: '📖', t: 'Chapter Summaries', p: 'Give me a quick revision summary of the basics of electronics and breadboarding.' },
  ];
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi, I'm TinkerBot 🤖 — your 24×7 AI mentor! Ask me anything about your chapters, get hints for your builds, or pick a quick-start below to begin." },
  ]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  async function send(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    setText('');
    setMsgs(m => [...m, { role: 'user', text: question }]);
    setBusy(true);
    try {
      const r = await apiPost<{ answer: string }>('/student/chat', { chapter_id: null, message: question });
      setMsgs(m => [...m, { role: 'bot', text: r.answer }]);
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Sorry, I had trouble responding just now. Please try again in a moment.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#0d1b3e,#1e3a6e)' }}>
        <div>
          <span className="kicker">AI MENTOR</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>TinkerBot — Your 24×7 AI Mentor 🤖</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>Ask any question about your chapters, get hints for challenges, and get personalised learning guidance — right here.</p>
        </div>
      </div>

      <div className="proj-grid lg">
        {QUICK.map(f => (
          <button key={f.t} className="card pad proj-card mentor-quick" onClick={() => send(f.p)} disabled={busy}>
            <span style={{ fontSize: 28 }}>{f.i}</span>
            <h3 style={{ margin: '8px 0 4px', fontSize: 14 }}>{f.t}</h3>
            <p className="muted" style={{ fontSize: 13 }}>Tap to ask TinkerBot</p>
          </button>
        ))}
      </div>

      <div className="card pad mentor-chat">
        <div className="mentor-body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`mentor-msg ${m.role}`}>{m.text}</div>
          ))}
          {busy && <div className="mentor-msg bot mentor-typing"><span /><span /><span /></div>}
        </div>
        <form className="mentor-input" onSubmit={e => { e.preventDefault(); send(text); }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Ask TinkerBot anything…" />
          <button type="submit" disabled={busy || !text.trim()}>Send ➤</button>
        </form>
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

function fmtDate(v: any) { return v ? new Date(v).toLocaleDateString() : '—'; }

function InfoCard({ title, icon, rows }: { title: string; icon: string; rows: [string, any][] }) {
  return (
    <div className="card pad">
      <h3 style={{ margin: '0 0 14px', fontSize: 16 }}>{icon} {title}</h3>
      <div className="info-grid">
        {rows.map(([l, v]) => (
          <div key={l} className="info-cell">
            <span className="info-label">{l}</span>
            <span className="info-value">{v === null || v === undefined || v === '' ? '—' : v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    apiGet<any>('/student/profile').then(r => setProfile(r.profile)).catch(() => {});
  }, []);

  if (!profile) return <div className="spinner" />;
  const p = profile;

  return (
    <div className="grid">
      <div className="profile-banner">
        <div className="profile-avatar">{(user?.full_name || 'S')[0].toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, color: '#fff' }}>{p.full_name}</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.85)' }}>{p.email} · {p.grade_name || 'No class assigned'}</p>
        </div>
        <span className="profile-readonly">🔒 Read-only</span>
      </div>

      <p className="muted" style={{ fontSize: 13, margin: 0 }}>
        This is your student record. To update any details, please contact your teacher or school administrator.
      </p>

      <InfoCard title="Personal Information" icon="🧑" rows={[
        ['Full Name', p.full_name], ['Phone', p.phone], ['Date of Birth', fmtDate(p.date_of_birth)],
        ['Gender', p.gender], ['Blood Group', p.blood_group], ['Languages', p.languages],
        ['Hobbies', p.hobbies], ['Bio', p.bio],
      ]} />

      <InfoCard title="Address" icon="📍" rows={[
        ['Address', p.address_line1], ['City', p.city], ['State', p.state], ['PIN Code', p.pincode],
      ]} />

      <InfoCard title="Parent / Guardian" icon="👪" rows={[
        ['Name', p.parent_name], ['Relation', p.parent_relation], ['Phone', p.parent_phone],
        ['Email', p.parent_email], ['Occupation', p.parent_occupation],
        ['Emergency Contact', p.emergency_contact], ['Emergency Phone', p.emergency_phone],
      ]} />

      <InfoCard title="School Information" icon="🏫" rows={[
        ['School Name', p.school_name], ['School City', p.school_city],
        ['Roll Number', p.roll_number], ['Admission Year', p.admission_year],
      ]} />

      <InfoCard title="Account" icon="🪪" rows={[
        ['Email', p.email], ['Username', p.username], ['Class', p.grade_name],
        ['Member since', fmtDate(p.created_at)],
      ]} />

      <ChangePasswordCard />
    </div>
  );
}

function ChangePasswordCard() {
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [cf, setCf] = useState('');
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setMsg(null);
    if (!cur || !nw) return setMsg({ k: 'err', t: 'Please enter both passwords' });
    if (nw.length < 6) return setMsg({ k: 'err', t: 'New password must be at least 6 characters' });
    if (nw !== cf) return setMsg({ k: 'err', t: 'New password and confirmation do not match' });
    setBusy(true);
    try {
      await apiPost('/auth/change-password', { currentPassword: cur, newPassword: nw });
      setMsg({ k: 'ok', t: 'Password updated successfully.' });
      setCur(''); setNw(''); setCf('');
    } catch (e: any) {
      setMsg({ k: 'err', t: e.message || 'Failed to change password' });
    } finally { setBusy(false); }
  }

  return (
    <div className="card pad">
      <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>🔐 Change Password</h3>
      <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>For your security, choose a strong password (min 6 characters) that you do not use elsewhere.</p>
      {msg && (
        <div className="card pad" style={{ borderColor: msg.k === 'ok' ? 'var(--green)' : 'var(--red)', fontSize: 13, marginBottom: 12 }}>
          {msg.t}
        </div>
      )}
      <div className="grid" style={{ gap: 10, maxWidth: 420 }}>
        <div className="field"><label>Current password</label><input type="password" value={cur} onChange={(e) => setCur(e.target.value)} /></div>
        <div className="field"><label>New password</label><input type="password" value={nw} onChange={(e) => setNw(e.target.value)} /></div>
        <div className="field"><label>Confirm new password</label><input type="password" value={cf} onChange={(e) => setCf(e.target.value)} /></div>
        <button className="btn" disabled={busy} onClick={submit} style={{ alignSelf: 'flex-start' }}>{busy ? 'Updating…' : 'Update Password'}</button>
      </div>
    </div>
  );
}

function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('ns-theme') || 'light');
  const [accent, setAccent] = useState(localStorage.getItem('ns-accent') || '#1E88E5');

  function chooseTheme(t: string) { setTheme(t); applyTheme(t); }
  function chooseAccent(c: string) { setAccent(c); applyAccent(c); }

  return (
    <div className="grid">
      <div className="profile-banner">
        <div className="profile-avatar">⚙️</div>
        <div>
          <h2 style={{ margin: 0, color: '#fff' }}>Settings</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.85)' }}>Personalise the look and feel of your portal</p>
        </div>
      </div>

      <div className="card pad">
        <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>🎨 Theme</h3>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Choose how your dashboard looks.</p>
        <div className="theme-options">
          {[
            { k: 'light', t: 'Light', d: 'Bright & clean', sw: '#f5f7fb' },
            { k: 'dark', t: 'Dark', d: 'Easy on the eyes', sw: '#0f172a' },
          ].map((o) => (
            <button key={o.k} className={`theme-opt ${theme === o.k ? 'on' : ''}`} onClick={() => chooseTheme(o.k)}>
              <span className="theme-swatch" style={{ background: o.sw }} />
              <div><b>{o.t}</b><small>{o.d}</small></div>
              {theme === o.k && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="card pad">
        <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>🌈 Accent Colour</h3>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Pick the highlight colour used across your portal.</p>
        <div className="accent-row">
          {ACCENTS.map((c) => (
            <button key={c} className={`accent-dot ${accent.toLowerCase() === c.toLowerCase() ? 'on' : ''}`} style={{ background: c }} onClick={() => chooseAccent(c)} aria-label={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

