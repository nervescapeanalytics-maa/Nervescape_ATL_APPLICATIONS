import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api';
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
function Learn({ modules: primaryModules }: { modules: Module[] }) {
  const nav = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [primaryId, setPrimaryId] = useState<number | null>(null);
  const [selGrade, setSelGrade] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>(primaryModules);
  const [loadingMods, setLoadingMods] = useState(false);
  const [open, setOpen] = useState<number | null>(primaryModules[0]?.id ?? null);

  // Load the list of classes the student can access (enrolled + custom)
  useEffect(() => {
    apiGet<any>('/student/my-classes').then((r) => {
      const list = r.classes || [];
      setClasses(list);
      setPrimaryId(r.primary_grade_id ?? null);
      setSelGrade(r.primary_grade_id ?? (list[0]?.grade_id ?? null));
    }).catch(() => {
      // leave classes empty; the render shows a clear "no class" message
    }).finally(() => setClassesLoaded(true));
  }, []);

  // Load modules for the selected class (skip refetch for primary, already have it)
  useEffect(() => {
    if (selGrade == null) return;
    if (selGrade === primaryId) { setModules(primaryModules); setOpen(primaryModules[0]?.id ?? null); return; }
    setLoadingMods(true);
    apiGet<{ modules: Module[] }>(`/student/courses?gradeId=${selGrade}`)
      .then((r) => { setModules(r.modules); setOpen(r.modules[0]?.id ?? null); })
      .catch(() => setModules([]))
      .finally(() => setLoadingMods(false));
  }, [selGrade, primaryId, primaryModules]);

  const allCh = modules.flatMap((m) => m.chapters);
  const doneCh = allCh.filter((c) => c.status === 'completed').length;
  const overall = allCh.length ? Math.round((doneCh / allCh.length) * 100) : 0;

  // Still loading the list of accessible classes — show a spinner (not forever).
  if (!classesLoaded) return <div className="spinner" />;

  // Loaded, but the student has no enrolled class and no admin-granted access.
  if (classes.length === 0 && selGrade == null) {
    return (
      <div className="card pad" style={{ textAlign: 'center', padding: 32, maxWidth: 560, margin: '24px auto' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏫</div>
        <h3 style={{ margin: '0 0 6px' }}>No class assigned yet</h3>
        <p className="muted" style={{ margin: 0 }}>
          You're not enrolled in a class and haven't been granted access to any custom courses yet.
          Please ask your teacher or administrator to assign you to a class.
        </p>
      </div>
    );
  }

  return (
    <div className="grid learn-wrap">
      {/* class switcher (enrolled + custom courses) */}
      {classes.length > 1 && (
        <div className="card pad" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <b style={{ fontSize: 13 }}>🏫 Switch class:</b>
          {classes.map((c: any) => (
            <button
              key={c.grade_id}
              className={`btn sm ${selGrade === c.grade_id ? '' : 'ghost'}`}
              onClick={() => setSelGrade(c.grade_id)}
            >
              {c.grade_name}
              {c.grade_id === primaryId
                ? <span style={{ fontSize: 10, marginLeft: 6, opacity: 0.8 }}>(enrolled)</span>
                : <span style={{ fontSize: 10, marginLeft: 6, opacity: 0.8 }}>(custom)</span>}
            </button>
          ))}
        </div>
      )}

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

      {loadingMods && <div className="spinner" />}
      {!loadingMods && modules.length === 0 && (
        <div className="card pad muted" style={{ textAlign: 'center', padding: 24 }}>No published courses in this class yet.</div>
      )}

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

/* ---------------- RICH PROJECTS DATA ---------------- */
const RICH_PROJECTS = [
  {
    i: '🚗', t: 'Line-Follower Robot', level: 'Robotics · Intermediate', track: 'robotics',
    tagline: 'Build a robot that autonomously follows a black line on a white surface using IR sensors.',
    objective: 'Design, build, and program a two-wheeled robot that follows a path drawn with black tape. You will learn how sensors convert physical signals into digital decisions — the same principle behind self-driving cars.',
    whyItMatters: 'Line-followers are the "Hello World" of robotics. They teach you sensors, motor control, feedback loops, and algorithm design — all in one compact project. Industrial robots in warehouses (like Amazon\'s Kiva robots) use the same concept at scale.',
    futureScope: 'Advanced: add a camera (OpenCV) for visual line detection, implement PID control for smooth curves, build a maze-solving version, integrate with IoT to report lap times to a cloud dashboard.',
    takeaways: ['How IR sensors detect surface color changes', 'How to implement decision logic for two-motor differential drive', 'Feedback control fundamentals', 'Debugging a physical system where code AND hardware can both fail'],
    equipment: [
      { name: 'Arduino Uno', role: 'The "brain" — processes sensor data and controls motors', alt: 'NodeMCU (adds Wi-Fi), STM32 (more powerful), Raspberry Pi Pico (cheaper)', tip: 'Arduino Uno is perfect for beginners — huge community support.' },
      { name: '2× IR Sensor Module (TCRT5000)', role: 'Detects black/white surface by measuring reflected infrared light', alt: 'Analog line sensors (give gradient instead of digital), Color sensors (TCS230), Camera module', tip: 'Set sensor height to 1-2cm above surface for best results.' },
      { name: 'L298N Motor Driver', role: 'Amplifies Arduino\'s weak signals to drive motors; controls direction', alt: 'L293D (less current), TB6612FNG (more efficient, less heat), MX1508 (cheaper)', tip: 'L298N loses ~2V internally. If using 6V motors, power with 8V.' },
      { name: '2× DC Gear Motors with Wheels', role: 'Provide movement; geared down for torque at low speed', alt: 'Servo + wheel (precise but expensive), Stepper motors (precise but heavy)', tip: 'Use motors with encoders for more precise control later.' },
      { name: 'Li-ion Battery (7.4V 1000mAh)', role: 'Powers everything; rechargeable for long development sessions', alt: '4× AA batteries (cheaper but weaker), LiPo (lighter but risky if damaged)', tip: 'Always add a power switch to protect the battery.' },
    ],
    circuit: 'IR Sensor Left → D2 | IR Sensor Right → D3 | L298N: IN1→D5, IN2→D6, IN3→D9, IN4→D10 | ENA/ENB connect to PWM pins for speed control. Power: 7.4V battery to L298N VCC; L298N 5V out powers Arduino. ALWAYS connect all grounds together.',
    algorithm: `void loop() {
  bool L = digitalRead(IR_LEFT);   // 0 = black, 1 = white
  bool R = digitalRead(IR_RIGHT);
  if (!L && !R) forward();         // Both on line → go straight
  else if (L && !R) turnRight();   // Left off line → drift right, correct left
  else if (!L && R) turnLeft();    // Right off line → drift left, correct right
  else stop();                     // Both off line → lost, stop
}`,
    commonMistakes: [
      'IR sensors placed too high (>3cm) — misses the line on curves',
      'Motors spinning in wrong direction — swap wire polarity, not code',
      'Battery voltage too low — robot slows down, logic fails',
      'Not connecting all grounds (GND) together — random behavior',
      'Using delay() for turning — blocks all other processing',
    ],
    keyPoints: ['Sensor height: 10-15mm for best line detection', 'Test indoors — sunlight saturates IR sensors', 'Start with low speed, tune later', 'Use PWM for speed control (analogWrite)'],
    enhancements: ['Add PID control for smoother curves', 'Add a third center sensor for better straight-line detection', 'Log performance data via Bluetooth to your phone', 'Build a race track and host a class competition'],
    summary: 'You built a robot that makes real-time decisions from sensor data. The core skills — sensing, deciding, acting — are the same as in any autonomous system, from industrial robots to self-driving cars. This project proves you can build hardware AND software that work together.',
  },
  {
    i: '🛑', t: 'Obstacle-Avoidance Bot', level: 'Robotics · Intermediate', track: 'robotics',
    tagline: 'A robot that navigates an unknown environment by detecting and avoiding obstacles using ultrasonic sensing.',
    objective: 'Build a robot that can roam freely and intelligently avoid collisions using an HC-SR04 ultrasonic sensor. Extend to add servo-mounted scanning for smarter navigation.',
    whyItMatters: 'Every autonomous vehicle (from robot vacuum cleaners to Mars rovers) needs obstacle avoidance. This project introduces you to range sensing, conditional logic, and the concept of "reactive navigation" — responding to environment in real time.',
    futureScope: 'Add multiple sensors for 360° detection, implement SLAM (Simultaneous Localization and Mapping) concepts, connect to a phone for remote monitoring, add a camera for object recognition.',
    takeaways: ['How ultrasonic distance measurement works (speed of sound)', 'Time-critical programming with pulseIn()', 'State-machine logic for navigation', 'Mechanical mounting and cable management'],
    equipment: [
      { name: 'HC-SR04 Ultrasonic Sensor', role: 'Sends a 40kHz sound pulse, measures time until echo returns — calculates distance', alt: 'VL53L0X laser ToF sensor (more accurate, immune to temperature), IR proximity sensor (shorter range)', tip: 'Works 2cm–400cm. Objects must face the sensor directly — angled surfaces deflect sound.' },
      { name: 'SG90 Servo Motor', role: 'Rotates the ultrasonic sensor left and right to scan for clearance before turning', alt: 'Fixed sensor (simpler but no scanning), Camera with depth estimation (advanced)', tip: 'Mount sensor at front-center, 15–20cm height for best coverage.' },
      { name: 'Arduino Uno + L298N + Motors', role: 'Same as Line Follower — brain, motor driver, drive system', alt: 'See Line Follower project', tip: 'Use the same chassis if possible — keeps project consistent.' },
    ],
    circuit: 'HC-SR04: VCC→5V, GND→GND, TRIG→D7, ECHO→D8 (add voltage divider: 1kΩ+2kΩ to convert 5V echo to 3.3V if using NodeMCU). Servo: Signal→D11, VCC→5V, GND→GND. Use separate 5V line for servo to avoid brownouts.',
    algorithm: `long getDistance() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH) * 0.034 / 2;  // cm
}
void loop() {
  long dist = getDistance();
  if (dist > 20) { forward(); }
  else {
    stop();
    scanLeftRight();           // servo scans, pick clearer side
    if (leftClear) turnLeft(600);
    else turnRight(600);
  }
}`,
    commonMistakes: ['Not waiting for sensor to settle (add 50ms between readings)', 'Measuring echo before sending trigger pulse', 'Mounting sensor facing down — reads the floor', 'Not handling sensor timeout (infinite pulseIn wait)'],
    keyPoints: ['Distance (cm) = pulseIn duration (µs) × 0.034 / 2', 'Minimum safe distance: 20–30cm for typical robot speeds', 'Add 50–100ms delay between consecutive readings'],
    enhancements: ['Add left and right sensors for simultaneous 3-direction scanning', 'Log position data to EEPROM for basic mapping', 'Add buzzer that beeps faster as obstacles get closer (like a reversing car)'],
    summary: 'You implemented reactive navigation — the foundation of autonomous robotics. Your robot\'s "sense-think-act" cycle mirrors how all autonomous systems work, from Roombas to Mars rovers. Add more sensors to see exponential improvement in capability.',
  },
  {
    i: '🌱', t: 'Smart Plant Monitor', level: 'IoT · Beginner', track: 'iot',
    tagline: 'An IoT system that monitors soil moisture, temperature, and light — and sends alerts when your plant needs care.',
    objective: 'Build an automated plant care monitoring system using cheap sensors and a NodeMCU. Push real-time data to a cloud dashboard (ThingSpeak/Blynk) and get mobile alerts.',
    whyItMatters: 'Smart agriculture is a $15 billion industry. Precision irrigation (watering only when needed) saves 30–50% water vs. traditional methods. This project teaches you the complete IoT stack: sense → transmit → store → visualize → alert.',
    futureScope: 'Add automated watering pump, solar power for outdoor use, multi-plant monitoring, camera for visual plant health monitoring, machine learning to predict watering schedules.',
    takeaways: ['Capacitive vs. resistive soil moisture sensing', 'Reading analog sensors with ADC', 'HTTP/MQTT protocols for cloud communication', 'ThingSpeak/Blynk dashboard setup', 'Power management for battery-operated IoT'],
    equipment: [
      { name: 'NodeMCU ESP8266', role: 'Reads sensors + connects to Wi-Fi + pushes data to cloud', alt: 'ESP32 (Bluetooth + Wi-Fi + more pins), Arduino + Ethernet shield (no Wi-Fi), Raspberry Pi (overkill for this)', tip: 'NodeMCU works on 3.3V — use voltage divider for any 5V sensors.' },
      { name: 'Capacitive Soil Moisture Sensor', role: 'Measures soil water content WITHOUT corroding (capacitive = no exposed metal contacts)', alt: 'Resistive sensor (cheaper, corrodes quickly), Professional EC sensor (expensive, accurate)', tip: 'Capacitive sensors last 10× longer than resistive. Worth the small extra cost.' },
      { name: 'DHT11 Temperature & Humidity Sensor', role: 'Measures air temperature and humidity around the plant', alt: 'DHT22 (more accurate, $2 more), SHT31 (best accuracy, more expensive)', tip: 'DHT11 has ±2°C accuracy — fine for plants. Read at most once every 2 seconds.' },
      { name: 'LDR (Light Dependent Resistor)', role: 'Measures light intensity — tells you if plant is getting enough light', alt: 'BH1750 lux sensor (gives actual lux values, more useful), Photodiode (more precise)', tip: 'Use with a 10kΩ resistor in voltage divider. High resistance = dark.' },
    ],
    circuit: 'Moisture sensor: OUT→A0 (NodeMCU has only 1 analog pin). DHT11: DATA→D4, 10kΩ pull-up to 3.3V. LDR: One end→3.3V, other end→D5 (analog with ADS1115 if need multiple analogs). Add ADS1115 I2C ADC module to read 4 analog sensors if needed.',
    algorithm: `void loop() {
  float moisture = analogRead(A0) / 1023.0 * 100;
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Send to ThingSpeak every 60 seconds
  if (millis() - lastUpload > 60000) {
    ThingSpeak.setField(1, moisture);
    ThingSpeak.setField(2, temp);
    ThingSpeak.writeFields(channelID, apiKey);
    if (moisture < 30) sendTelegramAlert("🌱 Water your plant!");
    lastUpload = millis();
  }
}`,
    commonMistakes: ['Reading DHT faster than 2 seconds — returns NaN', 'Placing capacitive sensor too shallow (<5cm below surface)', 'Not accounting for NodeMCU\'s 3.3V GPIO limit', 'Uploading too frequently (rate-limited by ThingSpeak to once/15s on free tier)'],
    keyPoints: ['Calibrate moisture sensor: read dry soil (dry value) and saturated soil (wet value), then map to 0–100%', 'Most plants want moisture 40–70%', 'ThingSpeak free tier: max 1 update per 15 seconds per channel'],
    enhancements: ['Add a relay to control a water pump automatically', 'Solar panel + LiPo battery for outdoor deployment', 'Add camera module for visual monitoring', 'Build a multi-plant monitoring dashboard'],
    summary: 'You built a complete IoT system from sensors to cloud dashboard. This is the same architecture used in precision agriculture, smart homes, and industrial monitoring. The skills scale directly — the only difference between your system and a commercial product is packaging and certification.',
  },
  {
    i: '🏠', t: 'Home Automation Node', level: 'AIoT · Advanced', track: 'iot',
    tagline: 'Control lights, fans, and appliances over Wi-Fi from anywhere in the world.',
    objective: 'Build a Wi-Fi-controlled home automation node that can switch appliances ON/OFF remotely via a smartphone app or voice command (Google Assistant/Alexa integration).',
    whyItMatters: 'Smart home market: $80 billion globally. This project teaches you relay circuits for mains voltage (safely), MQTT messaging, REST APIs, and App development. These skills are directly relevant to building commercial smart home products.',
    futureScope: 'Add energy monitoring (CT clamp), scene automation (sunset triggers), integrate with HomeAssistant for local control, add occupancy sensors, voice control via Google Home.',
    takeaways: ['IMPORTANT: Mains AC safety practices', 'Relay module working and limitations', 'MQTT publish/subscribe for real-time control', 'App development with Blynk or MIT App Inventor', 'REST API for remote control from anywhere'],
    equipment: [
      { name: 'NodeMCU ESP8266 / ESP32', role: 'Wi-Fi microcontroller — receives commands, controls relays', alt: 'Raspberry Pi (more powerful but overkill), Sonoff off-the-shelf modules (pre-built but less learning)', tip: 'Use ESP32 for this project — Bluetooth + Wi-Fi + more GPIO + faster processor.' },
      { name: '4-Channel Relay Module (5V)', role: 'Electrically isolates and switches 230V AC appliances safely from 5V logic', alt: 'Solid State Relay (no clicking sound, longer life), MOSFET (for DC only, not AC)', tip: '⚠️ SAFETY FIRST: If connecting to 230V mains, have an adult supervise or use only 12V DC loads for school projects.' },
      { name: 'AMS1117 / LM7805 Voltage Regulator', role: 'Provides stable 5V to relay coils from 12V supply', alt: 'Buck converter module (more efficient for battery projects)', tip: 'Relay coils draw 70–90mA each. Ensure power supply can handle all relays on simultaneously.' },
    ],
    circuit: 'ESP8266 GPIO → relay IN pins (active LOW — LOW turns relay ON). Add optocoupler isolation between MCU and relay coil for safety. Connect relay NO (Normally Open) contacts in series with the load. ⚠️ For 230V loads: keep AC wiring separate from DC control wiring. Use appropriate wire gauge for current draw.',
    algorithm: `// MQTT-based control
void callback(char* topic, byte* payload, unsigned int length) {
  String msg = String((char*)payload).substring(0, length);
  int relay = getRelayFromTopic(topic);  // parse relay number
  if (msg == "ON") digitalWrite(relayPin[relay], LOW);   // Active LOW
  if (msg == "OFF") digitalWrite(relayPin[relay], HIGH);
}
// Subscribe to: home/relay/1, home/relay/2, etc.`,
    commonMistakes: ['Active-LOW confusion: LOW signal turns relay ON (counterintuitive)', 'Floating GPIO pins at startup — add pull-up resistors', 'Relay chattering due to power supply noise — add 100µF capacitor', '⚠️ Not isolating 230V wiring from PCB ground'],
    keyPoints: ['Relay is essentially an electromagnetically controlled switch — no direct electrical connection between control side and power side', 'MQTT broker can be local (Mosquitto on Raspberry Pi) or cloud (HiveMQ, CloudMQTT)', 'Add NTP time sync to schedule actions'],
    enhancements: ['Add energy monitoring with PZEM-004T sensor', 'Build a touchscreen control panel (Nextion display)', 'Integrate with Google Assistant using IFTTT webhooks', 'Add occupancy sensor (PIR) for automatic lights-off'],
    summary: 'You built the core of a smart home system. The relay-MQTT architecture you implemented is exactly what commercial products like Sonoff and Shelly devices use internally. Understanding what\'s inside these "black boxes" is the difference between a user and a maker.',
  },
  {
    i: '🖐', t: 'Gesture-Controlled Car', level: 'Robotics · Advanced', track: 'robotics',
    tagline: 'Control a robot car by tilting your hand — using an accelerometer to translate gestures into movement commands.',
    objective: 'Build a wireless robot car controlled by hand gestures. An MPU-6050 accelerometer/gyroscope on a transmitter glove sends tilt data via RF/Bluetooth to the robot.',
    whyItMatters: 'Gesture interfaces are used in surgical robots, VR controllers, and drone control. This project introduces inertial measurement units (IMUs), wireless communication, and data fusion — core skills in robotics and wearable tech.',
    futureScope: 'Add haptic feedback (vibration motors in glove), use ML to recognize complex gestures (wave, circle, clench), control a drone instead of a car, implement gesture-based sign language recognition.',
    takeaways: ['How MEMS accelerometers measure tilt (gravity vector decomposition)', 'I2C communication protocol (how devices talk on 2 wires)', 'Wireless communication (HC-12 RF or Bluetooth)', 'Data calibration and noise filtering (Complementary filter)'],
    equipment: [
      { name: 'MPU-6050 IMU', role: '6-axis sensor: 3-axis accelerometer + 3-axis gyroscope. Measures tilt, rotation, vibration', alt: 'ADXL345 (accelerometer only, cheaper), BNO055 (9-axis with onboard fusion — easier to use)', tip: 'MPU-6050 requires calibration. Run calibration code first to get your specific sensor\'s offsets.' },
      { name: 'HC-12 Serial RF Module (or HC-05 Bluetooth)', role: 'Wireless link between glove and car over 100m range (HC-12) or 10m (Bluetooth)', alt: 'NRF24L01 (better for high-speed data), ESP-NOW on ESP8266 (easiest Wi-Fi alternative)', tip: 'HC-12 433MHz: set to same channel on both ends. Baud rate must match.' },
      { name: '2× Arduino + L298N + DC Motors', role: 'One Arduino in glove (transmit), one in car (receive + control motors)', alt: 'Use ESP8266 pair with ESP-NOW (simpler, wireless)', tip: 'Power the car Arduino separately from the motor driver to prevent brownouts.' },
    ],
    circuit: 'Glove: MPU-6050 →I2C→ Arduino → HC-12 TX/RX. Car: HC-12 → Arduino → L298N → Motors. Send tilt as "F", "B", "L", "R", "S" characters wirelessly. Parse received character on car side to decide motor action.',
    algorithm: `// Glove side
void loop() {
  float roll = atan2(accelY, accelZ) * 180/PI;   // Left-right tilt
  float pitch = atan2(-accelX, sqrt(accelY*accelY + accelZ*accelZ)) * 180/PI;
  
  if (pitch > 20) HC12.print("F");       // Tilt forward → forward
  else if (pitch < -20) HC12.print("B"); // Tilt backward → reverse
  else if (roll > 20) HC12.print("R");   // Tilt right → right
  else if (roll < -20) HC12.print("L");  // Tilt left → left
  else HC12.print("S");                   // Level → stop
}`,
    commonMistakes: ['Not calibrating MPU-6050 — causes drift', 'Using blocking delay() in wireless code — causes packet loss', 'Threshold too sensitive — small hand tremors trigger movement', 'Not adding low-pass filter — accelerometer data is noisy'],
    keyPoints: ['Accelerometer measures gravity direction to determine tilt', 'Gyroscope measures rotation rate — combine both for stable orientation', 'Dead zones (15–20° threshold before activating) prevent jitter'],
    enhancements: ['Use Kalman filter for smoother tilt data', 'Add variable speed: tilt angle proportional to motor speed', 'Control a robotic arm (servos) instead of a car', 'Add a glove LED indicator that shows current command'],
    summary: 'You built a human-machine interface based on physics — converting gravity vectors into robot commands. IMUs are in every smartphone, gaming controller, and drone. The math you used (arctan for angle calculation) is exactly what Apple\'s motion APIs use when your phone switches from portrait to landscape.',
  },
  {
    i: '👁', t: 'Object Detector (Computer Vision)', level: 'AI/ML · Advanced', track: 'ai',
    tagline: 'Train an AI model to recognize real-world objects using Teachable Machine and deploy it on your browser or Raspberry Pi.',
    objective: 'Build a real-time object detection system using transfer learning (Teachable Machine by Google). Train it to recognize 3–5 categories of objects, evaluate performance, and deploy it as a web app.',
    whyItMatters: 'Computer vision is the fastest-growing area of AI. Medical diagnosis, self-driving cars, quality control in manufacturing, face recognition — all use exactly what you\'re learning. Transfer learning makes this accessible without GPUs or months of data.',
    futureScope: 'Deploy on Raspberry Pi + camera for standalone system, use YOLOv8 for real-time video detection, build a hand sign language translator, create an inventory counting system for a shop.',
    takeaways: ['What transfer learning is and why it matters', 'How CNNs (Convolutional Neural Networks) extract features from images', 'Data collection strategies and what makes a good training set', 'Model evaluation: accuracy, precision, recall, confusion matrix', 'Deploying ML models to web (TensorFlow.js)'],
    equipment: [
      { name: 'Computer with Webcam (or Phone Camera)', role: 'Captures training images and runs inference in real-time through browser', alt: 'Raspberry Pi + Pi Camera (for standalone deployment), Jetson Nano (for faster inference)', tip: 'Use Google Chrome for best Teachable Machine compatibility.' },
      { name: 'Teachable Machine (Google)', role: 'Free online tool to train image/sound/pose classifiers — no code needed for basic version', alt: 'TensorFlow Keras (full control but needs Python knowledge), YOLO (for real-time detection)', tip: 'Start with Teachable Machine, then graduate to Keras for more control.' },
      { name: 'Good Lighting', role: 'The most underrated "component" — bad lighting is the #1 cause of poor accuracy', alt: 'Ring light (Amazon, ₹500), Natural diffused daylight', tip: 'Take 50% of training images in deployment conditions (the lighting where the system will actually run).' },
    ],
    circuit: 'No hardware circuit needed for the browser version. For Raspberry Pi deployment: Camera Module → CSI port or USB webcam. TensorFlow Lite model runs on Pi CPU at ~5–10 FPS.',
    algorithm: `// After training on Teachable Machine, export as TF.js:
const model = await tmImage.load(modelURL, metadataURL);
// Real-time prediction loop:
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  const top = prediction.sort((a,b) => b.probability - a.probability)[0];
  if (top.probability > 0.8) {
    showResult(top.className, top.probability);
  }
  requestAnimationFrame(predict);
}`,
    commonMistakes: ['Training all images in the same background — model learns the background, not the object', 'Too few images per class (<50) — model won\'t generalize', 'Testing on training data — artificially inflated accuracy', 'Classes that look too similar — add more distinguishing features to training data', 'Not accounting for different angles, distances, lighting conditions'],
    keyPoints: ['Minimum 100–200 images per class for reliable results', 'Include negative examples (background/other objects) as a class', 'Confidence threshold: only trust predictions >80%', 'Confusion matrix shows exactly which classes get confused with each other'],
    enhancements: ['Export to TensorFlow Lite and run on Raspberry Pi', 'Add a buzzer/LED that activates on specific detection', 'Build a product quality checker (good/damaged/wrong orientation)', 'Create a hand gesture music controller'],
    summary: 'You used transfer learning to teach a computer to see. The MobileNet model you built on had already learned millions of visual features from ImageNet — you just added your specific categories on top. This "standing on shoulders of giants" approach is how modern AI works, and why AI development has accelerated so dramatically in the last decade.',
  },
];

/* ---------------- PROJECTS COMPONENT (Rich) ---------------- */
function Projects({ modules }: { modules: Module[] }) {
  const nav = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const chapters = modules.flatMap(m => m.chapters);

  if (selected !== null) {
    const p = RICH_PROJECTS[selected];
    return (
      <div className="grid">
        <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => setSelected(null)}>← Back to all projects</button>

        {/* Hero */}
        <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#0d1b3e,#1a3a6e)' }}>
          <div>
            <span className="kicker">{p.level}</span>
            <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>{p.i} {p.t}</h2>
            <p style={{ color: '#b0c4de', margin: 0 }}>{p.tagline}</p>
          </div>
        </div>

        {/* Objective + Why it matters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Panel title="Learning Objective" icon="🎯">
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.objective}</p>
          </Panel>
          <Panel title="Why This Project Matters" icon="💡">
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.whyItMatters}</p>
          </Panel>
        </div>

        {/* Takeaways */}
        <Panel title="What You Will Learn" icon="📚">
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6 }}>
            {p.takeaways.map((t, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.6 }}>{t}</li>)}
          </ul>
        </Panel>

        {/* Equipment */}
        <Panel title="Equipment You Need" icon="🔧" sub="Each component is explained with its role, alternatives, and pro tips">
          {p.equipment.map((e, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="tag" style={{ background: 'var(--primary)', color: '#fff', fontSize: 12, flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</span>
                <b style={{ fontSize: 15 }}>{e.name}</b>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                <div><span className="muted">Role:</span><p style={{ margin: '2px 0 0', lineHeight: 1.5 }}>{e.role}</p></div>
                <div><span className="muted">Alternatives:</span><p style={{ margin: '2px 0 0', lineHeight: 1.5, color: 'var(--green)' }}>{e.alt}</p></div>
              </div>
              <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: 6, borderLeft: '3px solid var(--primary)', fontSize: 13 }}>
                💡 <b>Pro Tip:</b> {e.tip}
              </div>
            </div>
          ))}
        </Panel>

        {/* Circuit */}
        <Panel title="Circuit Connections" icon="⚡" sub="Wiring guide — read carefully before connecting power">
          <div style={{ background: 'var(--bg-2)', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', borderLeft: '3px solid var(--yellow)' }}>
            {p.circuit}
          </div>
        </Panel>

        {/* Algorithm */}
        <Panel title="Core Algorithm" icon="💻" sub="Simplified code logic — understand it before copying it">
          <div style={{ background: '#0d1117', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, color: '#e6edf3', whiteSpace: 'pre', overflowX: 'auto', borderLeft: '3px solid #58a6ff' }}>
            {p.algorithm}
          </div>
        </Panel>

        {/* Common mistakes + Key points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Panel title="Common Mistakes" icon="⚠️" sub="Mistakes every beginner makes — read before you build">
            <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6 }}>
              {p.commonMistakes.map((m, i) => <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--pink)' }}>{m}</li>)}
            </ul>
          </Panel>
          <Panel title="Key Points to Remember" icon="🔑">
            <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6 }}>
              {p.keyPoints.map((k, i) => <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--green)' }}>{k}</li>)}
            </ul>
          </Panel>
        </div>

        {/* Enhancements */}
        <Panel title="How to Enhance This Project Further" icon="🚀" sub="Once working, here is how to push it to the next level">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {p.enhancements.map((e, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, borderLeft: '3px solid var(--green)', fontSize: 13, lineHeight: 1.5 }}>
                🚀 {e}
              </div>
            ))}
          </div>
        </Panel>

        {/* Future scope */}
        <Panel title="Future Scope" icon="🔭">
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.futureScope}</p>
        </Panel>

        {/* Summary */}
        <div className="card pad" style={{ background: 'linear-gradient(120deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h3 style={{ margin: '0 0 10px' }}>📋 Project Summary</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0 }}>{p.summary}</p>
        </div>

        {/* Start learning */}
        {chapters[0] && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <button className="btn glow" onClick={() => nav(`/student/chapter/${chapters[0].id}`)}>
              ▶ Start Learning This Track →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid">
      <Panel title="Project-Based Learning" icon="🛠" sub="Click any project for full details: objectives, equipment, circuits, code, common mistakes and more">
        <div className="proj-grid lg">
          {RICH_PROJECTS.map((p, i) => (
            <div key={p.t} className="card pad proj-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(i)}>
              <span style={{ fontSize: 32 }}>{p.i}</span>
              <h3 style={{ margin: '10px 0 4px' }}>{p.t}</h3>
              <span className="tag">{p.level}</span>
              <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{p.tagline}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {p.takeaways.slice(0, 2).map((t, j) => <span key={j} className="tag" style={{ fontSize: 11 }}>✓ {t.split(' ').slice(0,4).join(' ')}…</span>)}
              </div>
              <button className="btn ghost sm">Open project guide →</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- CHALLENGES (Dynamic, DB-driven) ---------------- */
const QTYPE_META: Record<string, { icon: string; label: string; color: string; desc: string }> = {
  brain_teaser: { icon: '🧠', label: 'Brain Teasers', color: '#8b5cf6', desc: 'Logic puzzles and conceptual riddles that make you think differently.' },
  tinkering: { icon: '🛠', label: 'Tinkering Challenges', color: '#059669', desc: 'Design, build, and explain hands-on engineering tasks.' },
  logical: { icon: '🔎', label: 'Logical Thinking', color: '#0ea5e9', desc: 'Cause-and-effect, sequencing, and systematic reasoning.' },
  computational: { icon: '💻', label: 'Computational Thinking', color: '#f59e0b', desc: 'Algorithms, patterns, code tracing, and data analysis.' },
};

function Challenges({ modules }: { modules: Module[] }) {
  const [activeTab, setActiveTab] = useState<string>('brain_teaser');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    setLoading(true);
    apiGet<{ questions: any[] }>('/content/challenges')
      .then(r => { setQuestions(r.questions); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const byType = questions.reduce((acc: Record<string, any[]>, q) => {
    (acc[q.qtype] ||= []).push(q);
    return acc;
  }, {});

  const filtered = (byType[activeTab] || [])
    .filter(q => filter === 'all' || q.difficulty === filter);

  const diffColor: Record<string, string> = { easy: 'var(--green)', medium: 'var(--yellow)', hard: 'var(--pink)' };

  async function revealAnswer(id: number) {
    if (revealed[id]) { setRevealed(r => ({ ...r, [id]: !r[id] })); return; }
    try {
      const r = await apiGet<{ answer: string; explanation: string }>(`/content/challenges/${id}/answer`);
      const q = questions.find(q => q.id === id);
      if (q) { q.answer = r.answer; q.explanation = r.explanation; }
      setQuestions([...questions]);
      setRevealed(r => ({ ...r, [id]: true }));
    } catch {
      setRevealed(r => ({ ...r, [id]: true }));
    }
  }

  return (
    <div className="grid">
      {/* Header */}
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a0533,#1e3a6e)' }}>
        <div>
          <span className="kicker">CHALLENGES & INNOVATION</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>⚡ Innovation Challenge Bank</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>
            {questions.length} unique challenges across Brain Teasers, Tinkering, Logical & Computational Thinking.
            Click "Reveal Answer" after you attempt each question.
          </p>
        </div>
      </div>

      {/* Type tabs */}
      <div className="row wrap" style={{ gap: 10 }}>
        {Object.entries(QTYPE_META).map(([k, v]) => (
          <button key={k}
            onClick={() => setActiveTab(k)}
            style={{
              padding: '10px 18px', borderRadius: 8, border: `2px solid ${activeTab === k ? v.color : 'var(--border)'}`,
              background: activeTab === k ? `${v.color}22` : 'var(--card)',
              color: activeTab === k ? v.color : 'var(--text)',
              cursor: 'pointer', fontWeight: activeTab === k ? 700 : 400,
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 14
            }}>
            {v.icon} {v.label}
            <span className="tag" style={{ fontSize: 11 }}>{(byType[k] || []).length}</span>
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="row" style={{ gap: 8 }}>
        <span className="muted" style={{ fontSize: 13 }}>Filter:</span>
        {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className={`tag ${filter === d ? 'advanced' : ''}`}
            style={{ cursor: 'pointer', padding: '4px 12px', background: filter === d ? diffColor[d] || 'var(--primary)' : 'var(--bg-2)', color: filter === d ? '#fff' : 'var(--text)', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: filter === d ? 700 : 400 }}>
            {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Section description */}
      {QTYPE_META[activeTab] && (
        <div style={{ padding: '10px 16px', background: `${QTYPE_META[activeTab].color}11`, borderLeft: `3px solid ${QTYPE_META[activeTab].color}`, borderRadius: 8, fontSize: 14 }}>
          {QTYPE_META[activeTab].icon} <b>{QTYPE_META[activeTab].label}:</b> {QTYPE_META[activeTab].desc}
        </div>
      )}

      {loading && <div className="spinner" />}

      {!loading && filtered.length === 0 && (
        <div className="card pad muted" style={{ textAlign: 'center', padding: 32 }}>
          No questions found for this filter. Try "All Levels" or a different challenge type.
        </div>
      )}

      {/* Questions */}
      {filtered.map((q, i) => (
        <div key={q.id} className="card pad" style={{ borderLeft: `4px solid ${diffColor[q.difficulty] || 'var(--border)'}` }}>
          <div className="row between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div className="row" style={{ gap: 8 }}>
              <span style={{ fontWeight: 700, color: QTYPE_META[q.qtype]?.color, fontSize: 14 }}>Q{i + 1}</span>
              <span className="tag" style={{ background: diffColor[q.difficulty], color: '#fff', fontSize: 11 }}>{q.difficulty}</span>
              <span className="muted" style={{ fontSize: 12 }}>{q.points || 10} XP</span>
            </div>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.7, margin: '0 0 12px', fontWeight: 500 }}>{q.prompt}</p>

          {/* MCQ options */}
          {Array.isArray(q.options) && q.options.length > 0 && (
            <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
              {q.options.map((opt: string, j: number) => (
                <div key={j} style={{
                  padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)',
                  background: revealed[q.id] && q.answer === opt ? 'rgba(34,197,94,0.12)' : 'var(--bg-2)',
                  borderColor: revealed[q.id] && q.answer === opt ? 'var(--green)' : 'var(--border)',
                  fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {revealed[q.id] && q.answer === opt && <span style={{ color: 'var(--green)' }}>✓</span>}
                  {String.fromCharCode(65 + j)}. {opt}
                </div>
              ))}
            </div>
          )}

          {/* Answer reveal */}
          {!revealed[q.id] ? (
            <button className="btn ghost sm" onClick={() => revealAnswer(q.id)}>
              👁 Reveal Answer
            </button>
          ) : (
            <div style={{ marginTop: 8 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.1)', borderRadius: 8, border: '1px solid var(--green)', marginBottom: 8 }}>
                <b style={{ color: 'var(--green)' }}>✓ Answer:</b>
                <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{q.answer}</p>
              </div>
              {q.explanation && (
                <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)', fontSize: 13, lineHeight: 1.6 }}>
                  <b style={{ color: 'var(--primary)' }}>💡 Explanation:</b>
                  <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{q.explanation}</p>
                </div>
              )}
              <button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => setRevealed(r => ({ ...r, [q.id]: false }))}>
                Hide answer
              </button>
            </div>
          )}
        </div>
      ))}
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
// AI MENTOR — varied prompts, never the same twice
// ============================================================

const MENTOR_PROMPT_POOLS = {
  concept: [
    'Explain how IR sensors work using a simple everyday analogy.',
    'What is Ohm\'s Law? Explain with a water pipe analogy so I can visualise it.',
    'How does a transistor work as a switch? Give me a real-world example.',
    'Explain the difference between AC and DC electricity with a practical example.',
    'What is PWM and how does it control motor speed? Use an analogy.',
    'How does an ultrasonic sensor measure distance? Explain step by step.',
    'What is the I2C communication protocol? How do multiple sensors share 2 wires?',
    'Explain how a capacitor works and where you would use one in a circuit.',
    'What is machine learning in simple terms? Give me a relatable everyday example.',
    'Explain what a gear ratio is and why it matters for robot wheels.',
    'How does Wi-Fi work? Explain how data travels from an IoT sensor to the internet.',
    'What is a logic gate and how is it different from a regular circuit?',
  ],
  tinkering: [
    'My line-follower robot keeps overshooting turns. Give me specific hints to fix it.',
    'My LED is not lighting up. Walk me through a step-by-step debugging process.',
    'I want to make my robot avoid obstacles AND remember where it has been. Where do I start?',
    'How can I reduce battery drain in my IoT project that uploads data every second?',
    'My 3D print keeps warping at the corners. What are three specific things I can try?',
    'I want to control a motor from my phone. What is the simplest way to do this?',
    'My ultrasonic sensor gives random readings. How do I filter out the noise?',
    'How do I connect two Arduinos together to share data wirelessly?',
    'I want to log sensor data to a spreadsheet automatically. How do I set this up?',
    'My motor driver is getting hot. What am I doing wrong and how do I fix it?',
    'I want to add a display to my project to show sensor readings. What should I use?',
    'How do I calibrate a soil moisture sensor for different types of soil?',
  ],
  logic: [
    'Give me a fresh logic puzzle about circuits that I haven\'t seen before. Then guide me through the solution.',
    'Here\'s a tricky one: a traffic light controller has 3 lights. Help me design the algorithm using only basic if-else logic.',
    'Create a brain teaser about a robot that must cross a maze with exactly these rules: [describe a rule]. Help me solve it.',
    'Give me a logical reasoning problem about gear trains and speed ratios.',
    'I need a tricky sequencing puzzle about assembling a robot. Pose the problem and guide me to solve it.',
    'Give me a real electronics debugging scenario (component layout, symptoms) and help me diagnose it systematically.',
    'Create a Sudoku-style logic problem using sensor values and circuit rules.',
    'Pose a problem about designing a sorting machine and help me think through the algorithm.',
    'Give me a logic puzzle about how data flows from sensor to cloud — and ask me to find the bottleneck.',
    'Create a "what happens next" puzzle with a circuit where one component fails.',
  ],
  summary: [
    'Give me a 5-point revision summary of how IR sensors work, with one memory tip per point.',
    'Summarise the key concepts of motor control (PWM, direction, speed) in bullet points with quick examples.',
    'Give me a revision card for "Basic Electronics" covering: voltage, current, resistance, Ohm\'s Law.',
    'Summarise the IoT project pipeline from sensor to cloud dashboard in 6 steps.',
    'Give me a cheat sheet for Arduino functions: digitalRead, digitalWrite, analogRead, analogWrite, delay, millis.',
    'What are the top 5 things every robotics student must know about DC motors?',
    'Summarise how 3D printing works (FDM) from design file to physical object in 8 steps.',
    'Give me a quick-reference summary of all 8 innovation tracks and what you build in each one.',
    'What are the 5 most common circuit mistakes beginners make — and how to avoid each?',
    'Give me a revision summary of machine learning types (supervised, unsupervised, reinforcement) with one example each.',
    'Summarise the difference between series and parallel circuits with diagrams I can visualise.',
    'Give me a memory-friendly summary of how Bluetooth and Wi-Fi differ for IoT projects.',
  ],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

const QUICK_CATEGORIES = [
  { i: '💡', t: 'Concept Explainer', key: 'concept' as const, desc: 'Get a clear, analogical explanation of any concept' },
  { i: '🛠', t: 'Tinkering Hint', key: 'tinkering' as const, desc: 'Stuck on a build? Get step-by-step hints' },
  { i: '🧠', t: 'Logic Challenge', key: 'logic' as const, desc: 'A fresh puzzle or reasoning challenge to sharpen your mind' },
  { i: '📖', t: 'Revision Summary', key: 'summary' as const, desc: 'Quick cheat-sheet style revision of any topic' },
];

function AIMentor() {
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi, I'm TinkerBot 🤖 — your 24×7 AI mentor! Every time you click one of the cards below, I'll give you a DIFFERENT question or challenge. Ask me anything, or hit a card to begin." },
  ]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastUsed, setLastUsed] = useState<Record<string, string>>({});
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

  function handleQuickCard(key: keyof typeof MENTOR_PROMPT_POOLS) {
    const pool = MENTOR_PROMPT_POOLS[key];
    // Pick a prompt different from the last one used for this category
    let prompt = pickRandom(pool);
    let attempts = 0;
    while (prompt === lastUsed[key] && attempts < 5) {
      prompt = pickRandom(pool);
      attempts++;
    }
    setLastUsed(u => ({ ...u, [key]: prompt }));
    send(prompt);
  }

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#0d1b3e,#1e3a6e)' }}>
        <div>
          <span className="kicker">AI MENTOR — 24×7</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>TinkerBot 🤖 — Your Personal Learning AI</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>
            Every card click gives you a <b style={{ color: '#93c5fd' }}>different</b> prompt, question, or challenge.
            Type anything, or tap a card to get a fresh ask from TinkerBot.
          </p>
        </div>
      </div>

      <div className="proj-grid lg">
        {QUICK_CATEGORIES.map(f => (
          <button key={f.key} className="card pad proj-card mentor-quick" onClick={() => handleQuickCard(f.key)} disabled={busy}
            style={{ textAlign: 'left', cursor: busy ? 'not-allowed' : 'pointer' }}>
            <span style={{ fontSize: 28 }}>{f.i}</span>
            <h3 style={{ margin: '8px 0 4px', fontSize: 14 }}>{f.t}</h3>
            <p className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>{f.desc}</p>
            <span className="tag" style={{ fontSize: 11, background: 'var(--primary)', color: '#fff' }}>
              {(MENTOR_PROMPT_POOLS[f.key]).length} unique prompts · new each tap
            </span>
          </button>
        ))}
      </div>

      <div className="card pad mentor-chat">
        <div className="mentor-body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`mentor-msg ${m.role}`} style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
          ))}
          {busy && <div className="mentor-msg bot mentor-typing"><span /><span /><span /></div>}
        </div>
        <form className="mentor-input" onSubmit={e => { e.preventDefault(); send(text); }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type any question — about circuits, code, robotics, 3D design, AI…" />
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
  const { user, patchUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiGet<any>('/student/profile').then(r => {
      setProfile(r.profile);
      setPhone(r.profile.phone || '');
    }).catch(() => {});
  }, []);

  async function savePhone() {
    setPhoneMsg(null); setPhoneSaving(true);
    try {
      await apiPut('/student/profile', { phone });
      setPhoneMsg({ k: 'ok', t: 'Phone number updated successfully.' });
      setProfile((p: any) => ({ ...p, phone }));
    } catch (e: any) {
      setPhoneMsg({ k: 'err', t: e.message || 'Failed to save' });
    } finally { setPhoneSaving(false); }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) { setAvatarMsg({ k: 'err', t: 'Image too large. Please choose a file under 2MB.' }); return; }
    setAvatarSaving(true); setAvatarMsg(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        await apiPost('/student/profile/avatar', { dataUrl });
        setProfile((p: any) => ({ ...p, avatar_url: dataUrl }));
        patchUser({ avatar_url: dataUrl });
        setAvatarMsg({ k: 'ok', t: 'Profile photo updated!' });
      } catch (err: any) {
        setAvatarMsg({ k: 'err', t: err.message || 'Upload failed' });
      } finally { setAvatarSaving(false); }
    };
    reader.readAsDataURL(file);
  }

  if (!profile) return <div className="spinner" />;
  const p = profile;

  const avatarSrc = p.avatar_url;
  const initials = (user?.full_name || 'S').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="grid">
      <div className="profile-banner">
        {/* Clickable avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {avatarSrc
            ? <img src={avatarSrc} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
            : <div className="profile-avatar">{initials}</div>}
          <button onClick={() => fileRef.current?.click()}
            style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', border: '2px solid #fff', background: 'var(--primary)', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Change photo">
            ✏️
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, color: '#fff' }}>{p.full_name}</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.85)' }}>{p.email} · {p.grade_name || 'No class assigned'}</p>
          {avatarSaving && <p style={{ color: '#93c5fd', fontSize: 13, margin: '4px 0 0' }}>Uploading photo…</p>}
          {avatarMsg && <p style={{ color: avatarMsg.k === 'ok' ? 'var(--green)' : 'var(--pink)', fontSize: 13, margin: '4px 0 0' }}>{avatarMsg.t}</p>}
        </div>
      </div>

      <p className="muted" style={{ fontSize: 13, margin: 0 }}>
        You can update your <b>phone number</b> and <b>profile photo</b>. All other details are managed by your teacher or school admin.
      </p>

      {/* Editable phone */}
      <div className="card pad">
        <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>📱 My Phone Number</h3>
        {phoneMsg && (
          <div className="card pad" style={{ borderColor: phoneMsg.k === 'ok' ? 'var(--green)' : 'var(--red)', fontSize: 13, marginBottom: 10 }}>
            {phoneMsg.t}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', maxWidth: 360 }}>
          <div className="field" style={{ flex: 1, margin: 0 }}>
            <label>Mobile number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <button className="btn" disabled={phoneSaving} onClick={savePhone} style={{ flexShrink: 0 }}>
            {phoneSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

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

      <MyClassesCard />

      <ChangePasswordCard />
    </div>
  );
}

// -------------------------------------------------------------------
// MyClassesCard — shows primary + extra classes the student can access
// -------------------------------------------------------------------
function MyClassesCard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [primaryId, setPrimaryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<any>('/student/my-classes')
      .then((r) => { setClasses(r.classes); setPrimaryId(r.primary_grade_id); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="card pad">
      <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>🏫 My Classes</h3>
      <p className="muted" style={{ fontSize: 13, marginTop: 0, marginBottom: 12 }}>
        Your primary class and any additional classes your admin has granted you access to.
        Contact your admin to request access to more classes.
      </p>

      {classes.length === 0 && (
        <div className="muted" style={{ fontSize: 13, padding: '10px 0' }}>No class assigned yet. Please contact your teacher.</div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {classes.map((c: any) => (
          <div
            key={c.grade_id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              borderRadius: 10, border: '1px solid var(--border)',
              background: c.grade_id === primaryId ? 'rgba(99,102,241,0.10)' : 'rgba(255,255,255,0.03)',
            }}
          >
            <span style={{ fontSize: 22 }}>🏫</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.grade_name}</div>
              {c.level_label && <div className="muted" style={{ fontSize: 12 }}>{c.level_label}</div>}
            </div>
            {c.grade_id === primaryId
              ? <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--primary)', color: '#fff', fontWeight: 700 }}>Primary</span>
              : <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', color: 'var(--muted)' }}>Extra access</span>
            }
          </div>
        ))}
      </div>

      <p className="muted" style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
        💡 Open the <b>My Courses</b> tab and use the <b>Switch class</b> bar to browse and learn from any class listed here — both your enrolled class and custom classes.
      </p>
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

