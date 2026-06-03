import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDel } from '../api';
import { useAuth } from '../auth';
import Layout from '../components/Layout';

export default function TeacherPortal() {
  const [tab, setTab] = useState('dashboard');
  return (
    <Layout
      title="Teacher Workspace"
      subtitle="Manage classes, assessments and your students from one place"
      active={tab}
      onTab={setTab}
      tabs={[
        { key: 'dashboard', label: 'Dashboard', icon: '📊', group: 'Overview' },
        { key: 'reports', label: 'Reports', icon: '📈', group: 'Overview' },
        { key: 'curriculum', label: 'Courses', icon: '📚', group: 'Teaching' },
        { key: 'lessons', label: 'Lesson Plans', icon: '📝', group: 'Teaching' },
        { key: 'tasks', label: 'Assignments', icon: '🔗', group: 'Teaching' },
        { key: 'students', label: 'Roster', icon: '🎒', group: 'Students' },
        { key: 'performance', label: 'Performance', icon: '🎯', group: 'Students' },
        { key: 'assistant', label: 'AI Assistant', icon: '🤖', group: 'Tools' },
        { key: 'resources', label: 'Resources', icon: '📁', group: 'Tools' },
      ]}
    >
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'reports' && <Reports />}
      {tab === 'curriculum' && <Curriculum />}
      {tab === 'lessons' && <LessonPlans />}
      {tab === 'tasks' && <Assignments />}
      {tab === 'students' && <Students />}
      {tab === 'performance' && <Performance />}
      {tab === 'assistant' && <AIAssistant />}
      {tab === 'resources' && <Resources />}
    </Layout>
  );
}

/* ---------- shared chart helpers ---------- */
function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const W = 520, H = 180, pad = 28;
  const max = Math.max(...data, 1);
  const step = (W - pad * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => [pad + i * step, H - pad - (v / max) * (H - pad * 2)]);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L${pts[pts.length - 1][0]},${H - pad} L${pts[0][0]},${H - pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="lc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(76,201,240,0.35)" /><stop offset="1" stopColor="rgba(76,201,240,0)" /></linearGradient></defs>
      {[0, 0.5, 1].map((g) => <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="var(--border)" strokeDasharray="3 4" />)}
      <path d={area} fill="url(#lc)" />
      <path d={path} fill="none" stroke="#4cc9f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#4cc9f0" stroke="#0b1020" strokeWidth="2" />)}
      {labels.map((l, i) => <text key={i} x={pad + i * step} y={H - 8} textAnchor="middle" fontSize="10" fill="#93a0c0">{l}</text>)}
    </svg>
  );
}
function Donut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0; const r = 54, c = 2 * Math.PI * r;
  return (
    <div className="row" style={{ gap: 18, flexWrap: 'wrap' }}>
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bg-2)" strokeWidth="18" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c; const dash = `${len} ${c - len}`; const off = -acc; acc += len;
          return <circle key={i} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={dash} strokeDashoffset={off} transform="rotate(-90 70 70)" />;
        })}
        <text x="70" y="74" textAnchor="middle" fontSize="20" fontWeight="800" fill="#e8edf7">{total}</text>
      </svg>
      <div className="grid" style={{ gap: 6 }}>
        {segments.map((s) => <div key={s.label} className="row" style={{ gap: 8, fontSize: 13 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />{s.label} <b style={{ marginLeft: 'auto' }}>{s.value}</b></div>)}
      </div>
    </div>
  );
}
function Kpi({ icon, n, l, c }: any) {
  return <div className="card kpi"><span className="kpi-ico" style={{ color: c }}>{icon}</span><div><div className="kpi-n">{n}</div><div className="muted" style={{ fontSize: 13 }}>{l}</div></div></div>;
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

/* ---------- DASHBOARD ---------- */
function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    apiGet('/teacher/overview').then(setData).catch(() => {});
    apiGet<{ students: any[] }>('/teacher/students').then((r) => setStudents(r.students)).catch(() => {});
  }, []);
  if (!data) return <div className="spinner" />;

  const grades = data.grades || [];
  const totalClasses = grades.length;
  const totalStudents = grades.reduce((s: number, g: any) => s + Number(g.students), 0);
  const totalChapters = grades.reduce((s: number, g: any) => s + Number(g.chapters), 0);
  const avgScores = students.map((s) => Number(s.avg_quiz) || 0).filter((x) => x > 0);
  const avgScore = avgScores.length ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length) : 0;
  const completedTotal = students.reduce((s, x) => s + (Number(x.completed) || 0), 0);

  const perf = {
    excellent: students.filter((s) => Number(s.avg_quiz) >= 80).length,
    good: students.filter((s) => Number(s.avg_quiz) >= 50 && Number(s.avg_quiz) < 80).length,
    needs: students.filter((s) => Number(s.avg_quiz) > 0 && Number(s.avg_quiz) < 50).length,
    notStarted: students.filter((s) => !Number(s.avg_quiz)).length,
  };

  return (
    <div className="grid dash">
      <div className="card pad dash-hero">
        <div>
          <span className="kicker">TEACHER WORKSPACE</span>
          <h2 style={{ margin: '10px 0 6px' }}>Hello, {user?.full_name} 👩‍🏫</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 520 }}>Manage your classes, build AI-powered assessments and track every learner's progress from one place.</p>
        </div>
        <div className="ring-wrap"><div className="kpi-ico" style={{ fontSize: 60 }}>🧑‍🏫</div></div>
      </div>

      <div className="kpi-row">
        <Kpi icon="🏫" n={totalClasses} l="Total Classes" c="var(--primary-2)" />
        <Kpi icon="🎒" n={totalStudents} l="Total Students" c="var(--green)" />
        <Kpi icon="📚" n={totalChapters} l="Chapters" c="var(--purple)" />
        <Kpi icon="📈" n={`${avgScore}%`} l="Average Score" c="var(--yellow)" />
      </div>

      <div className="dash-cols">
        <div className="grid" style={{ gap: 16 }}>
          <Panel title="Class Overview" icon="📊" sub="Quiz activity across the term (illustrative trend)">
            <LineChart data={[8, 14, 11, 19, 16, 24, 21]} labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']} />
          </Panel>

          <Panel title="My Classes" icon="🏫">
            <div className="grid" style={{ gap: 10 }}>
              {grades.map((g: any) => (
                <div key={g.id} className="track-row">
                  <span className="track-ico" style={{ background: '#1f2a49' }}>🎓</span>
                  <div style={{ flex: 1 }}>
                    <div className="row between"><b>{g.name}</b><span className="muted" style={{ fontSize: 12 }}>{g.students} students</span></div>
                    <div className="muted" style={{ fontSize: 12 }}>{g.modules} modules · {g.chapters} chapters</div>
                  </div>
                </div>
              ))}
              {!grades.length && <div className="muted">No classes assigned yet.</div>}
            </div>
          </Panel>

          <Panel title="Recent Assignments" icon="📝" sub="Latest assessments shared with students">
            <table>
              <thead><tr><th>Assignment</th><th>Class</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {ASSIGNMENTS.map((a) => (
                  <tr key={a.t}><td>{a.t}</td><td>{grades[a.gi % Math.max(grades.length, 1)]?.name || '—'}</td><td><span className="pill">{a.type}</span></td><td><span className={`tag ${a.st === 'Active' ? 'beginner' : 'intermediate'}`}>{a.st}</span></td></tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <Panel title="Student Performance" icon="🎯" sub={`${completedTotal} chapters completed by your students`}>
            <Donut segments={[
              { label: 'Excellent (80%+)', value: perf.excellent, color: '#06d6a0' },
              { label: 'Good (50-79%)', value: perf.good, color: '#4cc9f0' },
              { label: 'Needs help (<50%)', value: perf.needs, color: '#f72585' },
              { label: 'Not started', value: perf.notStarted, color: '#3a4670' },
            ]} />
          </Panel>

          <Panel title="Upcoming Classes" icon="📅">
            <div className="grid" style={{ gap: 8 }}>
              {UPCOMING.map((u) => (
                <div key={u.t} className="atl-row">
                  <span className="atl-date">{u.time}</span>
                  <div style={{ flex: 1 }}><b>{u.t}</b><div className="muted" style={{ fontSize: 12 }}>{u.cls}</div></div>
                  <span className="tag">{u.mode}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="AI Teaching Assistant" icon="🤖" sub="Save hours every week">
            <div className="grid" style={{ gap: 8 }}>
              {AITOOLS.map((t) => (
                <div key={t.t} className="ai-feat"><span style={{ fontSize: 18 }}>{t.i}</span><div><b>{t.t}</b><div className="muted" style={{ fontSize: 12 }}>{t.d}</div></div></div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

const ASSIGNMENTS = [
  { t: 'Circuit Basics Quiz', type: 'MCQ', st: 'Active', gi: 0 },
  { t: 'Build a Line-Follower', type: 'Tinkering', st: 'Active', gi: 1 },
  { t: 'Logic Puzzle Set 3', type: 'Brain Teaser', st: 'Closed', gi: 2 },
  { t: 'Sensors Worksheet', type: 'One-liner', st: 'Active', gi: 0 },
];
const UPCOMING = [
  { time: '09:00', t: 'Arduino Programming', cls: 'Class 7 · Robotics Lab', mode: 'Live' },
  { time: '11:30', t: 'Breadboarding Practical', cls: 'Class 6 · Electronics', mode: 'Lab' },
  { time: '14:00', t: '3D Modelling Intro', cls: 'Class 8 · Fabrication', mode: 'Live' },
];
const AITOOLS = [
  { i: '🧠', t: 'Auto Question Generator', d: 'Generate quizzes from any chapter instantly' },
  { i: '📋', t: 'Smart Grading', d: 'AI evaluates tinkering & brain-teaser answers' },
  { i: '💡', t: 'Lesson Insights', d: 'Spot tricky topics from student performance' },
];

const ASSIST_TOOLS: { key: string; i: string; t: string; d: string; placeholder: string; sample: string }[] = [
  { key: 'grading', i: '📋', t: 'Smart Grading', d: 'AI evaluates tinkering & brain-teaser answers', placeholder: 'Paste the question and the student\'s answer…', sample: 'Question: Why does a line-follower robot use two IR sensors?\nStudent answer: So it can see the black line on both sides and stay on track when it turns.' },
  { key: 'insights', i: '💡', t: 'Lesson Insights', d: 'Spot tricky topics from student performance', placeholder: 'Describe how your class performed (topics, scores, struggles)…', sample: 'Class 7 Robotics: sensor calibration avg 38%, circuits 52%, loops in code 55%. Many students confuse voltage and current.' },
  { key: 'rubric', i: '✍️', t: 'Rubric Builder', d: 'Draft fair rubrics for projects', placeholder: 'Describe the project or assignment to build a rubric for…', sample: 'A Class 8 project to build and present an IoT smart-dustbin prototype using an ultrasonic sensor and servo.' },
  { key: 'translate', i: '🌐', t: 'Translate & Simplify', d: 'Make content accessible to every learner', placeholder: 'Paste the content to simplify or translate…', sample: 'Explain how a microcontroller reads an analog sensor value and converts it to a digital number a program can use.' },
  { key: 'analytics', i: '📊', t: 'Class Analytics', d: 'Understand strengths and gaps at a glance', placeholder: 'Paste your class data or a short performance summary…', sample: 'Robotics builds: strong. AI/ML quiz avg 41%. Debugging tasks often incomplete. Top 5 students consistently above 85%.' },
  { key: 'lesson', i: '📚', t: 'Lesson Planner', d: 'Draft a ready-to-teach lesson outline', placeholder: 'Enter the topic and class to plan a lesson…', sample: 'Class 6 — Introduction to breadboarding and simple LED circuits, 45 minute session.' },
];

function QuestionGenerator() {
  const [grades, setGrades] = useState<any[]>([]);
  const [gid, setGid] = useState<number | ''>('');
  const [modules, setModules] = useState<any[]>([]);
  const [cid, setCid] = useState<number | ''>('');
  const [count, setCount] = useState(5);
  const [qtype, setQtype] = useState('mcq');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { apiGet('/content/grades').then((r: any) => setGrades(r.grades)).catch(() => {}); }, []);
  useEffect(() => {
    setCid(''); setModules([]);
    if (gid !== '') apiGet(`/content/grades/${gid}/modules`).then((r: any) => setModules(r.modules)).catch(() => {});
  }, [gid]);

  async function run(save: boolean) {
    if (cid === '') { setErr('Pick a chapter first.'); return; }
    setErr(''); setBusy(true); setSaved(false);
    try {
      const r = await apiPost<{ generated: any[]; saved: boolean }>('/teacher/ai/generate-questions', { chapter_id: Number(cid), count, qtype, save });
      setResult(r.generated); setSaved(r.saved);
    } catch (e: any) { setErr(e.message || 'Generation failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid">
      <div className="row" style={{ flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
        <div className="field" style={{ minWidth: 150 }}><label>Class</label>
          <select value={gid} onChange={e => setGid(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">— select —</option>
            {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ minWidth: 220 }}><label>Chapter</label>
          <select value={cid} onChange={e => setCid(e.target.value === '' ? '' : Number(e.target.value))} disabled={!modules.length}>
            <option value="">— select —</option>
            {modules.map(m => (
              <optgroup key={m.id} label={m.title}>
                {m.chapters.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="field" style={{ minWidth: 100 }}><label>Type</label>
          <select value={qtype} onChange={e => setQtype(e.target.value)}>
            <option value="mcq">MCQ</option>
            <option value="oneliner">One-liner</option>
            <option value="brain_teaser">Brain teaser</option>
            <option value="tinkering">Tinkering</option>
            <option value="computational">Computational</option>
            <option value="logical">Logical</option>
          </select>
        </div>
        <div className="field" style={{ minWidth: 80 }}><label>Count</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))}>
            {[3, 5, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button className="btn" onClick={() => run(false)} disabled={busy}>{busy ? 'Generating…' : 'Generate'}</button>
        <button className="btn ghost" onClick={() => run(true)} disabled={busy || cid === ''}>Generate & Save</button>
      </div>
      {err && <div className="err">{err}</div>}
      {saved && <div className="card pad" style={{ borderColor: 'var(--green)' }}>✅ Questions saved to the chapter's question bank.</div>}
      {result && (
        <div className="card pad">
          <h3 style={{ marginTop: 0 }}>Generated questions ({result.length})</h3>
          <ol style={{ paddingLeft: 18, margin: 0, display: 'grid', gap: 14 }}>
            {result.map((q, i) => (
              <li key={i}>
                <div style={{ fontWeight: 600 }}>{q.prompt}</div>
                {Array.isArray(q.options) && q.options.length > 0 && (
                  <ul style={{ margin: '4px 0' }}>{q.options.map((o: string, j: number) => <li key={j}>{o}</li>)}</ul>
                )}
                <div className="muted" style={{ fontSize: 13 }}><b>Answer:</b> {q.answer} {q.explanation ? `— ${q.explanation}` : ''}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function AssistTool({ tool }: { tool: typeof ASSIST_TOOLS[number] }) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');

  async function run() {
    if (!input.trim()) { setErr('Enter some details first.'); return; }
    setErr(''); setBusy(true); setOut('');
    try {
      const r = await apiPost<{ content: string }>('/teacher/ai/assist', { tool: tool.key, input });
      setOut(r.content);
    } catch (e: any) { setErr(e.message || 'Request failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid">
      <div className="field">
        <label>{tool.t} input</label>
        <textarea rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder={tool.placeholder} />
      </div>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn" onClick={run} disabled={busy}>{busy ? 'Working…' : `Run ${tool.t}`}</button>
        <button className="btn ghost" onClick={() => setInput(tool.sample)} disabled={busy}>Use sample</button>
      </div>
      {err && <div className="err">{err}</div>}
      {out && (
        <div className="card pad" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, fontSize: 14 }}>{out}</div>
      )}
    </div>
  );
}

function AIAssistant() {
  const [active, setActive] = useState<string>('questions');
  const tools = [{ key: 'questions', i: '🧠', t: 'Auto Question Generator', d: 'Generate quizzes from any chapter instantly' }, ...ASSIST_TOOLS];
  return (
    <div className="grid">
      <Panel title="AI Teaching Assistant" icon="🤖" sub="Your co-pilot for planning, assessment and grading — powered by your configured AI provider">
        <div className="proj-grid lg">
          {tools.map((t) => (
            <button
              key={t.key}
              className={`card pad proj-card mentor-quick ${active === t.key ? 'is-active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              <span style={{ fontSize: 30 }}>{t.i}</span>
              <h3 style={{ margin: '8px 0 4px' }}>{t.t}</h3>
              <p className="muted" style={{ fontSize: 13 }}>{t.d}</p>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={tools.find(t => t.key === active)?.t || 'Tool'} icon={tools.find(t => t.key === active)?.i || '🛠'} sub="All results use the LLM configured in Admin → AI Platform">
        {active === 'questions'
          ? <QuestionGenerator />
          : <AssistTool tool={ASSIST_TOOLS.find(t => t.key === active)!} />}
      </Panel>
    </div>
  );
}

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [gid, setGid] = useState<number | ''>('');
  const [err, setErr] = useState('');

  function load() { apiGet<{ students: any[] }>('/teacher/students').then((r) => setStudents(r.students)).catch(() => {}); }
  useEffect(() => { load(); apiGet('/teacher/overview').then((r: any) => setGrades(r.grades)).catch(() => {}); }, []);

  async function add() {
    setErr('');
    try {
      const r = await apiPost<any>('/teacher/students', { full_name: name, email, grade_id: Number(gid) });
      setMsg(`Created ${name}. Default password: ${r.defaultPassword || '(set)'}`); setShow(false);
      setName(''); setEmail(''); setGid(''); load();
    } catch (e: any) { setErr(e.message); }
  }

  return (
    <div className="grid">
      <div className="row between"><h2 style={{ margin: 0 }}>My Students</h2><button className="btn" onClick={() => { setShow(true); setErr(''); }}>+ Add student</button></div>
      {msg && <div className="card pad" style={{ borderColor: 'var(--green)' }}>{msg}</div>}
      <div className="card pad">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Class</th><th>Completed</th><th>Avg quiz</th></tr></thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}><td>{s.full_name}</td><td>{s.email}</td><td>{s.grade}</td><td>{s.completed}</td><td>{s.avg_quiz}%</td></tr>
            ))}
            {students.length === 0 && <tr><td colSpan={5} className="muted">No students yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="card pad modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Add student</h3>
            {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
            <div className="field"><label>Full name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label>Class</label>
              <select value={gid} onChange={(e) => setGid(e.target.value === '' ? '' : Number(e.target.value))}>
                <option value="">— select —</option>
                {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="row between"><button className="btn ghost" onClick={() => setShow(false)}>Cancel</button><button className="btn" onClick={add}>Create</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Curriculum() {
  const [grades, setGrades] = useState<any[]>([]);
  const [gid, setGid] = useState<number | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => { apiGet('/content/grades').then((r: any) => { setGrades(r.grades); if (r.grades[0]) setGid(r.grades[0].id); }).catch(() => {}); }, []);
  useEffect(() => { if (gid) apiGet(`/content/grades/${gid}/modules`).then((r: any) => setModules(r.modules)).catch(() => {}); }, [gid]);

  if (editing) return <ChapterEditor chapterId={editing} onClose={() => { setEditing(null); if (gid) apiGet(`/content/grades/${gid}/modules`).then((r: any) => setModules(r.modules)); }} />;

  return (
    <div className="grid">
      <div className="row wrap">
        <h2 style={{ margin: 0 }}>Curriculum editor</h2>
        <select value={gid ?? ''} onChange={(e) => setGid(Number(e.target.value))} style={{ maxWidth: 200 }}>
          {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      {modules.map((m) => (
        <div key={m.id} className="card pad">
          <div className="row"><span style={{ fontSize: 24 }}>{m.icon}</span><h3 style={{ margin: 0 }}>{m.title}</h3></div>
          {m.chapters.map((c: any) => (
            <div key={c.id} className="chapter-row" onClick={() => setEditing(c.id)}>
              <div><b>{c.title}</b> {!c.is_published && <span className="tag" style={{ color: 'var(--pink)' }}>draft</span>}
                <div className="muted" style={{ fontSize: 13 }}>{c.summary}</div></div>
              <span className="btn ghost sm">Edit →</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ChapterEditor({ chapterId, onClose }: { chapterId: number; onClose: () => void }) {
  const [ch, setCh] = useState<any>(null);
  const [qs, setQs] = useState<any[]>([]);
  const [title, setTitle] = useState(''); const [summary, setSummary] = useState('');
  const [difficulty, setDifficulty] = useState('beginner'); const [published, setPublished] = useState(true);
  const [saved, setSaved] = useState('');
  const [genType, setGenType] = useState('mcq'); const [genCount, setGenCount] = useState(5);
  const [generated, setGenerated] = useState<any[]>([]); const [busy, setBusy] = useState(false);

  function loadQs() { apiGet<{ questions: any[] }>(`/content/chapters/${chapterId}/questions`).then((r) => setQs(r.questions)).catch(() => {}); }
  useEffect(() => {
    apiGet(`/content/chapters/${chapterId}`).then((r: any) => {
      setCh(r.chapter); setTitle(r.chapter.title); setSummary(r.chapter.summary || '');
      setDifficulty(r.chapter.difficulty); setPublished(r.chapter.is_published);
    }).catch(() => {});
    loadQs();
  }, [chapterId]);

  async function save() {
    await apiPut(`/teacher/chapters/${chapterId}`, { title, summary, difficulty, is_published: published });
    setSaved('Saved ✔'); setTimeout(() => setSaved(''), 2000);
  }
  async function generate() {
    setBusy(true);
    try {
      const r = await apiPost<{ generated: any[] }>('/teacher/ai/generate-questions', { chapter_id: chapterId, count: genCount, qtype: genType, save: false });
      setGenerated(r.generated);
    } finally { setBusy(false); }
  }
  async function saveGenerated() {
    await apiPost('/teacher/ai/generate-questions', { chapter_id: chapterId, count: generated.length, qtype: genType, save: true });
    setGenerated([]); loadQs();
  }
  async function delQ(id: number) { await apiDel(`/teacher/questions/${id}`); loadQs(); }

  if (!ch) return <div className="spinner" />;

  return (
    <div className="grid">
      <div className="row between">
        <button className="btn ghost sm" onClick={onClose}>← Back to curriculum</button>
        {saved && <span className="tag" style={{ color: 'var(--green)' }}>{saved}</span>}
      </div>
      <div className="card pad">
        <h3 style={{ marginTop: 0 }}>Edit chapter</h3>
        <div className="field"><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="field"><label>Summary</label><textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
        <div className="row wrap">
          <div style={{ flex: 1 }}><label className="muted" style={{ fontSize: 13 }}>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="beginner">beginner</option><option value="intermediate">intermediate</option><option value="advanced">advanced</option>
            </select></div>
          <label className="row" style={{ gap: 6, marginTop: 18 }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published
          </label>
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={save}>Save changes</button>
      </div>

      <div className="card pad">
        <h3 style={{ marginTop: 0 }}>🤖 AI Question Generator</h3>
        <div className="row wrap">
          <select value={genType} onChange={(e) => setGenType(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="mcq">MCQ</option><option value="oneliner">One-liner</option><option value="brain_teaser">Brain teaser</option>
            <option value="tinkering">Tinkering</option><option value="logical">Logical</option><option value="computational">Computational</option>
          </select>
          <input type="number" min={1} max={10} value={genCount} onChange={(e) => setGenCount(Number(e.target.value))} style={{ maxWidth: 90 }} />
          <button className="btn" onClick={generate} disabled={busy}>{busy ? 'Generating…' : 'Generate'}</button>
          {generated.length > 0 && <button className="btn green" onClick={saveGenerated}>Save all to chapter</button>}
        </div>
        {generated.map((g, i) => (
          <div key={i} className="callout concept" style={{ marginTop: 10 }}>
            <b>{g.prompt}</b>
            {g.options?.length > 0 && <div className="muted" style={{ fontSize: 13 }}>Options: {g.options.join(' · ')}</div>}
            <div className="muted" style={{ fontSize: 13 }}>Answer: {g.answer} — {g.explanation}</div>
          </div>
        ))}
      </div>

      <div className="card pad">
        <h3 style={{ marginTop: 0 }}>Question bank ({qs.length})</h3>
        {qs.map((q) => (
          <div key={q.id} className="row between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div><span className="pill">{q.qtype}</span> {q.prompt}
              {q.ai_generated && <span className="tag" style={{ marginLeft: 6 }}>AI</span>}</div>
            <button className="btn danger sm" onClick={() => delQ(q.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// NEW TEACHER TABS
// ============================================================

function Reports() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { apiGet<any>('/teacher/reports').then(setData).catch(() => {}); }, []);
  if (!data) return <div className="spinner" />;

  return (
    <div className="grid">
      <Panel title="Class Reports & Analytics" icon="📈" sub="Aggregated performance across your assigned grades">
        <table>
          <thead><tr><th>Class</th><th>Students</th><th>Active Learners</th><th>Completions</th><th>Avg Score</th></tr></thead>
          <tbody>
            {data.gradeStats.map((g: any) => (
              <tr key={g.grade}>
                <td><b>{g.grade}</b></td>
                <td>{g.students}</td>
                <td>{g.active_learners}</td>
                <td>{g.completions}</td>
                <td><span style={{ color: Number(g.avg_score) >= 70 ? 'var(--green)' : Number(g.avg_score) >= 40 ? 'var(--yellow)' : 'var(--pink)' }}>{g.avg_score}%</span></td>
              </tr>
            ))}
            {data.gradeStats.length === 0 && <tr><td colSpan={5} className="muted">No data yet.</td></tr>}
          </tbody>
        </table>
      </Panel>
      <Panel title="Top Students" icon="🏆">
        <table>
          <thead><tr><th>Rank</th><th>Student</th><th>Class</th><th>XP</th><th>Completed</th></tr></thead>
          <tbody>
            {data.topStudents.map((s: any, i: number) => (
              <tr key={s.full_name}>
                <td><b>#{i + 1}</b></td>
                <td>{s.full_name}</td>
                <td>{s.grade}</td>
                <td><span style={{ color: 'var(--yellow)' }}>⭐ {s.xp}</span></td>
                <td>{s.completed}</td>
              </tr>
            ))}
            {data.topStudents.length === 0 && <tr><td colSpan={5} className="muted">No student activity yet.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function LessonPlans() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ grade_id: 0, title: '', description: '', objectives: '', duration_minutes: 60, status: 'draft', notes: '' });
  const [err, setErr] = useState('');

  function load() { apiGet<any>('/teacher/lessons').then((r) => setLessons(r.lessons)).catch(() => {}); }
  useEffect(() => { load(); apiGet('/teacher/overview').then((r: any) => setGrades(r.grades)).catch(() => {}); }, []);

  function openAdd() { setEditing(null); setForm({ grade_id: grades[0]?.id || 0, title: '', description: '', objectives: '', duration_minutes: 60, status: 'draft', notes: '' }); setShow(true); }
  function openEdit(l: any) { setEditing(l); setForm({ grade_id: l.grade_id, title: l.title, description: l.description || '', objectives: l.objectives || '', duration_minutes: l.duration_minutes, status: l.status, notes: l.notes || '' }); setShow(true); }

  async function save() {
    setErr('');
    try {
      if (editing) await apiPut(`/teacher/lessons/${editing.id}`, form);
      else await apiPost('/teacher/lessons', form);
      setShow(false); load();
    } catch (e: any) { setErr(e.message); }
  }
  async function del(id: number) { if (!confirm('Delete?')) return; await apiDel(`/teacher/lessons/${id}`); load(); }

  return (
    <div className="grid">
      <div className="row between">
        <h2 style={{ margin: 0 }}>Lesson Plans</h2>
        <button className="btn" onClick={openAdd}>+ New Plan</button>
      </div>
      <div className="card pad">
        <table>
          <thead><tr><th>Title</th><th>Class</th><th>Duration</th><th>Status</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id}>
                <td><b>{l.title}</b><div className="muted" style={{ fontSize: 12 }}>{l.description}</div></td>
                <td>{l.grade_name}</td>
                <td>{l.duration_minutes}m</td>
                <td><span className={`tag ${l.status === 'published' ? 'beginner' : 'intermediate'}`}>{l.status}</span></td>
                <td className="muted" style={{ fontSize: 12 }}>{new Date(l.updated_at).toLocaleDateString()}</td>
                <td className="row" style={{ gap: 6 }}>
                  <button className="btn ghost sm" onClick={() => openEdit(l)}>Edit</button>
                  <button className="btn danger sm" onClick={() => del(l.id)}>Del</button>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && <tr><td colSpan={6} className="muted">No lesson plans yet. Create your first plan!</td></tr>}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h3 style={{ margin: '0 0 14px' }}>{editing ? 'Edit' : 'New'} Lesson Plan</h3>
            {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
            <div className="field"><label>Class</label>
              <select value={form.grade_id} onChange={e => setForm({ ...form, grade_id: Number(e.target.value) })}>
                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="field"><label>Description</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="field"><label>Learning Objectives</label><textarea rows={3} value={form.objectives} onChange={e => setForm({ ...form, objectives: e.target.value })} placeholder="1. Understand...&#10;2. Build...&#10;3. Demonstrate..." /></div>
            <div className="field"><label>Duration (minutes)</label><input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })} /></div>
            <div className="field"><label>Teacher Notes</label><textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="field"><label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
            <div className="row between" style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Assignments() {
  const [grades, setGrades] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [gid, setGid] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<any[]>([
    { id: 1, title: 'Circuit Basics Quiz', chapter: 'Basic Circuits', class: 'Class 6', due: '2025-07-20', type: 'MCQ', students: 18, submitted: 12 },
    { id: 2, title: 'Line Follower Build', chapter: 'Autonomous Robots', class: 'Class 7', due: '2025-07-25', type: 'Tinkering', students: 22, submitted: 8 },
  ]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', chapter_id: 0, qtype: 'mcq', count: 5, due_date: '' });

  useEffect(() => { apiGet('/teacher/overview').then((r: any) => { setGrades(r.grades); if (r.grades[0]) setGid(r.grades[0].id); }).catch(() => {}); }, []);
  useEffect(() => {
    if (gid) apiGet<any>(`/content/grades/${gid}/modules`).then(r => {
      setChapters(r.modules.flatMap((m: any) => m.chapters || []));
    }).catch(() => {});
  }, [gid]);

  async function create() {
    if (!form.title) return;
    setAssignments(a => [...a, { id: Date.now(), title: form.title, chapter: chapters.find(c => c.id === form.chapter_id)?.title || '—', class: grades.find(g => g.id === gid)?.name || '—', due: form.due_date, type: form.qtype.toUpperCase(), students: 0, submitted: 0 }]);
    setShow(false);
  }

  return (
    <div className="grid">
      <div className="row between">
        <h2 style={{ margin: 0 }}>Assignments</h2>
        <button className="btn" onClick={() => setShow(true)}>+ Create Assignment</button>
      </div>
      <div className="card pad">
        <table>
          <thead><tr><th>Title</th><th>Chapter</th><th>Class</th><th>Type</th><th>Due</th><th>Progress</th></tr></thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td><b>{a.title}</b></td>
                <td className="muted">{a.chapter}</td>
                <td>{a.class}</td>
                <td><span className="pill">{a.type}</span></td>
                <td>{a.due || '—'}</td>
                <td><span style={{ color: 'var(--green)' }}>{a.submitted}/{a.students}</span> submitted</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3 style={{ margin: '0 0 14px' }}>Create Assignment</h3>
            <div className="field"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="field"><label>Class</label>
              <select value={gid ?? ''} onChange={e => setGid(Number(e.target.value))}>
                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Chapter</label>
              <select value={form.chapter_id} onChange={e => setForm({ ...form, chapter_id: Number(e.target.value) })}>
                <option value={0}>— select —</option>
                {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="field"><label>Question Type</label>
              <select value={form.qtype} onChange={e => setForm({ ...form, qtype: e.target.value })}>
                <option value="mcq">MCQ</option><option value="oneliner">One-liner</option><option value="brain_teaser">Brain Teaser</option><option value="tinkering">Tinkering</option>
              </select>
            </div>
            <div className="field"><label>Due Date</label><input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></div>
            <div className="row between" style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn" onClick={create}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Performance() {
  const [students, setStudents] = useState<any[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => { apiGet<any>('/teacher/students').then(r => setStudents(r.students)).catch(() => {}); }, []);

  async function loadProgress(id: string) {
    setSel(id);
    const r = await apiGet<any>(`/teacher/students/${id}/progress`);
    setProgress(r.progress);
  }

  const selStudent = students.find(s => s.id === sel);

  return (
    <div className="grid">
      <Panel title="Student Performance" icon="🎯" sub="Select a student to drill into their chapter-level progress">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
          <div style={{ borderRight: '1px solid var(--border)', paddingRight: 16 }}>
            {students.map(s => (
              <div key={s.id} className={`track-row${sel === s.id ? ' active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => loadProgress(s.id)}>
                <span className="track-ico" style={{ background: '#1f2a49', fontSize: 16 }}>🎒</span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.full_name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{s.grade} · {s.completed} done · {s.avg_quiz}% avg</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {!sel && <div className="muted" style={{ padding: 20 }}>Select a student to view their progress.</div>}
            {sel && (
              <>
                <h3 style={{ margin: '0 0 12px' }}>{selStudent?.full_name} — Progress</h3>
                <table>
                  <thead><tr><th>Module</th><th>Chapter</th><th>Status</th><th>Best Score</th><th>Completed</th></tr></thead>
                  <tbody>
                    {progress.map((p: any) => (
                      <tr key={p.chapter_id}>
                        <td className="muted">{p.module}</td>
                        <td>{p.title}</td>
                        <td>{p.status ? <span className={`tag ${p.status === 'completed' ? 'beginner' : 'intermediate'}`}>{p.status}</span> : <span className="muted">—</span>}</td>
                        <td>{p.best_score ? <span style={{ color: Number(p.best_score) >= 70 ? 'var(--green)' : 'var(--yellow)' }}>{p.best_score}%</span> : '—'}</td>
                        <td className="muted" style={{ fontSize: 12 }}>{p.completed_at ? new Date(p.completed_at).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Resources() {
  const LINKS = [
    { i: '📘', t: 'ATL Tinkering Curriculum Guide', u: '#', tag: 'Official' },
    { i: '🤖', t: 'Arduino Reference Documentation', u: 'https://www.arduino.cc/reference/en/', tag: 'Electronics' },
    { i: '🧠', t: 'Scratch & MIT App Inventor', u: 'https://scratch.mit.edu', tag: 'Coding' },
    { i: '🔬', t: 'NITI Aayog ATL Learning Resources', u: 'https://aim.gov.in/atl.php', tag: 'ATL' },
    { i: '🎨', t: 'Tinkercad 3D Design (Free)', u: 'https://www.tinkercad.com', tag: '3D' },
    { i: '📊', t: 'Google Teachable Machine', u: 'https://teachablemachine.withgoogle.com', tag: 'AI' },
    { i: '🌐', t: 'Raspberry Pi Learning', u: 'https://www.raspberrypi.com/education/', tag: 'IoT' },
    { i: '🔋', t: 'Circuits.io Simulator', u: 'https://www.circuits.io', tag: 'Simulation' },
  ];
  return (
    <div className="grid">
      <Panel title="Teaching Resources" icon="📁" sub="Curated links, tools and references for ATL, Robotics & STEM educators">
        <div className="proj-grid lg">
          {LINKS.map(l => (
            <a key={l.t} href={l.u} target="_blank" rel="noreferrer" className="card pad proj-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 28 }}>{l.i}</span>
              <h3 style={{ margin: '8px 0 4px', fontSize: 14 }}>{l.t}</h3>
              <span className="pill">{l.tag}</span>
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}
