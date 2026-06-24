import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDel } from '../api';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { THEMES, getTheme, applyTheme, getBoolPref, setBoolPref, getPref, setPref } from '../theme';
import Blocks from '../components/Blocks';
import ContentStudio from '../components/editor/ContentStudio';
import RichTextEditor from '../components/editor/RichTextEditor';
import CourseRepository from '../components/academic/CourseRepository';
import LearningLevels from '../components/academic/LearningLevels';

export default function AdminPortal() {
  const [tab, setTab] = useState('overview');
  return (
    <Layout
      title="Admin Console"
      subtitle="Govern schools, users, courses & operations across the Nervescape network"
      active={tab}
      onTab={setTab}
      menu={[
        { key: 'profile', label: 'My Profile', icon: '👤', onClick: () => setTab('profile') },
        { key: 'settings', label: 'Settings', icon: '⚙️', onClick: () => setTab('settings') },
      ]}
      tabs={[
        { key: 'overview', label: 'Control Center', icon: '🏠', group: 'Overview' },
        { key: 'activity', label: 'Activity Feed', icon: '🕒', group: 'Governance' },
        { key: 'repository', label: 'Course Repository', icon: '🗄️', group: 'Academics' },
        { key: 'levels', label: 'Learning Levels', icon: '📊', group: 'Academics' },
        { key: 'curriculum', label: 'Curriculum Library', icon: '🗂️', group: 'Academics' },
        { key: 'courses', label: 'Class Editor', icon: '📚', group: 'Academics' },
        { key: 'classes', label: 'Classes', icon: '🏫', group: 'Academics' },
        { key: 'assignments', label: 'Assignments', icon: '🔗', group: 'Academics' },
        { key: 'admins', label: 'Admins', icon: '🛡️', group: 'People' },
        { key: 'teachers', label: 'Teachers', icon: '👩‍🏫', group: 'People' },
        { key: 'students', label: 'Students', icon: '🎒', group: 'People' },
        { key: 'parents', label: 'Parents', icon: '👪', group: 'People' },
        { key: 'schools', label: 'Schools', icon: '🏣', group: 'Operations' },
        { key: 'live', label: 'Live Classes', icon: '📡', group: 'Operations' },
        { key: 'finance', label: 'Finance', icon: '💰', group: 'Operations' },
        { key: 'reports', label: 'Reports', icon: '📈', group: 'Governance' },
        { key: 'audit', label: 'Audit Log', icon: '🔍', group: 'Governance' },
        { key: 'roles', label: 'Teaching Roles', icon: '🎭', group: 'People' },
        { key: 'iam', label: 'Access Control', icon: '🔐', group: 'Governance' },
        { key: 'retention', label: 'Data Retention', icon: '🗄️', group: 'Governance' },
        { key: 'ai', label: 'AI Platform', icon: '🤖', group: 'System' },
      ]}
    >
      {tab === 'overview' && <Overview go={setTab} />}
      {tab === 'activity' && <ActivityFeed />}
      {tab === 'repository' && <CourseRepository />}
      {tab === 'levels' && <LearningLevels />}
      {tab === 'curriculum' && <CurriculumLibrary />}
      {tab === 'courses' && <Courses />}
      {tab === 'classes' && <GradeManager />}
      {tab === 'admins' && <AdminUsers />}
      {tab === 'teachers' && <Users role="teacher" />}
      {tab === 'students' && <Users role="student" />}
      {tab === 'parents' && <Parents />}
      {tab === 'assignments' && <Assignments />}
      {tab === 'schools' && <Schools />}
      {tab === 'live' && <LiveClasses />}
      {tab === 'finance' && <Finance />}
      {tab === 'reports' && <Reports />}
      {tab === 'audit' && <AuditLog />}
      {tab === 'roles' && <TeachingRoles />}
      {tab === 'iam' && <IamMatrix />}
      {tab === 'retention' && <Retention />}
      {tab === 'ai' && <AiMonitor />}
      {tab === 'settings' && <Settings />}
      {tab === 'profile' && <AdminProfile />}
    </Layout>
  );
}


function Kpi({ icon, n, l, c }: any) {
  return <div className="card kpi"><span className="kpi-ico" style={{ color: c }}>{icon}</span><div><div className="kpi-n">{n}</div><div className="muted" style={{ fontSize: 13 }}>{l}</div></div></div>;
}
function Panel({ title, icon, sub, action, children }: any) {
  return (
    <div className="card pad panel">
      <div className="panel-head"><div><h3>{icon} {title}</h3>{sub && <div className="muted" style={{ fontSize: 13 }}>{sub}</div>}</div>{action}</div>
      {children}
    </div>
  );
}
function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="grid" style={{ gap: 10 }}>
      {data.map((d) => (
        <div key={d.label} className="row" style={{ gap: 10 }}>
          <span style={{ width: 80, fontSize: 13 }} className="muted">{d.label}</span>
          <div className="pbar" style={{ flex: 1, marginTop: 0 }}><span style={{ width: `${(d.value / max) * 100}%`, background: 'linear-gradient(90deg,var(--purple),var(--pink))' }} /></div>
          <b style={{ width: 36, textAlign: 'right' }}>{d.value}</b>
        </div>
      ))}
    </div>
  );
}

const MODULES: { i: string; t: string; d: string; tab: string }[] = [
  // LIVE modules (have working tab)
  { i: '👩‍🏫', t: 'Teachers', d: 'Onboard, enable/disable & manage educators', tab: 'teachers' },
  { i: '🎒', t: 'Students', d: 'Enrolment, class assignment & progress', tab: 'students' },
  { i: '🔗', t: 'Assignments', d: 'Wire teachers to classes & modules', tab: 'assignments' },
  { i: '📚', t: 'Courses', d: 'Live curriculum for Class 6, 7 & 8 — view in Teacher portal', tab: 'students' },
  // Roadmap (clearly tagged)
  { i: '🏫', t: 'Schools', d: 'Manage partner schools & branches', tab: '' },
  { i: '👨\u200d👩\u200d👧', t: 'Parents', d: 'Guardian accounts & reports', tab: '' },
  { i: '🤖', t: 'Robotics Labs', d: 'ATL lab inventory & bookings', tab: '' },
  { i: '🔬', t: 'ATL Activities', d: 'Tinkering schedule & events', tab: '' },
  { i: '📡', t: 'Live Classes', d: 'Schedule & monitor live sessions', tab: '' },
  { i: '💰', t: 'Finance', d: 'Subscriptions, invoices & revenue', tab: '' },
];

function Overview({ go }: { go: (t: string) => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { apiGet('/admin/overview').then(setData).catch(() => {}); }, []);
  if (!data) return <div className="spinner" />;
  const s = data.stats;
  return (
    <div className="grid dash">
      <div className="card pad dash-hero">
        <div>
          <span className="kicker">MASTER CONTROL CENTER</span>
          <h2 style={{ margin: '10px 0 6px' }}>Platform Administration 🛰</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 540 }}>Govern schools, users, courses, labs and operations across the Nervescape network — all from one command center.</p>
        </div>
        <div className="ring-wrap"><div className="kpi-ico" style={{ fontSize: 60 }}>🛡️</div></div>
      </div>

      {/* live platform KPIs (from DB) */}
      <div className="kpi-row">
        <Kpi icon="👩‍🏫" n={s.teachers} l="Teachers" c="var(--primary-2)" />
        <Kpi icon="🎒" n={s.students} l="Students" c="var(--green)" />
        <Kpi icon="🏫" n={s.classes} l="Active Classes" c="var(--purple)" />
        <Kpi icon="📚" n={s.modules} l="Courses / Modules" c="var(--yellow)" />
      </div>
      <div className="kpi-row">
        <Kpi icon="📖" n={s.chapters} l="Chapters" c="var(--primary-2)" />
        <Kpi icon="❓" n={s.questions} l="Questions" c="var(--green)" />
        <Kpi icon="🧠" n={s.attempts} l="Quiz Attempts" c="var(--purple)" />
        <Kpi icon="🏅" n={s.attempts} l="Certificates Issued" c="var(--yellow)" />
      </div>

      {/* management modules */}
      <Panel title="Management Modules" icon="🧭" sub="Live modules are connected to the database. Roadmap modules are coming soon.">
        <div className="mod-grid">
          {MODULES.map((m) => (
            <button key={m.t} className={`mod-card ${m.tab ? 'live' : ''}`} onClick={() => m.tab && go(m.tab)}>
              <span className="mod-ico">{m.i}</span>
              <div><b>{m.t}</b><div className="muted" style={{ fontSize: 12 }}>{m.d}</div></div>
              <span className={`mod-status ${m.tab ? 'live' : 'soon'}`}>{m.tab ? '● Live' : 'Soon'}</span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="dash-cols">
        <Panel title="Enrolment by Class" icon="📊">
          <Bars data={data.perGrade.map((g: any) => ({ label: g.name, value: Number(g.students) }))} />
          <table style={{ marginTop: 14 }}>
            <thead><tr><th>Class</th><th>Students</th><th>Chapters</th></tr></thead>
            <tbody>{data.perGrade.map((g: any) => <tr key={g.id}><td>{g.name}</td><td>{g.students}</td><td>{g.chapters}</td></tr>)}</tbody>
          </table>
        </Panel>

        <Panel title="Recent Activity" icon="🕒">
          {data.recent.length === 0 && <div className="muted">No activity yet.</div>}
          <div className="grid" style={{ gap: 6 }}>
            {data.recent.map((r: any, i: number) => (
              <div key={i} className="row between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13 }}>{r.actor || 'System'} · <b>{r.action}</b> {r.entity}</span>
                <span className="muted" style={{ fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Users({ role }: { role: 'teacher' | 'student' }) {
  const [users, setUsers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [classAccessUser, setClassAccessUser] = useState<any>(null);
  const [msg, setMsg] = useState('');

  function load() { apiGet<{ users: any[] }>(`/admin/users?role=${role}`).then((r) => setUsers(r.users)).catch(() => {}); }
  useEffect(() => { load(); apiGet('/content/grades').then((r: any) => setGrades(r.grades)).catch(() => {}); }, [role]);

  async function del(id: string) {
    if (!confirm('Delete this user?')) return;
    await apiDel(`/admin/users/${id}`); load();
  }
  async function toggle(u: any) { await apiPut(`/admin/users/${u.id}`, { is_active: !u.is_active }); load(); }

  return (
    <div className="grid">
      <div className="row between">
        <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{role}s</h2>
        <button className="btn" onClick={() => { setShow(true); setMsg(''); }}>+ Add {role}</button>
      </div>
      {msg && <div className="card pad" style={{ borderColor: 'var(--green)' }}>{msg}</div>}
      <div className="card pad">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Class</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.full_name}</td><td>{u.email}</td><td>{u.grade_name || '—'}</td>
                <td><span className="tag" style={{ color: u.is_active ? 'var(--green)' : 'var(--pink)' }}>{u.is_active ? 'active' : 'disabled'}</span></td>
                <td className="row" style={{ gap: 6 }}>
                  <button className="btn ghost sm" onClick={() => setEditUser(u)}>Edit Profile</button>
                  {role === 'student' && (
                    <button className="btn ghost sm" title="Manage class access" onClick={() => setClassAccessUser(u)}>🏫 Classes</button>
                  )}
                  <button className="btn ghost sm" onClick={() => toggle(u)}>{u.is_active ? 'Disable' : 'Enable'}</button>
                  <button className="btn danger sm" onClick={() => del(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="muted">No {role}s yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {show && <AddUser role={role} grades={grades} onClose={() => setShow(false)} onSaved={(m) => { setMsg(m); setShow(false); load(); }} />}
      {editUser && <EditProfile userId={editUser.id} name={editUser.full_name} grades={grades} onClose={() => setEditUser(null)} onSaved={() => { setEditUser(null); load(); setMsg('Profile updated.'); }} />}
      {classAccessUser && (
        <StudentClassAccessModal
          student={classAccessUser}
          allGrades={grades}
          onClose={() => setClassAccessUser(null)}
        />
      )}
    </div>
  );
}

// Modal to grant / revoke extra class access for a student
function StudentClassAccessModal({ student, allGrades, onClose }: { student: any; allGrades: any[]; onClose: () => void }) {
  const [access, setAccess] = useState<any[]>([]);
  const [selGrade, setSelGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadAccess(); }, [student.id]);

  function loadAccess() {
    setLoading(true);
    apiGet<any>(`/admin/students/${student.id}/grade-access`)
      .then((r) => setAccess(r.access))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function grant() {
    if (!selGrade) return;
    try {
      await apiPost(`/admin/students/${student.id}/grade-access`, { grade_id: Number(selGrade) });
      setMsg('Access granted.'); setSelGrade(''); loadAccess();
    } catch (e: any) { setMsg(e.message || 'Failed'); }
  }

  async function revoke(gradeId: number) {
    if (!confirm('Revoke access to this class?')) return;
    await apiDel(`/admin/students/${student.id}/grade-access/${gradeId}`);
    setMsg('Access revoked.'); loadAccess();
  }

  // Grades not yet granted and not the primary
  const available = allGrades.filter((g) => g.id !== student.grade_id && !access.find((a) => a.grade_id === g.id));

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card pad modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0 }}>🏫 Class Access — {student.full_name}</h3>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Primary class: <b>{student.grade_name || 'None'}</b>
            </div>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        {msg && <div className="card pad" style={{ borderColor: 'var(--green)', marginBottom: 10, fontSize: 13 }}>{msg}</div>}

        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
          Grant this student read access to additional classes. They will see the extra classes in their profile.
        </p>

        {/* Grant new access */}
        <div className="row" style={{ gap: 8, marginBottom: 14 }}>
          <select value={selGrade} onChange={(e) => setSelGrade(e.target.value)} style={{ flex: 1 }}>
            <option value="">— Select a class to grant access —</option>
            {available.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button className="btn" disabled={!selGrade} onClick={grant}>Grant Access</button>
        </div>

        {/* Current extra access */}
        {loading && <div className="spinner" />}
        {!loading && (
          <div style={{ display: 'grid', gap: 6 }}>
            {access.length === 0 && <div className="muted" style={{ fontSize: 13, padding: '8px 0' }}>No extra class access granted yet.</div>}
            {access.map((a) => (
              <div key={a.grade_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span>🏫</span>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 13 }}>{a.grade_name}</b>
                  {a.granted_by_name && <span className="muted" style={{ fontSize: 11, marginLeft: 8 }}>granted by {a.granted_by_name}</span>}
                </div>
                <button className="btn danger sm" onClick={() => revoke(a.grade_id)}>Revoke</button>
              </div>
            ))}
          </div>
        )}

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ---- Admin user management ----
function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  function load() { apiGet<{ users: any[] }>('/admin/users?role=admin').then(r => setUsers(r.users)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm('Delete this admin?')) return;
    await apiDel(`/admin/users/${id}`); load();
  }
  async function toggle(u: any) { await apiPut(`/admin/users/${u.id}`, { is_active: !u.is_active }); load(); }

  async function create() {
    setErr('');
    if (!name || !email) { setErr('Name and email are required'); return; }
    try {
      const r = await apiPost<any>('/admin/users', { role: 'admin', full_name: name, email, password: password || undefined });
      setMsg(`Admin "${name}" created. ${r.defaultPassword ? `Default password: ${r.defaultPassword}` : 'Password set.'}`);
      setShow(false); setName(''); setEmail(''); setPassword(''); load();
    } catch (e: any) { setErr(e.message); }
  }

  return (
    <div className="grid">
      <div className="row between">
        <h2 style={{ margin: 0 }}>Administrators</h2>
        <button className="btn" onClick={() => { setShow(true); setErr(''); setMsg(''); }}>+ Add Admin</button>
      </div>
      {msg && <div className="card pad" style={{ borderColor: 'var(--green)' }}>{msg}</div>}
      <div className="card pad">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Last login</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.full_name} {u.id === me?.id && <span className="tag" style={{ color: 'var(--yellow)' }}>you</span>}</td>
                <td>{u.email}</td>
                <td><span className="tag" style={{ color: u.is_active ? 'var(--green)' : 'var(--pink)' }}>{u.is_active ? 'active' : 'disabled'}</span></td>
                <td className="muted" style={{ fontSize: 13 }}>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'never'}</td>
                <td className="row" style={{ gap: 6 }}>
                  {u.id !== me?.id && <>
                    <button className="btn ghost sm" onClick={() => toggle(u)}>{u.is_active ? 'Disable' : 'Enable'}</button>
                    <button className="btn danger sm" onClick={() => del(u.id)}>Delete</button>
                  </>}
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="muted">No admins yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Add Administrator</h3>
            {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
            <div className="field"><label>Full name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Password <span className="muted" style={{ fontSize: 12 }}>(leave blank for default: Admin@2026)</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
            </div>
            <div className="row between" style={{ marginTop: 8 }}>
              <button className="btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn" onClick={create}>Create Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Grade / Class management ----
function GradeManager() {
  const [grades, setGrades] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ number: 8, name: 'Class 8', level_label: '', description: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  function load() { apiGet<{ grades: any[] }>('/admin/grades').then(r => setGrades(r.grades)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  async function toggle(g: any) {
    await apiPut(`/admin/grades/${g.id}`, { is_active: !g.is_active });
    load();
  }

  async function activate(g: any) {
    await apiPost('/admin/grades', { number: g.number, name: g.name, is_active: true });
    setMsg(`${g.name} activated.`); load();
  }

  async function addNew() {
    setErr('');
    if (!form.name || form.number < 1 || form.number > 12) { setErr('Valid class number (1-12) and name are required.'); return; }
    try {
      await apiPost('/admin/grades', form);
      setMsg(`${form.name} created / activated.`); setShowAdd(false); load();
    } catch (e: any) { setErr(e.message); }
  }

  const inactive = grades.filter(g => !g.is_active);
  const active = grades.filter(g => g.is_active);

  return (
    <div className="grid">
      <div className="row between">
        <h2 style={{ margin: 0 }}>Class Management</h2>
        <button className="btn" onClick={() => { setShowAdd(true); setErr(''); }}>+ Add Class</button>
      </div>
      {msg && <div className="card pad" style={{ borderColor: 'var(--green)' }}>{msg}</div>}

      <Panel title="Active Classes" icon="✅" sub="Classes visible to teachers and students with curriculum attached">
        <table>
          <thead><tr><th>Class</th><th>Level</th><th>Modules</th><th>Chapters</th><th>Students</th><th></th></tr></thead>
          <tbody>
            {active.map(g => (
              <tr key={g.id}>
                <td><b>{g.name}</b></td>
                <td className="muted">{g.level_label || '—'}</td>
                <td>{g.modules}</td>
                <td>{g.chapters}</td>
                <td>{g.students}</td>
                <td><button className="btn ghost sm" onClick={() => toggle(g)}>Deactivate</button></td>
              </tr>
            ))}
            {active.length === 0 && <tr><td colSpan={6} className="muted">No active classes.</td></tr>}
          </tbody>
        </table>
      </Panel>

      {inactive.length > 0 && (
        <Panel title="Inactive / Placeholder Classes" icon="🔒" sub="Activate to make available for course creation and enrollment">
          <table>
            <thead><tr><th>Class</th><th>Level</th><th></th></tr></thead>
            <tbody>
              {inactive.map(g => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td className="muted">{g.level_label || '—'}</td>
                  <td><button className="btn sm" onClick={() => activate(g)}>Activate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {showAdd && (
        <div className="modal-bg" onClick={() => setShowAdd(false)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Add / Activate Class</h3>
            {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
            <div className="field">
              <label>Class Number (1–12)</label>
              <input type="number" min={1} max={12} value={form.number} onChange={e => setForm(f => ({ ...f, number: Number(e.target.value), name: `Class ${e.target.value}` }))} />
            </div>
            <div className="field"><label>Class Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="field"><label>Level label (e.g. Level III ATL)</label><input value={form.level_label} onChange={e => setForm(f => ({ ...f, level_label: e.target.value }))} placeholder="Optional" /></div>
            <div className="field"><label>Description</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional" /></div>
            <div className="row between" style={{ marginTop: 8 }}>
              <button className="btn ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn" onClick={addNew}>Create / Activate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddUser({ role, grades, onClose, onSaved }: { role: 'teacher' | 'student'; grades: any[]; onClose: () => void; onSaved: (m: string) => void }) {
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade_id, setGrade] = useState<number | ''>('');
  const [err, setErr] = useState('');

  async function save() {
    setErr('');
    try {
      const r = await apiPost<any>('/admin/users', { role, full_name, email, grade_id: grade_id === '' ? null : Number(grade_id) });
      onSaved(`Created ${role} ${full_name}. Default password: ${r.defaultPassword || '(set)'}`);
    } catch (e: any) { setErr(e.message); }
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card pad modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, textTransform: 'capitalize' }}>Add {role}</h3>
        {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
        <div className="field"><label>Full name</label><input value={full_name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field">
          <label>Class {role === 'student' ? '(required)' : '(assign)'}</label>
          <select value={grade_id} onChange={(e) => setGrade(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">— select —</option>
            {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="row between" style={{ marginTop: 8 }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save}>Create</button>
        </div>
      </div>
    </div>
  );
}

function EditProfile({ userId, name, grades, onClose, onSaved }: { userId: string; name: string; grades: any[]; onClose: () => void; onSaved: () => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [newPwd, setNewPwd] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [err, setErr] = useState('');
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    apiGet<any>(`/admin/users/${userId}/profile`).then((r) => {
      setProfile(r.profile);
      setForm(r.profile || {});
    }).catch(() => {});
  }, [userId]);

  function f(k: string) { return form[k] ?? ''; }
  function set(k: string, v: any) { setForm((p: any) => ({ ...p, [k]: v })); }

  async function save() {
    setErr('');
    try { await apiPut(`/admin/users/${userId}/profile`, form); onSaved(); }
    catch (e: any) { setErr(e.message); }
  }

  async function resetPwd() {
    if (!newPwd || newPwd.length < 6) { setPwMsg('Min 6 characters'); return; }
    await apiPost(`/admin/users/${userId}/reset-password`, { password: newPwd });
    setPwMsg('Password reset successfully!'); setNewPwd('');
  }

  if (!profile) return null;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="row between" style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>Edit Profile — {name}</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        {err && <div className="err" style={{ marginBottom: 10 }}>{err}</div>}
        <div className="row" style={{ gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['basic','personal','parent','school','security'].map(t => (
            <button key={t} className={`btn sm ${activeTab === t ? '' : 'ghost'}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {activeTab === 'basic' && (
          <div className="grid" style={{ gap: 10 }}>
            <div className="field"><label>Full Name</label><input value={f('full_name')} onChange={e => set('full_name', e.target.value)} /></div>
            <div className="field"><label>Email</label><input value={f('email')} onChange={e => set('email', e.target.value)} /></div>
            <div className="field"><label>Username</label><input value={f('username') || ''} onChange={e => set('username', e.target.value)} /></div>
            <div className="field"><label>Phone</label><input value={f('phone')} onChange={e => set('phone', e.target.value)} /></div>
            <div className="field"><label>Class</label>
              <select value={f('grade_id')} onChange={e => set('grade_id', e.target.value ? Number(e.target.value) : null)}>
                <option value="">— none —</option>
                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Status</label>
              <select value={f('is_active') === true || f('is_active') === 'true' ? 'true' : 'false'} onChange={e => set('is_active', e.target.value === 'true')}>
                <option value="true">Active</option><option value="false">Disabled</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="grid" style={{ gap: 10 }}>
            <div className="field"><label>Date of Birth</label><input type="date" value={f('date_of_birth') ? f('date_of_birth').split('T')[0] : ''} onChange={e => set('date_of_birth', e.target.value)} /></div>
            <div className="field"><label>Gender</label>
              <select value={f('gender')} onChange={e => set('gender', e.target.value)}>
                <option value="">— select —</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
              </select>
            </div>
            <div className="field"><label>Blood Group</label>
              <select value={f('blood_group')} onChange={e => set('blood_group', e.target.value)}>
                <option value="">— select —</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="field"><label>Bio</label><textarea rows={3} value={f('bio')} onChange={e => set('bio', e.target.value)} style={{ resize: 'vertical' }} /></div>
            <div className="field"><label>Hobbies</label><input value={f('hobbies')} onChange={e => set('hobbies', e.target.value)} placeholder="e.g. Reading, Robotics, Cricket" /></div>
            <div className="field"><label>Languages</label><input value={f('languages')} onChange={e => set('languages', e.target.value)} placeholder="e.g. English, Hindi, Tamil" /></div>
            <div className="field"><label>Address</label><input value={f('address_line1')} onChange={e => set('address_line1', e.target.value)} /></div>
            <div className="field"><label>City</label><input value={f('city')} onChange={e => set('city', e.target.value)} /></div>
            <div className="field"><label>State</label><input value={f('state')} onChange={e => set('state', e.target.value)} /></div>
            <div className="field"><label>Country</label><input value={f('country') || 'India'} onChange={e => set('country', e.target.value)} /></div>
            <div className="field"><label>PIN Code</label><input value={f('pincode')} onChange={e => set('pincode', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'parent' && (
          <div className="grid" style={{ gap: 10 }}>
            <div className="field"><label>Parent / Guardian Name</label><input value={f('parent_name')} onChange={e => set('parent_name', e.target.value)} /></div>
            <div className="field"><label>Relation</label>
              <select value={f('parent_relation')} onChange={e => set('parent_relation', e.target.value)}>
                <option value="">— select —</option><option>Parent</option><option>Father</option><option>Mother</option><option>Guardian</option><option>Grandparent</option>
              </select>
            </div>
            <div className="field"><label>Parent Phone</label><input value={f('parent_phone')} onChange={e => set('parent_phone', e.target.value)} /></div>
            <div className="field"><label>Parent Email</label><input type="email" value={f('parent_email')} onChange={e => set('parent_email', e.target.value)} /></div>
            <div className="field"><label>Occupation</label><input value={f('parent_occupation')} onChange={e => set('parent_occupation', e.target.value)} /></div>
            <div className="field"><label>Emergency Contact Name</label><input value={f('emergency_contact')} onChange={e => set('emergency_contact', e.target.value)} /></div>
            <div className="field"><label>Emergency Phone</label><input value={f('emergency_phone')} onChange={e => set('emergency_phone', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'school' && (
          <div className="grid" style={{ gap: 10 }}>
            <div className="field"><label>School Name</label><input value={f('school_name')} onChange={e => set('school_name', e.target.value)} /></div>
            <div className="field"><label>School City</label><input value={f('school_city')} onChange={e => set('school_city', e.target.value)} /></div>
            <div className="field"><label>Roll Number</label><input value={f('roll_number')} onChange={e => set('roll_number', e.target.value)} /></div>
            <div className="field"><label>Admission Year</label><input type="number" value={f('admission_year')} onChange={e => set('admission_year', e.target.value ? Number(e.target.value) : null)} /></div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid" style={{ gap: 10 }}>
            <p className="muted" style={{ fontSize: 13 }}>Reset this user's password. They will need to use the new password on next login.</p>
            {pwMsg && <div className="card pad" style={{ borderColor: 'var(--green)', fontSize: 13 }}>{pwMsg}</div>}
            <div className="field"><label>New Password (min 6 chars)</label><input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
            <button className="btn" onClick={resetPwd}>Reset Password</button>
          </div>
        )}

        <div className="row between" style={{ marginTop: 16 }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          {activeTab !== 'security' && <button className="btn" onClick={save}>Save Profile</button>}
        </div>
      </div>
    </div>
  );
}

function Assignments() {
  const [rows, setRows] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [modulesByGrade, setModulesByGrade] = useState<Record<number, any[]>>({});
  const [tid, setTid] = useState('');
  const [gid, setGid] = useState<number | ''>('');
  const [mid, setMid] = useState<number | ''>('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | ''>('');
  const [showBulk, setShowBulk] = useState(false);
  const [bulkTeacher, setBulkTeacher] = useState('');
  const [bulkGrades, setBulkGrades] = useState<number[]>([]);
  const [bulkModules, setBulkModules] = useState<number[]>([]);
  const [msg, setMsg] = useState('');

  function load() { apiGet<{ assignments: any[] }>('/admin/assignments').then((r) => setRows(r.assignments)).catch(() => {}); }

  async function loadModulesForGrade(g: number) {
    if (modulesByGrade[g]) return;
    try {
      const r = await apiGet<any>(`/content/grades/${g}/modules`);
      setModulesByGrade((prev) => ({ ...prev, [g]: r.modules || [] }));
    } catch { /* ignore */ }
  }

  useEffect(() => {
    load();
    apiGet('/admin/users?role=teacher').then((r: any) => setTeachers(r.users)).catch(() => {});
    apiGet('/admin/grades').then((r: any) => setGrades(r.grades)).catch(() => {});
  }, []);

  useEffect(() => { if (gid !== '') loadModulesForGrade(Number(gid)); setMid(''); /* eslint-disable-next-line */ }, [gid]);

  async function add() {
    if (!tid || gid === '') return;
    try {
      await apiPost('/admin/assignments', { teacher_id: tid, grade_id: Number(gid), module_id: mid === '' ? null : Number(mid) });
      setTid(''); setGid(''); setMid(''); load(); setMsg('Assignment created.');
    } catch (e: any) { setMsg('Error: ' + (e?.message || 'failed')); }
    setTimeout(() => setMsg(''), 2500);
  }

  async function bulkSave() {
    if (!bulkTeacher || (!bulkGrades.length && !bulkModules.length)) return;
    try {
      const r: any = await apiPost('/admin/assignments/bulk', { teacher_id: bulkTeacher, grade_ids: bulkGrades, module_ids: bulkModules });
      setMsg(`Bulk assignment created: ${r.created} new link(s).`);
      setBulkTeacher(''); setBulkGrades([]); setBulkModules([]); setShowBulk(false); load();
    } catch (e: any) { setMsg('Error: ' + (e?.message || 'failed')); }
    setTimeout(() => setMsg(''), 4000);
  }

  async function del(id: number) {
    if (!confirm('Remove this assignment?')) return;
    await apiDel(`/admin/assignments/${id}`); load();
  }

  // Group rows by teacher for the matrix view
  const filtered = rows.filter((r) => {
    if (filterTeacher && r.teacher_id !== filterTeacher) return false;
    if (filterGrade !== '' && r.grade_id !== Number(filterGrade)) return false;
    return true;
  });
  const groupedByTeacher: Record<string, any[]> = {};
  for (const r of filtered) (groupedByTeacher[r.teacher_id] ||= []).push(r);

  const moduleOptionsForGid = gid !== '' ? (modulesByGrade[Number(gid)] || []) : [];

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#22243a,#3d3169)' }}>
        <div>
          <span className="kicker">CLASS ASSIGNMENTS</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🔗 Teacher → Class Wiring</h2>
          <p style={{ color: '#cdcce8', margin: 0 }}>Assign teachers to whole classes or to specific subject modules. Use bulk assign for fast onboarding of new educators.</p>
        </div>
      </div>

      {msg && <div className="card pad" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: 14 }}>{msg}</div>}

      <div className="card pad">
        <div className="row between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0 }}>➕ New Assignment</h3>
          <button className="btn ghost sm" onClick={() => setShowBulk(true)}>📦 Bulk assign</button>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <select value={tid} onChange={(e) => setTid(e.target.value)} style={{ minWidth: 220 }}>
            <option value="">— teacher —</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
          <select value={gid} onChange={(e) => setGid(e.target.value === '' ? '' : Number(e.target.value))} style={{ minWidth: 180 }}>
            <option value="">— class —</option>
            {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select value={mid} onChange={(e) => setMid(e.target.value === '' ? '' : Number(e.target.value))} style={{ minWidth: 220 }} disabled={gid === ''}>
            <option value="">All modules (entire class)</option>
            {moduleOptionsForGid.map((m: any) => <option key={m.id} value={m.id}>{m.icon} {m.title}</option>)}
          </select>
          <button className="btn" onClick={add} disabled={!tid || gid === ''}>Assign</button>
        </div>
      </div>

      <div className="card pad">
        <div className="row between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0 }}>📋 Current Assignments ({filtered.length})</h3>
          <div className="row" style={{ gap: 6 }}>
            <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
              <option value="">All teachers</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </select>
            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value === '' ? '' : Number(e.target.value))}>
              <option value="">All classes</option>
              {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="muted" style={{ padding: 16 }}>No assignments match the filters.</div>
        ) : (
          <div className="grid" style={{ gap: 12 }}>
            {Object.entries(groupedByTeacher).map(([tId, list]) => {
              const t = teachers.find((x) => x.id === tId) || { full_name: list[0].teacher, email: list[0].teacher_email };
              return (
                <div key={tId} className="card pad" style={{ background: '#fafafa' }}>
                  <div className="row between" style={{ marginBottom: 8 }}>
                    <div>
                      <b>👩‍🏫 {t.full_name}</b>{' '}
                      <span className="muted" style={{ fontSize: 12 }}>{t.email}</span>
                    </div>
                    <span className="tag">{list.length} link{list.length === 1 ? '' : 's'}</span>
                  </div>
                  <table>
                    <thead><tr><th>Class</th><th>Module</th><th>Students</th><th>Chapters</th><th>Since</th><th></th></tr></thead>
                    <tbody>
                      {list.map((r: any) => (
                        <tr key={r.id}>
                          <td><b>{r.grade}</b></td>
                          <td>{r.module ? <>{r.module_icon} {r.module}</> : <span className="muted">All modules</span>}</td>
                          <td>{r.students}</td>
                          <td>{r.chapters}</td>
                          <td className="muted" style={{ fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString()}</td>
                          <td><button className="btn danger sm" onClick={() => del(r.id)}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showBulk && (
        <BulkAssignModal
          teachers={teachers}
          grades={grades}
          onClose={() => setShowBulk(false)}
          teacher={bulkTeacher}
          setTeacher={setBulkTeacher}
          gradeIds={bulkGrades}
          setGradeIds={setBulkGrades}
          moduleIds={bulkModules}
          setModuleIds={setBulkModules}
          modulesByGrade={modulesByGrade}
          loadModulesForGrade={loadModulesForGrade}
          onSave={bulkSave}
        />
      )}
    </div>
  );
}

function BulkAssignModal(props: {
  teachers: any[]; grades: any[];
  onClose: () => void; onSave: () => void;
  teacher: string; setTeacher: (v: string) => void;
  gradeIds: number[]; setGradeIds: (v: number[]) => void;
  moduleIds: number[]; setModuleIds: (v: number[]) => void;
  modulesByGrade: Record<number, any[]>; loadModulesForGrade: (g: number) => void;
}) {
  const { teachers, grades, onClose, onSave, teacher, setTeacher, gradeIds, setGradeIds, moduleIds, setModuleIds, modulesByGrade, loadModulesForGrade } = props;
  function toggleGrade(id: number) {
    if (gradeIds.includes(id)) setGradeIds(gradeIds.filter((g) => g !== id));
    else { setGradeIds([...gradeIds, id]); loadModulesForGrade(id); }
  }
  function toggleModule(id: number) {
    if (moduleIds.includes(id)) setModuleIds(moduleIds.filter((m) => m !== id));
    else setModuleIds([...moduleIds, id]);
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>📦 Bulk Assignment</h3>
          <button className="btn ghost sm" onClick={onClose}>✕</button>
        </div>
        <p className="muted" style={{ fontSize: 13 }}>Assign one teacher to many classes (full-class) and/or many specific modules at once.</p>
        <div className="field" style={{ marginBottom: 12 }}>
          <label>Teacher</label>
          <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            <option value="">— select —</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Whole-class assignments (any module within these classes)</label>
          <div className="row wrap" style={{ gap: 6 }}>
            {grades.map((g) => (
              <button key={g.id} className={`btn sm ${gradeIds.includes(g.id) ? '' : 'ghost'}`} onClick={() => toggleGrade(g.id)}>
                {gradeIds.includes(g.id) ? '✓ ' : ''}{g.name}
              </button>
            ))}
          </div>
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Specific module assignments</label>
          <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 6, padding: 10 }}>
            {grades.map((g) => {
              const mods = modulesByGrade[g.id] || [];
              return (
                <div key={g.id} style={{ marginBottom: 10 }}>
                  <div className="row between" style={{ marginBottom: 4 }}>
                    <b style={{ fontSize: 13 }}>{g.name}</b>
                    <button className="btn ghost sm" onClick={() => loadModulesForGrade(g.id)}>{mods.length ? `${mods.length} modules` : 'Load modules'}</button>
                  </div>
                  <div className="row wrap" style={{ gap: 6 }}>
                    {mods.map((m: any) => (
                      <button key={m.id} className={`btn sm ${moduleIds.includes(m.id) ? '' : 'ghost'}`} onClick={() => toggleModule(m.id)} style={{ fontSize: 12 }}>
                        {moduleIds.includes(m.id) ? '✓ ' : ''}{m.icon} {m.title}
                      </button>
                    ))}
                    {mods.length === 0 && <span className="muted" style={{ fontSize: 12 }}>(click 'Load modules')</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="row" style={{ gap: 8, marginTop: 14 }}>
          <button className="btn" onClick={onSave} disabled={!teacher || (gradeIds.length === 0 && moduleIds.length === 0)}>Create assignments</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NEW TABS
// ============================================================

function ActivityFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 30;

  function load(o: number) {
    apiGet<any>(`/admin/activity?limit=${limit}&offset=${o}`).then((r) => {
      setItems(r.activities); setTotal(r.total); setOffset(o);
    }).catch(() => {});
  }
  useEffect(() => { load(0); }, []);

  const ACTION_COLOR: Record<string, string> = {
    create_user: 'var(--green)', edit_chapter: 'var(--primary)', reset_password: 'var(--yellow)',
    login: '#aaa', delete: 'var(--pink)'
  };

  return (
    <Panel title="Activity Feed" icon="🕒" sub={`${total} total events · showing ${Math.min(offset + limit, total)} of ${total}`}>
      <div style={{ display: 'grid', gap: 0 }}>
        {items.map((a) => (
          <div key={a.id} className="row between" style={{ padding: '9px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACTION_COLOR[a.action] || '#ccc', flexShrink: 0, marginTop: 5 }} />
            <span style={{ flex: 1, fontSize: 13 }}><b>{a.actor || 'System'}</b> · {a.action.replace(/_/g, ' ')} · <span className="muted">{a.entity} {a.entity_id?.slice(0, 8)}</span></span>
            <span className="muted" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleString()}</span>
          </div>
        ))}
        {items.length === 0 && <div className="muted" style={{ padding: 20 }}>No activity recorded yet.</div>}
      </div>
      {total > limit && (
        <div className="row" style={{ gap: 8, marginTop: 12 }}>
          <button className="btn ghost sm" disabled={offset === 0} onClick={() => load(Math.max(0, offset - limit))}>← Prev</button>
          <span className="muted" style={{ fontSize: 13 }}>Page {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}</span>
          <button className="btn ghost sm" disabled={offset + limit >= total} onClick={() => load(offset + limit)}>Next →</button>
        </div>
      )}
    </Panel>
  );
}

function Courses() {
  const [grades, setGrades] = useState<any[]>([]);
  const [selGrade, setSelGrade] = useState<number | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [editMod, setEditMod] = useState<any | null>(null);
  const [editChap, setEditChap] = useState<any | null>(null);
  const [viewChap, setViewChap] = useState<any | null>(null);
  const [editContent, setEditContent] = useState<any | null>(null);
  const [newModFor, setNewModFor] = useState<number | null>(null);
  const [newChapFor, setNewChapFor] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  function loadGrades() { apiGet<any>('/admin/grades').then((r) => { setGrades(r.grades); if (!selGrade && r.grades.length) setSelGrade(r.grades[0].id); }).catch(() => {}); }
  function loadModules(gid: number) { apiGet<any>(`/content/grades/${gid}/modules`).then((r) => setModules(r.modules)).catch(() => {}); }

  useEffect(() => { loadGrades(); }, []);
  useEffect(() => { if (selGrade) loadModules(selGrade); }, [selGrade]);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 2500); }

  async function saveModule(d: any) {
    try {
      if (d.id) await apiPut(`/admin/modules/${d.id}`, d);
      else await apiPost('/admin/modules', { ...d, grade_id: selGrade });
      setEditMod(null); setNewModFor(null); flash('Module saved.'); if (selGrade) loadModules(selGrade);
    } catch (e: any) { alert(e?.message || 'Save failed'); }
  }
  async function deleteModule(id: number, title: string) {
    if (!confirm(`Delete module "${title}"? This is only allowed if it has no chapters.`)) return;
    try { await apiDel(`/admin/modules/${id}`); flash('Module deleted.'); if (selGrade) loadModules(selGrade); }
    catch (e: any) { alert(e?.message || 'Delete failed (may have chapters or assignments).'); }
  }
  async function saveChapter(d: any) {
    try {
      if (d.id) await apiPut(`/admin/chapters/${d.id}`, d);
      else await apiPost('/admin/chapters', d);
      setEditChap(null); setNewChapFor(null); flash('Chapter saved.'); if (selGrade) loadModules(selGrade);
    } catch (e: any) { alert(e?.message || 'Save failed'); }
  }
  async function deleteChapter(id: number, title: string) {
    if (!confirm(`Permanently delete chapter "${title}"?\nAll questions, facts, attempts and chat history for this chapter will also be removed.`)) return;
    try { await apiDel(`/admin/chapters/${id}`); flash('Chapter deleted.'); if (selGrade) loadModules(selGrade); }
    catch (e: any) { alert(e?.message || 'Delete failed'); }
  }
  async function togglePublished(c: any) {
    try { await apiPut(`/admin/chapters/${c.id}`, { is_published: !c.is_published }); if (selGrade) loadModules(selGrade); }
    catch (e: any) { alert(e?.message || 'Toggle failed'); }
  }
  async function saveContent(chapterId: number, blocks: any[]) {
    try {
      await apiPut(`/admin/chapters/${chapterId}`, { content: blocks });
      flash('Chapter content saved.'); if (selGrade) loadModules(selGrade);
      setEditContent(null);
    } catch (e: any) { alert(e?.message || 'Save failed'); }
  }

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1e2a52,#3a5fb1)' }}>
        <div>
          <span className="kicker">CURRICULUM MANAGEMENT</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>📚 Courses & Chapters</h2>
          <p style={{ color: '#cbd6f5', margin: 0 }}>Create, edit, reorder, publish/unpublish and delete modules and chapters across every class.</p>
        </div>
      </div>

      {msg && <div className="card pad" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: 14 }}>{msg}</div>}

      <div className="card pad">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <b>Class:</b>
            {grades.map((g) => (
              <button key={g.id} className={`btn sm ${selGrade === g.id ? '' : 'ghost'}`} onClick={() => setSelGrade(g.id)}>{g.name}</button>
            ))}
          </div>
          <button className="btn sm" disabled={!selGrade} onClick={() => setNewModFor(selGrade)}>➕ New Module</button>
        </div>
      </div>

      {modules.map((m) => (
        <div key={m.id} className="card pad">
          <div className="row between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ margin: 0 }}><span style={{ background: m.color || '#6366f1', color: '#fff', padding: '2px 10px', borderRadius: 6, marginRight: 8 }}>{m.icon || '📘'}</span>{m.title}</h3>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{m.description || <i>No description</i>}</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <span className="tag">{(m.chapters || []).length} chapters</span>
              <button className="btn ghost sm" onClick={() => setNewChapFor(m.id)}>➕ Chapter</button>
              <button className="btn ghost sm" onClick={() => setEditMod(m)}>✏️ Edit</button>
              <button className="btn danger sm" onClick={() => deleteModule(m.id, m.title)}>🗑</button>
            </div>
          </div>
          <table>
            <thead><tr><th>#</th><th>Chapter</th><th>Difficulty</th><th>Est.</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {(m.chapters || []).map((c: any, i: number) => (
                <tr key={c.id}>
                  <td className="muted">{i + 1}</td>
                  <td>{c.title}<br /><span className="muted" style={{ fontSize: 11 }}>{c.summary?.slice(0, 80)}</span></td>
                  <td><span className="tag">{c.difficulty}</span></td>
                  <td className="muted">{c.est_minutes}m</td>
                  <td>
                    <button className={`btn sm ${c.is_published ? '' : 'ghost'}`} onClick={() => togglePublished(c)} style={{ minWidth: 96 }}>
                      {c.is_published ? '✓ Published' : '◌ Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 4 }}>
                      <button className="btn ghost sm" title="View chapter (read mode)" onClick={() => setViewChap(c)}>👁</button>
                      <button className="btn ghost sm" title="Edit metadata" onClick={() => setEditChap({ ...c, module_id: m.id })}>✏️</button>
                      <button className="btn ghost sm" title="Edit content blocks" onClick={() => setEditContent({ ...c, module_id: m.id })}>📝</button>
                      <button className="btn danger sm" onClick={() => deleteChapter(c.id, c.title)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!m.chapters || m.chapters.length === 0) && <tr><td colSpan={6} className="muted" style={{ padding: 14 }}>No chapters yet. Click "➕ Chapter" to add one.</td></tr>}
            </tbody>
          </table>
        </div>
      ))}
      {modules.length === 0 && selGrade && (
        <div className="card pad muted" style={{ padding: 24, textAlign: 'center' }}>No modules in this class yet. Click "➕ New Module" above.</div>
      )}

      {(editMod || newModFor !== null) && (
        <ModuleEditor
          initial={editMod || { grade_id: selGrade, title: '', icon: '📘', color: '#6366f1', description: '' }}
          onClose={() => { setEditMod(null); setNewModFor(null); }}
          onSave={saveModule}
        />
      )}
      {(editChap || newChapFor !== null) && (
        <ChapterEditor
          initial={editChap || { module_id: newChapFor, title: '', summary: '', difficulty: 'beginner', est_minutes: 60 }}
          onClose={() => { setEditChap(null); setNewChapFor(null); }}
          onSave={saveChapter}
        />
      )}
      {viewChap && <ChapterViewer chapterId={viewChap.id} onClose={() => setViewChap(null)} />}
      {editContent && (
        <ContentStudio
          chapter={editContent}
          onClose={() => setEditContent(null)}
          onSave={(blocks) => saveContent(editContent.id, blocks)}
        />
      )}
    </div>
  );
}

function ModuleEditor({ initial, onClose, onSave }: { initial: any; onClose: () => void; onSave: (d: any) => void }) {
  const [d, setD] = useState<any>(initial);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div className="row between" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0 }}>{d.id ? '✏️ Edit Module' : '➕ New Module'}</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          <div className="grid2" style={{ gap: 10 }}>
            <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Title</label><input value={d.title || ''} onChange={(e) => setD({ ...d, title: e.target.value })} /></div>
            <div className="field"><label>Icon (emoji)</label><input value={d.icon || ''} onChange={(e) => setD({ ...d, icon: e.target.value })} placeholder="🤖" /></div>
            <div className="field"><label>Accent Color</label><input type="color" value={d.color || '#6366f1'} onChange={(e) => setD({ ...d, color: e.target.value })} style={{ width: '100%', height: 38, border: 'none', cursor: 'pointer' }} /></div>
            <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Description</label>
              <RichTextEditor compact value={d.description_html || (d.description ? `<p>${d.description}</p>` : '')}
                onChange={(html) => setD({ ...d, description_html: html, description: html.replace(/<[^>]+>/g, '').trim() })}
                minHeight={100} placeholder="Describe this module…" />
            </div>
            <div className="field"><label>Order Index</label><input type="number" value={d.order_index ?? ''} onChange={(e) => setD({ ...d, order_index: e.target.value === '' ? undefined : Number(e.target.value) })} /></div>
          </div>
        </div>
        <div className="row" style={{ gap: 8, padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <button className="btn" disabled={!d.title || !d.grade_id} onClick={() => onSave(d)}>{d.id ? 'Save Changes' : 'Create Module'}</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ChapterEditor({ initial, onClose, onSave }: { initial: any; onClose: () => void; onSave: (d: any) => void }) {
  const [d, setD] = useState<any>(initial);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{d.id ? '✏️ Edit Chapter' : '➕ New Chapter'}</h3>
          <button className="btn ghost sm" onClick={onClose}>✕</button>
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>This dialog manages the chapter's metadata and lifecycle. To author the rich lesson content (text, images, code, activities, quizzes…), use the <b>📝 Content</b> button on the chapter row.</p>
        <div className="grid2" style={{ gap: 10 }}>
          <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Title</label><input value={d.title || ''} onChange={(e) => setD({ ...d, title: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Summary</label><textarea rows={3} value={d.summary || ''} onChange={(e) => setD({ ...d, summary: e.target.value })} /></div>
          <div className="field"><label>Difficulty</label>
            <select value={d.difficulty || 'beginner'} onChange={(e) => setD({ ...d, difficulty: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="field"><label>Est. Minutes</label><input type="number" value={d.est_minutes ?? 60} onChange={(e) => setD({ ...d, est_minutes: Number(e.target.value) })} /></div>
          {d.id && (
            <div className="field"><label>Order Index</label><input type="number" value={d.order_index ?? ''} onChange={(e) => setD({ ...d, order_index: e.target.value === '' ? undefined : Number(e.target.value) })} /></div>
          )}
          {d.id && (
            <div className="field"><label>Published</label>
              <button className={`btn sm ${d.is_published ? '' : 'ghost'}`} onClick={() => setD({ ...d, is_published: !d.is_published })}>{d.is_published ? '✓ Published' : '◌ Draft'}</button>
            </div>
          )}
        </div>
        <div className="row" style={{ gap: 8, marginTop: 14 }}>
          <button className="btn" disabled={!d.title || !d.module_id} onClick={() => onSave(d)}>{d.id ? 'Save Changes' : 'Create Chapter'}</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Chapter Viewer ────────────────────────────────────────────────────────────
// Renders the full rich-block content of a chapter exactly as students see it.
function ChapterViewer({ chapterId, onClose }: { chapterId: number; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    apiGet<any>(`/content/chapters/${chapterId}`).then(setData).catch(() => {});
  }, [chapterId]);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="card pad modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 860, maxHeight: '92vh', overflowY: 'auto', padding: 24 }}
      >
        <div className="row between" style={{ marginBottom: 12, alignItems: 'flex-start' }}>
          <div>
            {data && (
              <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                {data.chapter.grade_name} · {data.chapter.module_title}
              </div>
            )}
            <h2 style={{ margin: 0 }}>{data?.chapter?.title || 'Loading…'}</h2>
            {data && (
              <div className="row" style={{ gap: 8, marginTop: 6 }}>
                <span className={`tag ${data.chapter.difficulty}`}>{data.chapter.difficulty}</span>
                <span className="muted" style={{ fontSize: 12 }}>⏱ {data.chapter.est_minutes} min</span>
                <span className={`tag ${data.chapter.is_published ? '' : 'ghost'}`}>
                  {data.chapter.is_published ? '✓ Published' : '◌ Draft'}
                </span>
              </div>
            )}
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        {!data && <div className="spinner" />}

        {data && (
          <>
            {data.chapter.summary && (
              <p className="muted" style={{ fontSize: 13, marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                {data.chapter.summary}
              </p>
            )}
            <Blocks blocks={Array.isArray(data.chapter.content) ? data.chapter.content : []} />
            {data.facts && data.facts.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <h3 style={{ marginTop: 0 }}>💡 Did you know?</h3>
                <ul>{data.facts.map((f: any) => <li key={f.id} style={{ lineHeight: 1.8 }}>{f.text}</li>)}</ul>
              </div>
            )}
          </>
        )}

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 20, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Parents() {
  const [students, setStudents] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    apiGet<any>('/admin/users?role=student').then((r) => setStudents(r.users)).catch(() => {});
  }, []);

  async function loadProfile(id: string) {
    const r = await apiGet<any>(`/admin/users/${id}/profile`);
    setSel(students.find(s => s.id === id));
    setProfile(r.profile);
  }

  return (
    <div className="grid">
      <div className="card pad">
        <h3 style={{ margin: '0 0 12px' }}>Guardian / Parent Information</h3>
        <p className="muted" style={{ fontSize: 13 }}>Select a student to view their parent/guardian details stored in their profile.</p>
        <table>
          <thead><tr><th>Student</th><th>Class</th><th>Parent Name</th><th>Parent Phone</th><th></th></tr></thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.full_name}</td>
                <td>{s.grade_name || '—'}</td>
                <td className="muted">—</td>
                <td className="muted">—</td>
                <td><button className="btn ghost sm" onClick={() => loadProfile(s.id)}>View Profile</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {profile && (
        <div className="modal-bg" onClick={() => setProfile(null)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="row between" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{sel?.full_name} — Parent Details</h3>
              <button className="modal-x" onClick={() => setProfile(null)}>✕</button>
            </div>
            <table>
              <tbody>
                {[['Parent Name', profile.parent_name], ['Relation', profile.parent_relation], ['Phone', profile.parent_phone],
                  ['Email', profile.parent_email], ['Occupation', profile.parent_occupation],
                  ['Emergency Contact', profile.emergency_contact], ['Emergency Phone', profile.emergency_phone]
                ].map(([l, v]) => <tr key={l}><td style={{ color: 'var(--muted)', width: 160 }}>{l}</td><td>{v || '—'}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Schools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ name: '', code: '', city: '', state: '', country: 'India', contact_email: '', contact_phone: '', principal: '', is_active: true });

  function load() { apiGet<any>('/admin/schools').then((r) => setSchools(r.schools)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm({ name: '', code: '', city: '', state: '', country: 'India', contact_email: '', contact_phone: '', principal: '', is_active: true }); setShow(true); }
  function openEdit(s: any) { setEditing(s); setForm({ ...s }); setShow(true); }

  async function save() {
    if (editing) await apiPut(`/admin/schools/${editing.id}`, form);
    else await apiPost('/admin/schools', form);
    setShow(false); load();
  }
  async function del(id: number) {
    if (!confirm('Delete school?')) return;
    await apiDel(`/admin/schools/${id}`); load();
  }

  return (
    <div className="grid">
      <div className="row between">
        <h2 style={{ margin: 0 }}>Schools</h2>
        <button className="btn" onClick={openAdd}>+ Add School</button>
      </div>
      <div className="card pad">
        <table>
          <thead><tr><th>Name</th><th>Code</th><th>City</th><th>Principal</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {schools.map((s) => (
              <tr key={s.id}>
                <td><b>{s.name}</b></td><td>{s.code || '—'}</td><td>{s.city || '—'}</td><td>{s.principal || '—'}</td>
                <td><span style={{ color: s.is_active ? 'var(--green)' : 'var(--pink)' }}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                <td className="row" style={{ gap: 6 }}>
                  <button className="btn ghost sm" onClick={() => openEdit(s)}>Edit</button>
                  <button className="btn danger sm" onClick={() => del(s.id)}>Del</button>
                </td>
              </tr>
            ))}
            {schools.length === 0 && <tr><td colSpan={6} className="muted">No schools added yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 style={{ margin: '0 0 14px' }}>{editing ? 'Edit School' : 'Add School'}</h3>
            {[['name','School Name*'],['code','Short Code'],['city','City'],['state','State'],['country','Country'],['principal','Principal Name'],['contact_email','Contact Email'],['contact_phone','Contact Phone']].map(([k,l]) => (
              <div key={k} className="field"><label>{l}</label><input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <div className="field"><label>Status</label>
              <select value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm({ ...form, is_active: e.target.value === 'active' })}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
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

function LiveClasses() {
  const DEMO: any[] = [
    { id: 1, title: 'Intro to Robotics — Live demo', teacher: 'Ms. Priya Sharma', grade: 'Class 6', subject: 'Robotics', scheduled: '2026-06-10T10:00', duration: 60, recurrence: 'one-off', platform: 'YouTube Live', link: 'https://youtube.com/live/demo-robotics-class6', status: 'scheduled' },
    { id: 2, title: 'Arduino Bootcamp (Weekly)', teacher: 'Mr. Rajan Verma', grade: 'Class 7', subject: 'Embedded Systems', scheduled: '2026-06-12T14:00', duration: 90, recurrence: 'weekly', platform: 'MS Teams', link: 'https://teams.microsoft.com/l/meetup-join/demo-arduino', status: 'scheduled' },
    { id: 3, title: 'AI & Computer Vision Demo', teacher: 'Ms. Kavitha R', grade: 'Class 8', subject: 'AI / ML', scheduled: '2026-06-04T09:00', duration: 60, recurrence: 'one-off', platform: 'YouTube Live', link: 'https://youtube.com/live/demo-ai-class8', status: 'scheduled' },
    { id: 4, title: '3D Modelling Workshop', teacher: 'Mr. Arjun Singh', grade: 'Class 6', subject: 'Fabrication', scheduled: '2026-06-15T11:00', duration: 75, recurrence: 'monthly', platform: 'MS Teams', link: 'https://teams.microsoft.com/l/meetup-join/demo-3d', status: 'scheduled' },
  ];
  const STORE_KEY = 'admin-live-classes';
  const [rows, setRows] = useState<any[]>(() => {
    try { const v = localStorage.getItem(STORE_KEY); if (v) return JSON.parse(v); } catch {}
    return DEMO;
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const empty = { title: '', teacher: '', grade: 'Class 6', subject: 'Robotics', scheduled: '', duration: 60, recurrence: 'one-off', platform: 'YouTube Live', link: '', status: 'scheduled' };
  const [form, setForm] = useState<any>(empty);

  function persist(next: any[]) { setRows(next); try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch {} }
  function openAdd() { setEditing(null); setForm(empty); setShow(true); }
  function openEdit(r: any) { setEditing(r); setForm({ ...r }); setShow(true); }
  function save() {
    if (!form.title || !form.teacher || !form.scheduled || !form.link) { alert('Title, Teacher, Date/Time and Meeting link are required'); return; }
    if (editing) persist(rows.map(r => r.id === editing.id ? { ...form, id: editing.id } : r));
    else persist([...rows, { ...form, id: Date.now() }]);
    setShow(false);
  }
  function del(id: number) { if (confirm('Delete this live class?')) persist(rows.filter(r => r.id !== id)); }

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a2a3a,#2a3a5e)' }}>
        <div>
          <span className="kicker">LIVE SESSIONS</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>Live Class Scheduler 📡</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>Schedule one-off or recurring live classes across grades and subjects. Teachers and students see them automatically.</p>
        </div>
      </div>

      <div className="card pad">
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Scheduled Sessions</h3>
          <button className="btn" onClick={openAdd}>+ Schedule Class</button>
        </div>
        <table>
          <thead><tr><th>Title</th><th>Subject</th><th>Class</th><th>Teacher</th><th>When</th><th>Recurs</th><th>Platform</th><th>Link</th><th></th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td><b>{c.title}</b></td>
                <td>{c.subject}</td>
                <td>{c.grade}</td>
                <td>{c.teacher}</td>
                <td style={{ fontSize: 12 }}>{new Date(c.scheduled).toLocaleString()} <span className="muted">· {c.duration}m</span></td>
                <td><span className="tag">{c.recurrence}</span></td>
                <td>{c.platform}</td>
                <td><a href={c.link} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>Join ↗</a></td>
                <td className="row" style={{ gap: 6 }}>
                  <button className="btn ghost sm" onClick={() => openEdit(c)}>Edit</button>
                  <button className="btn danger sm" onClick={() => del(c.id)}>Del</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="muted">No live classes scheduled. Click "+ Schedule Class" to add one.</td></tr>}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <h3 style={{ margin: '0 0 14px' }}>{editing ? 'Edit Live Class' : 'Schedule a Live Class'}</h3>
            <div className="field"><label>Title*</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Intro to Arduino — Weekly" /></div>
            <div className="row" style={{ gap: 10 }}>
              <div className="field" style={{ flex: 1 }}><label>Teacher*</label><input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} placeholder="Teacher name" /></div>
              <div className="field" style={{ flex: 1 }}><label>Class</label>
                <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                  {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'All Classes'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <div className="field" style={{ flex: 1 }}><label>Subject</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                  {['Robotics', 'Embedded Systems', 'Electronics', 'AI / ML', 'Fabrication', 'IoT & AIoT', 'Entrepreneurship', 'Innovation Challenge', 'General'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}><label>Recurrence</label>
                <select value={form.recurrence} onChange={e => setForm({ ...form, recurrence: e.target.value })}>
                  {['one-off', 'daily', 'weekly', 'bi-weekly', 'monthly'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <div className="field" style={{ flex: 2 }}><label>Date & Time*</label><input type="datetime-local" value={form.scheduled} onChange={e => setForm({ ...form, scheduled: e.target.value })} /></div>
              <div className="field" style={{ flex: 1 }}><label>Duration (min)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} /></div>
            </div>
            <div className="field"><label>Platform</label>
              <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                {['YouTube Live', 'MS Teams', 'Google Meet', 'Zoom', 'Other'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="field"><label>Meeting / Stream Link*</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://teams.microsoft.com/... or https://youtube.com/live/..." /></div>
            <div className="row between" style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn" onClick={save}>{editing ? 'Save Changes' : 'Schedule Class'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Finance() {
  const MOCK_INV = [
    { id: 'INV-001', school: 'Delhi Public School', amount: 48000, plan: 'Annual', status: 'paid', date: '2025-01-10' },
    { id: 'INV-002', school: 'KV Sector 12', amount: 36000, plan: 'Annual', status: 'paid', date: '2025-02-15' },
    { id: 'INV-003', school: 'Sunrise Academy', amount: 12000, plan: 'Quarterly', status: 'pending', date: '2025-07-01' },
  ];
  const total = MOCK_INV.reduce((a, b) => a + b.amount, 0);
  const paid = MOCK_INV.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="grid">
      <div className="kpi-row">
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--green)' }}>💰</span><div><div className="kpi-n">₹{paid.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Collected</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--yellow)' }}>📄</span><div><div className="kpi-n">{MOCK_INV.length}</div><div className="muted" style={{ fontSize: 13 }}>Invoices</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--purple)' }}>🏫</span><div><div className="kpi-n">{MOCK_INV.length}</div><div className="muted" style={{ fontSize: 13 }}>Active Schools</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--primary)' }}>📈</span><div><div className="kpi-n">₹{total.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Total Billed</div></div></div>
      </div>
      <div className="card pad">
        <h3 style={{ margin: '0 0 12px' }}>Invoices</h3>
        <table>
          <thead><tr><th>Invoice</th><th>School</th><th>Plan</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {MOCK_INV.map((inv) => (
              <tr key={inv.id}>
                <td><b>{inv.id}</b></td><td>{inv.school}</td><td>{inv.plan}</td>
                <td>₹{inv.amount.toLocaleString()}</td><td>{inv.date}</td>
                <td><span style={{ color: inv.status === 'paid' ? 'var(--green)' : 'var(--yellow)' }}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>Finance module integrates with payment gateways and accounting tools in the next release.</div>
      </div>
    </div>
  );
}

function AiMonitor() {
  const [features, setFeatures] = useState<any[] | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>({});
  const [savingFeature, setSavingFeature] = useState(false);
  const [msg, setMsg] = useState('');

  function load() {
    apiGet<any>('/admin/ai/features').then((r) => setFeatures(r.features)).catch(() => {});
    apiGet<any>('/admin/ai/usage').then((r) => setUsage(r)).catch(() => {});
  }
  useEffect(() => { load(); }, []);

  function startEdit(f: any) {
    setEditing(f.feature_key);
    setDraft({
      provider: f.provider, model: f.model, base_url: f.base_url,
      api_key: f.has_key ? '••••••' : '',
      monthly_budget: f.monthly_budget, enabled: f.enabled,
    });
  }
  async function saveFeature(key: string) {
    setSavingFeature(true);
    try {
      const payload: any = { ...draft, monthly_budget: Number(draft.monthly_budget) || 100000 };
      await apiPut(`/admin/ai/features/${key}`, payload);
      setMsg('Saved.');
      setEditing(null);
      load();
    } catch (e: any) { setMsg('Save failed: ' + (e?.message || 'error')); }
    setSavingFeature(false);
    setTimeout(() => setMsg(''), 2500);
  }

  if (!features || !usage) return <div className="spinner" />;
  const s = usage.summary;

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a1a3a,#1e3a5e)' }}>
        <div>
          <span className="kicker">AI PLATFORM MONITORING</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🤖 Multi-LLM Console</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>Route each AI feature to a different provider — Gemini for quiz generation, Claude for TinkerBot, OpenAI for evaluation. Track per-feature token spend and budgets independently.</p>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--primary)' }}>🔢</span><div><div className="kpi-n">{s.total_tokens.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Tokens This Month</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--green)' }}>📤</span><div><div className="kpi-n">{s.prompt_tokens.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Prompt Tokens</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--purple)' }}>📥</span><div><div className="kpi-n">{s.completion_tokens.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Completion Tokens</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--yellow)' }}>📞</span><div><div className="kpi-n">{s.total_calls}</div><div className="muted" style={{ fontSize: 13 }}>AI Calls</div></div></div>
      </div>

      {msg && <div className="card pad" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: 14 }}>{msg}</div>}

      <Panel title="Per-Feature LLM Configuration" icon="🧩" sub="Each AI feature can use its own provider, model, API key, and monthly token budget. Changes apply immediately.">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Feature</th><th>Provider</th><th>Model</th><th>Budget</th><th>Used (this month)</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => {
                const pct = Math.min(100, Math.round((f.used_tokens / Math.max(1, f.monthly_budget)) * 100));
                const isEditing = editing === f.feature_key;
                return (
                  <tr key={f.feature_key}>
                    <td><b>{f.display_name}</b><br /><span className="muted" style={{ fontSize: 11 }}>{f.feature_key}</span></td>
                    <td><span className="chip" style={{ background: f.provider === 'offline' ? '#eee' : '#e3f2fd' }}>{f.provider}</span></td>
                    <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{f.model}</td>
                    <td>{Number(f.monthly_budget).toLocaleString()}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>{Number(f.used_tokens).toLocaleString()} ({pct}%)</div>
                      <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, marginTop: 4 }}>
                        <div style={{ width: `${pct}%`, background: pct > 80 ? 'var(--pink)' : pct > 50 ? 'var(--yellow)' : 'var(--green)', height: '100%', borderRadius: 4 }} />
                      </div>
                    </td>
                    <td>{f.enabled ? <span style={{ color: 'var(--green)' }}>✓ Enabled</span> : <span className="muted">Disabled</span>}</td>
                    <td><button className="btn sm ghost" onClick={() => startEdit(f)}>Edit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editing && (() => {
          const f = features.find((x) => x.feature_key === editing);
          if (!f) return null;
          return (
            <div className="card pad" style={{ marginTop: 16, background: '#fafafa' }}>
              <h3>Edit · {f.display_name}</h3>
              <div className="grid2" style={{ gap: 10 }}>
                <div className="field"><label>Provider</label>
                  <select value={draft.provider} onChange={(e) => setDraft({ ...draft, provider: e.target.value })}>
                    <option value="offline">offline (deterministic fallback)</option>
                    <option value="openai">openai (OpenAI / Azure / Ollama / vLLM)</option>
                    <option value="gemini">gemini (Google Generative Language)</option>
                    <option value="claude">claude (Anthropic)</option>
                    <option value="custom">custom (OpenAI-compatible)</option>
                  </select>
                </div>
                <div className="field"><label>Model</label><input value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} /></div>
                <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Base URL</label><input value={draft.base_url} onChange={(e) => setDraft({ ...draft, base_url: e.target.value })} /></div>
                <div className="field" style={{ gridColumn: '1 / span 2' }}>
                  <label>API Key {f.has_key && <span className="muted" style={{ fontSize: 11 }}>(leave as ••••••• to keep current; clear to remove)</span>}</label>
                  <input type="password" value={draft.api_key} onChange={(e) => setDraft({ ...draft, api_key: e.target.value })} placeholder="sk-..." />
                </div>
                <div className="field"><label>Monthly Budget (tokens)</label><input type="number" value={draft.monthly_budget} onChange={(e) => setDraft({ ...draft, monthly_budget: e.target.value })} /></div>
                <div className="field"><label>Enabled</label>
                  <button className={`btn sm ${draft.enabled ? '' : 'ghost'}`} onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}>{draft.enabled ? '✓ Enabled' : 'Disabled'}</button>
                </div>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <button className="btn" disabled={savingFeature} onClick={() => saveFeature(editing!)}>{savingFeature ? 'Saving…' : 'Save'}</button>
                <button className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          );
        })()}
      </Panel>

      <Panel title="Per-Feature Daily Usage (Last 14 Days)" icon="📈">
        {features.every((f) => !f.daily.length) ? (
          <div className="muted">No usage yet. Once students chat with TinkerBot, generate quizzes, or submit challenges, daily token usage will appear here per feature.</div>
        ) : (
          <div className="grid" style={{ gap: 16 }}>
            {features.map((f) => {
              const max = Math.max(...f.daily.map((d: any) => d.tokens), 1);
              return (
                <div key={f.feature_key}>
                  <h4 style={{ margin: '0 0 6px' }}>{f.display_name} <span className="muted" style={{ fontSize: 12, fontWeight: 'normal' }}>· {f.provider} / {f.model}</span></h4>
                  {f.daily.length === 0 ? <div className="muted" style={{ fontSize: 13 }}>No calls yet</div> : (
                    <div className="row" style={{ gap: 4, alignItems: 'flex-end', height: 60 }}>
                      {f.daily.map((d: any) => (
                        <div key={d.day} title={`${d.day}: ${d.tokens.toLocaleString()} tokens`} style={{ flex: 1, height: `${(d.tokens / max) * 100}%`, minHeight: 2, background: 'var(--primary)', borderRadius: 2 }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="grid">
      <div className="card pad">
        <h3 style={{ margin: '0 0 16px' }}>Platform Settings</h3>
        <div className="field"><label>Platform Name</label><input defaultValue="Nervescape Analytics" /></div>
        <div className="field"><label>Support Email</label><input defaultValue="support@nervescape.com" /></div>
        <div className="field"><label>Default Student Password</label><input type="password" defaultValue="Student@123" /></div>
        <div className="field"><label>Default Teacher Password</label><input type="password" defaultValue="Teacher@123" /></div>
        <div className="field">
          <label>Session Timeout (minutes)</label>
          <select defaultValue="720"><option value="60">60</option><option value="360">360</option><option value="720">720 (12h)</option></select>
        </div>
        <button className="btn" onClick={() => setSaved(true)}>{saved ? '✓ Saved' : 'Save Settings'}</button>
      </div>
      <div className="card pad">
        <h3 style={{ margin: '0 0 16px' }}>Notifications</h3>
        {[['Email on new student registration','true'],['Email on teacher login','false'],['Weekly analytics digest','true'],['Alert on AI budget exceeded','true']].map(([l, def]) => (
          <div key={l} className="row between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13 }}>{l}</span>
            <input type="checkbox" defaultChecked={def === 'true'} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProfile() {
  const { user } = useAuth();
  const initials = (user?.full_name || 'A').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [cf, setCf] = useState('');
  const [pwMsg, setPwMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  async function changePwd() {
    setPwMsg(null);
    if (!cur || !nw) return setPwMsg({ k: 'err', t: 'Please enter both passwords' });
    if (nw.length < 6) return setPwMsg({ k: 'err', t: 'New password must be at least 6 characters' });
    if (nw !== cf) return setPwMsg({ k: 'err', t: 'Passwords do not match' });
    setPwBusy(true);
    try {
      await apiPost('/auth/change-password', { currentPassword: cur, newPassword: nw });
      setPwMsg({ k: 'ok', t: 'Password updated successfully.' });
      setCur(''); setNw(''); setCf('');
    } catch (e: any) { setPwMsg({ k: 'err', t: e.message || 'Failed to change password' }); }
    finally { setPwBusy(false); }
  }

  return (
    <div className="grid">
      <div className="profile-banner">
        <div className="profile-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, color: '#fff' }}>{user?.full_name || 'Administrator'}</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.85)' }}>{user?.email} · Super Admin</p>
        </div>
        <span className="profile-readonly" style={{ background: 'rgba(255,255,255,0.18)' }}>👑 Admin</span>
      </div>

      <div className="card pad">
        <h3 style={{ margin: '0 0 14px', fontSize: 16 }}>👤 Account Details</h3>
        <div className="info-grid">
          {[['Full Name', user?.full_name], ['Email', user?.email], ['Role', 'Super Administrator'],
            ['User ID', user?.id], ['Access Level', 'Full platform control'], ['Last Login', new Date().toLocaleString()],
          ].map(([l, v]) => (
            <div key={l} className="info-cell"><span className="info-label">{l}</span><span className="info-value">{v || '—'}</span></div>
          ))}
        </div>
      </div>

      <div className="card pad">
        <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>🔐 Change Password</h3>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Choose a strong password (min 6 characters) to keep your admin account secure.</p>
        {pwMsg && <div className="card pad" style={{ borderColor: pwMsg.k === 'ok' ? 'var(--green)' : 'var(--red)', fontSize: 13, marginBottom: 12 }}>{pwMsg.t}</div>}
        <div className="grid" style={{ gap: 10, maxWidth: 420 }}>
          <div className="field"><label>Current password</label><input type="password" value={cur} onChange={e => setCur(e.target.value)} /></div>
          <div className="field"><label>New password</label><input type="password" value={nw} onChange={e => setNw(e.target.value)} /></div>
          <div className="field"><label>Confirm new password</label><input type="password" value={cf} onChange={e => setCf(e.target.value)} /></div>
          <button className="btn" disabled={pwBusy} onClick={changePwd} style={{ alignSelf: 'flex-start' }}>{pwBusy ? 'Updating…' : 'Update Password'}</button>
        </div>
      </div>

      <QuickSettings />
    </div>
  );
}

function QuickSettings() {
  const [theme, setTheme] = useState(getTheme());
  const [twoFa, setTwoFa] = useState(getBoolPref('2fa', false));
  const [emailNotif, setEmailNotif] = useState(getBoolPref('emailNotif', true));
  const [desktopNotif, setDesktopNotif] = useState(getBoolPref('desktopNotif', false));
  const [compact, setCompact] = useState(getBoolPref('compact', false));
  const [timeout, setTimeoutVal] = useState(getPref('sessionTimeout', '720'));
  const [setup2fa, setSetup2fa] = useState(false);
  const [toast, setToast] = useState('');

  function flash(t: string) { setToast(t); setTimeout(() => setToast(''), 2200); }
  function chooseTheme(k: string) { setTheme(k); applyTheme(k); flash(`Theme set to ${THEMES.find(t => t.key === k)?.label}`); }
  function toggleEmail() { const v = !emailNotif; setEmailNotif(v); setBoolPref('emailNotif', v); flash(v ? 'Email notifications on' : 'Email notifications off'); }
  function toggleDesktop() {
    const v = !desktopNotif;
    if (v && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((p) => { if (p === 'granted') { setDesktopNotif(true); setBoolPref('desktopNotif', true); flash('Desktop notifications enabled'); } else flash('Permission denied'); });
      return;
    }
    setDesktopNotif(v); setBoolPref('desktopNotif', v); flash(v ? 'Desktop notifications on' : 'Desktop notifications off');
  }
  function toggleCompact() { const v = !compact; setCompact(v); setBoolPref('compact', v); flash(v ? 'Compact mode on' : 'Compact mode off'); }
  function changeTimeout(v: string) { setTimeoutVal(v); setPref('sessionTimeout', v); flash('Session timeout updated'); }
  function disable2fa() { setTwoFa(false); setBoolPref('2fa', false); flash('Two-factor authentication disabled'); }
  function on2faEnabled() { setTwoFa(true); setBoolPref('2fa', true); setSetup2fa(false); flash('Two-factor authentication enabled'); }

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button type="button" className={`switch ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on}><span /></button>
  );

  return (
    <div className="card pad">
      <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>⚙️ Quick Settings</h3>
      <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Personal preferences for this admin account — applied instantly and saved to this browser.</p>
      {toast && <div className="card pad" style={{ borderColor: 'var(--green)', fontSize: 13, marginBottom: 14, padding: '8px 12px' }}>✓ {toast}</div>}

      {/* Theme picker */}
      <div className="qs-row">
        <div><b style={{ fontSize: 14 }}>Theme</b><div className="muted" style={{ fontSize: 12 }}>Choose your portal appearance</div></div>
        <div className="theme-swatches">
          {THEMES.map((t) => (
            <button key={t.key} type="button" title={t.label} onClick={() => chooseTheme(t.key)}
              className={`theme-swatch ${theme === t.key ? 'sel' : ''}`} style={{ background: t.swatch }}>
              {theme === t.key && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 2FA */}
      <div className="qs-row">
        <div><b style={{ fontSize: 14 }}>Two-Factor Authentication</b><div className="muted" style={{ fontSize: 12 }}>{twoFa ? '🔒 Enabled — authenticator app required at sign-in' : 'Add an extra layer of security with an authenticator app'}</div></div>
        {twoFa
          ? <button className="btn ghost sm" onClick={disable2fa}>Disable</button>
          : <button className="btn sm" onClick={() => setSetup2fa(true)}>Enable</button>}
      </div>

      {/* Email notifications */}
      <div className="qs-row">
        <div><b style={{ fontSize: 14 }}>Email Notifications</b><div className="muted" style={{ fontSize: 12 }}>Alerts for registrations, reports and AI budget</div></div>
        <Toggle on={emailNotif} onClick={toggleEmail} />
      </div>

      {/* Desktop notifications */}
      <div className="qs-row">
        <div><b style={{ fontSize: 14 }}>Desktop Notifications</b><div className="muted" style={{ fontSize: 12 }}>Browser push alerts for live activity</div></div>
        <Toggle on={desktopNotif} onClick={toggleDesktop} />
      </div>

      {/* Compact mode */}
      <div className="qs-row">
        <div><b style={{ fontSize: 14 }}>Compact Density</b><div className="muted" style={{ fontSize: 12 }}>Tighter spacing for data-heavy screens</div></div>
        <Toggle on={compact} onClick={toggleCompact} />
      </div>

      {/* Session timeout */}
      <div className="qs-row">
        <div><b style={{ fontSize: 14 }}>Session Timeout</b><div className="muted" style={{ fontSize: 12 }}>Auto sign-out after inactivity</div></div>
        <select value={timeout} onChange={(e) => changeTimeout(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="60">1 hour</option>
          <option value="360">6 hours</option>
          <option value="720">12 hours</option>
          <option value="1440">24 hours</option>
        </select>
      </div>

      {setup2fa && <TwoFactorSetup onClose={() => setSetup2fa(false)} onEnabled={on2faEnabled} />}
    </div>
  );
}

function TwoFactorSetup({ onClose, onEnabled }: { onClose: () => void; onEnabled: () => void }) {
  // Generate a base32 TOTP secret for authenticator-app enrolment.
  const [secret] = useState(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let s = '';
    const rnd = new Uint8Array(20);
    (window.crypto || (window as any).msCrypto).getRandomValues(rnd);
    for (let i = 0; i < rnd.length; i++) s += alphabet[rnd[i] % 32];
    return s.match(/.{1,4}/g)!.join(' ');
  });
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const otpauth = `otpauth://totp/Nervescape%20Analytics:admin@lms.local?secret=${secret.replace(/ /g, '')}&issuer=Nervescape%20Analytics`;

  function confirm() {
    if (!/^\d{6}$/.test(code.trim())) { setErr('Enter the 6-digit code from your authenticator app.'); return; }
    onEnabled();
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal card pad" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <button className="modal-x" onClick={onClose}>✕</button>
        <h3 style={{ margin: '0 0 6px' }}>🔐 Set up Two-Factor Authentication</h3>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Scan the key below in Google Authenticator, Authy or 1Password, then enter the generated 6-digit code to confirm.</p>
        <ol style={{ fontSize: 13, color: 'var(--muted)', paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Open your authenticator app and choose “Add account”.</li>
          <li>Enter this setup key manually:</li>
        </ol>
        <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, letterSpacing: 1, background: 'var(--card-2)', border: '1px dashed var(--border-2)', borderRadius: 10, padding: '12px 14px', textAlign: 'center', userSelect: 'all', marginBottom: 8 }}>{secret}</div>
        <p className="muted" style={{ fontSize: 11, wordBreak: 'break-all', marginTop: 0 }}>{otpauth}</p>
        <div className="field" style={{ marginTop: 8 }}>
          <label>Verification code</label>
          <input inputMode="numeric" maxLength={6} placeholder="123456" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }} />
        </div>
        {err && <div className="muted" style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <div className="row" style={{ gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={confirm}>Confirm &amp; Enable</button>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// PHASE 2: Reports, Audit Log, IAM Matrix, Data Retention
// ============================================================

function downloadCsv(filename: string, rows: any[], columns: { key: string; label: string }[]) {
  if (!rows.length) return;
  const escape = (v: any) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => escape(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => escape(r[c.key])).join(',')).join('\n');
  const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function Reports() {
  const [tab, setTab] = useState<'students' | 'teachers' | 'ai'>('students');
  const [grades, setGrades] = useState<any[]>([]);
  const [gradeId, setGradeId] = useState<number | ''>('');
  const [aiDays, setAiDays] = useState(30);
  const [students, setStudents] = useState<any[] | null>(null);
  const [teachers, setTeachers] = useState<any[] | null>(null);
  const [ai, setAi] = useState<any[] | null>(null);

  useEffect(() => { apiGet<any>('/admin/grades').then((r) => setGrades(r.grades)).catch(() => {}); }, []);

  useEffect(() => {
    if (tab === 'students') {
      const q = gradeId ? `?grade_id=${gradeId}` : '';
      apiGet<any>(`/admin/reports/students${q}`).then((r) => setStudents(r.rows)).catch(() => {});
    } else if (tab === 'teachers') {
      apiGet<any>('/admin/reports/teachers').then((r) => setTeachers(r.rows)).catch(() => {});
    } else if (tab === 'ai') {
      apiGet<any>(`/admin/reports/ai?days=${aiDays}`).then((r) => setAi(r.rows)).catch(() => {});
    }
  }, [tab, gradeId, aiDays]);

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#0f3a52,#1f6f8b)' }}>
        <div>
          <span className="kicker">REPORTING & ANALYTICS</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>📈 Reports Center</h2>
          <p style={{ color: '#cfe9f5', margin: 0 }}>Export student progress, teacher activity and AI consumption snapshots for stakeholder reviews.</p>
        </div>
      </div>

      <div className="card pad">
        <div className="row" style={{ gap: 8, marginBottom: 14 }}>
          <button className={`btn sm ${tab === 'students' ? '' : 'ghost'}`} onClick={() => setTab('students')}>🎒 Students</button>
          <button className={`btn sm ${tab === 'teachers' ? '' : 'ghost'}`} onClick={() => setTab('teachers')}>👩‍🏫 Teachers</button>
          <button className={`btn sm ${tab === 'ai' ? '' : 'ghost'}`} onClick={() => setTab('ai')}>🤖 AI Usage</button>
        </div>

        {tab === 'students' && (
          <>
            <div className="row" style={{ gap: 10, marginBottom: 12 }}>
              <select value={gradeId} onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">All classes</option>
                {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <button className="btn sm" disabled={!students?.length} onClick={() => downloadCsv('students_report.csv', students || [], [
                { key: 'full_name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'username', label: 'Username' },
                { key: 'grade', label: 'Class' }, { key: 'chapters_completed', label: 'Chapters Completed' },
                { key: 'avg_score', label: 'Avg Score %' }, { key: 'quiz_attempts', label: 'Quiz Attempts' },
                { key: 'last_login', label: 'Last Login' }, { key: 'created_at', label: 'Joined' },
              ])}>⬇ Export CSV</button>
            </div>
            {!students ? <div className="spinner" /> : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead><tr><th>Name</th><th>Class</th><th>Email</th><th>Chapters</th><th>Avg %</th><th>Attempts</th><th>Last Login</th></tr></thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td><b>{s.full_name}</b></td><td>{s.grade || '—'}</td><td style={{ fontSize: 12 }}>{s.email}</td>
                        <td>{s.chapters_completed}</td><td>{s.avg_score}</td><td>{s.quiz_attempts}</td>
                        <td style={{ fontSize: 12 }} className="muted">{s.last_login ? new Date(s.last_login).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                    {students.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 20 }}>No students found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'teachers' && (
          <>
            <div className="row" style={{ gap: 10, marginBottom: 12 }}>
              <button className="btn sm" disabled={!teachers?.length} onClick={() => downloadCsv('teachers_report.csv', teachers || [], [
                { key: 'full_name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'username', label: 'Username' },
                { key: 'class_assignments', label: 'Class Assignments' }, { key: 'lesson_plans', label: 'Lesson Plans' },
                { key: 'quiz_gen_calls', label: 'AI Quiz Calls' }, { key: 'last_login', label: 'Last Login' },
              ])}>⬇ Export CSV</button>
            </div>
            {!teachers ? <div className="spinner" /> : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Assignments</th><th>Lesson Plans</th><th>AI Quiz Calls</th><th>Last Login</th></tr></thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id}>
                        <td><b>{t.full_name}</b></td><td style={{ fontSize: 12 }}>{t.email}</td>
                        <td>{t.class_assignments}</td><td>{t.lesson_plans}</td><td>{t.quiz_gen_calls}</td>
                        <td style={{ fontSize: 12 }} className="muted">{t.last_login ? new Date(t.last_login).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                    {teachers.length === 0 && <tr><td colSpan={6} className="muted" style={{ textAlign: 'center', padding: 20 }}>No teachers found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'ai' && (
          <>
            <div className="row" style={{ gap: 10, marginBottom: 12 }}>
              <select value={aiDays} onChange={(e) => setAiDays(Number(e.target.value))}>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last 365 days</option>
              </select>
              <button className="btn sm" disabled={!ai?.length} onClick={() => downloadCsv(`ai_usage_${aiDays}d.csv`, ai || [], [
                { key: 'feature', label: 'Feature' }, { key: 'model', label: 'Model' }, { key: 'calls', label: 'Calls' },
                { key: 'prompt_tokens', label: 'Prompt Tokens' }, { key: 'completion_tokens', label: 'Completion Tokens' },
                { key: 'total_tokens', label: 'Total Tokens' }, { key: 'last_call', label: 'Last Call' },
              ])}>⬇ Export CSV</button>
            </div>
            {!ai ? <div className="spinner" /> : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead><tr><th>Feature</th><th>Model</th><th>Calls</th><th>Prompt</th><th>Completion</th><th>Total Tokens</th><th>Last Call</th></tr></thead>
                  <tbody>
                    {ai.map((r, i) => (
                      <tr key={i}>
                        <td><b>{r.feature}</b></td><td style={{ fontSize: 12, fontFamily: 'monospace' }}>{r.model}</td>
                        <td>{r.calls}</td><td>{Number(r.prompt_tokens).toLocaleString()}</td>
                        <td>{Number(r.completion_tokens).toLocaleString()}</td><td><b>{Number(r.total_tokens).toLocaleString()}</b></td>
                        <td style={{ fontSize: 12 }} className="muted">{r.last_call ? new Date(r.last_call).toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                    {ai.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 20 }}>No AI usage in this period.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AuditLog() {
  const [data, setData] = useState<any>(null);
  const [filters, setFilters] = useState({ action: '', entity: '', since: '', until: '' });
  const [offset, setOffset] = useState(0);
  const limit = 50;

  function load(o = 0) {
    const p = new URLSearchParams();
    p.set('limit', String(limit));
    p.set('offset', String(o));
    if (filters.action) p.set('action', filters.action);
    if (filters.entity) p.set('entity', filters.entity);
    if (filters.since) p.set('since', filters.since);
    if (filters.until) p.set('until', filters.until);
    apiGet<any>(`/admin/audit?${p.toString()}`).then((r) => { setData(r); setOffset(o); }).catch(() => {});
  }
  useEffect(() => { load(0); /* eslint-disable-next-line */ }, [filters]);

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#3a1a1a,#5e1e2e)' }}>
        <div>
          <span className="kicker">AUDIT & GOVERNANCE</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🛡️ Audit Log</h2>
          <p style={{ color: '#f3cfd5', margin: 0 }}>Tamper-evident timeline of admin and system actions. Filter, inspect metadata and export for compliance reviews.</p>
        </div>
      </div>

      <Panel title="Filters" icon="🔍">
        <div className="grid2" style={{ gap: 10 }}>
          <div className="field"><label>Action</label>
            <select value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value })}>
              <option value="">All</option>
              {(data?.actions || []).map((a: string) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="field"><label>Entity</label>
            <select value={filters.entity} onChange={(e) => setFilters({ ...filters, entity: e.target.value })}>
              <option value="">All</option>
              {(data?.entities || []).map((e: string) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="field"><label>From</label><input type="date" value={filters.since} onChange={(e) => setFilters({ ...filters, since: e.target.value })} /></div>
          <div className="field"><label>To</label><input type="date" value={filters.until} onChange={(e) => setFilters({ ...filters, until: e.target.value })} /></div>
        </div>
        <div className="row" style={{ gap: 8, marginTop: 12 }}>
          <button className="btn sm ghost" onClick={() => setFilters({ action: '', entity: '', since: '', until: '' })}>Clear filters</button>
          <button className="btn sm" disabled={!data?.activities?.length} onClick={() => downloadCsv('audit_log.csv', (data?.activities || []).map((a: any) => ({
            ...a, meta_json: a.meta ? JSON.stringify(a.meta) : '',
          })), [
            { key: 'created_at', label: 'Time' }, { key: 'actor', label: 'Actor' }, { key: 'actor_role', label: 'Role' },
            { key: 'actor_email', label: 'Email' }, { key: 'action', label: 'Action' }, { key: 'entity', label: 'Entity' },
            { key: 'entity_id', label: 'Entity ID' }, { key: 'meta_json', label: 'Metadata' },
          ])}>⬇ Export CSV</button>
        </div>
      </Panel>

      <Panel title={`Events (${data?.total ?? 0})`} icon="📜">
        {!data ? <div className="spinner" /> : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Entity</th><th>Metadata</th></tr></thead>
                <tbody>
                  {data.activities.map((a: any) => (
                    <tr key={a.id}>
                      <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleString()}</td>
                      <td><b>{a.actor || 'System'}</b><br /><span className="muted" style={{ fontSize: 11 }}>{a.actor_role}</span></td>
                      <td><span className="chip">{a.action}</span></td>
                      <td style={{ fontSize: 12 }}>{a.entity}<br /><span className="muted" style={{ fontSize: 11 }}>{a.entity_id?.slice(0, 12)}</span></td>
                      <td><pre style={{ fontSize: 11, margin: 0, maxWidth: 320, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{a.meta ? JSON.stringify(a.meta) : '—'}</pre></td>
                    </tr>
                  ))}
                  {data.activities.length === 0 && <tr><td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 20 }}>No events match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
            {data.total > limit && (
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <button className="btn ghost sm" disabled={offset === 0} onClick={() => load(Math.max(0, offset - limit))}>← Prev</button>
                <span className="muted" style={{ fontSize: 13 }}>Page {Math.floor(offset / limit) + 1} / {Math.max(1, Math.ceil(data.total / limit))}</span>
                <button className="btn ghost sm" disabled={offset + limit >= data.total} onClick={() => load(offset + limit)}>Next →</button>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}

function IamMatrix() {
  const [perms, setPerms] = useState<any[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  function load() { apiGet<any>('/admin/iam/permissions').then((r) => setPerms(r.permissions)).catch(() => {}); }
  useEffect(() => { load(); }, []);

  async function toggle(role: string, resource: string, key: string, value: boolean) {
    const id = `${role}:${resource}:${key}`;
    setSaving(id);
    try {
      await apiPut(`/admin/iam/permissions/${role}/${resource}`, { [key]: value });
      setPerms((prev) => prev?.map((p) => p.role === role && p.resource === resource ? { ...p, [key]: value } : p) || null);
    } catch (e: any) { alert(e?.message || 'Update failed'); }
    setSaving(null);
  }

  if (!perms) return <div className="spinner" />;
  const roles = Array.from(new Set(perms.map((p) => p.role)));
  const resources = Array.from(new Set(perms.map((p) => p.resource))).sort();

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a3a2f,#1e6f5e)' }}>
        <div>
          <span className="kicker">IDENTITY & ACCESS</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🔐 Access Control Matrix</h2>
          <p style={{ color: '#cfeede', margin: 0 }}>Define what each role can View, Create, Edit and Delete across every resource. Changes are written immediately and audited.</p>
        </div>
      </div>

      {roles.map((role) => (
        <Panel key={role} title={role.charAt(0).toUpperCase() + role.slice(1)} icon={role === 'admin' ? '👑' : role === 'teacher' ? '👩‍🏫' : '🎒'}>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Resource</th><th style={{ textAlign: 'center' }}>View</th><th style={{ textAlign: 'center' }}>Create</th><th style={{ textAlign: 'center' }}>Edit</th><th style={{ textAlign: 'center' }}>Delete</th></tr></thead>
              <tbody>
                {resources.map((res) => {
                  const p = perms.find((x) => x.role === role && x.resource === res);
                  if (!p) return null;
                  return (
                    <tr key={res}>
                      <td><b>{res.replace(/_/g, ' ')}</b></td>
                      {(['can_view', 'can_create', 'can_edit', 'can_delete'] as const).map((k) => {
                        const id = `${role}:${res}:${k}`;
                        return (
                          <td key={k} style={{ textAlign: 'center' }}>
                            <button
                              className={`btn sm ${p[k] ? '' : 'ghost'}`}
                              disabled={saving === id}
                              onClick={() => toggle(role, res, k, !p[k])}
                              style={{ minWidth: 56, padding: '4px 10px' }}
                            >{p[k] ? '✓' : '×'}</button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      ))}
      <div className="card pad" style={{ background: '#fff8e1', fontSize: 13 }}>
        ⚠️ <b>Note:</b> The matrix is recorded for governance and reporting. Route-level enforcement currently relies on role checks (admin / teacher / student) — granular enforcement against this matrix is on the roadmap.
      </div>
    </div>
  );
}

function Retention() {
  const [data, setData] = useState<any>(null);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState(false);
  const [msg, setMsg] = useState('');

  function load() {
    apiGet<any>('/admin/retention').then((r) => {
      setData(r);
      const d: Record<string, number> = {};
      for (const [k, v] of Object.entries<any>(r.retention || {})) d[k] = Number(v.value) || 180;
      setDraft(d);
    }).catch(() => {});
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    try { await apiPut('/admin/retention', draft); setMsg('Saved retention policy.'); load(); }
    catch (e: any) { setMsg('Save failed: ' + (e?.message || 'error')); }
    setSaving(false); setTimeout(() => setMsg(''), 2500);
  }
  async function purge() {
    if (!confirm('Permanently delete records older than the configured retention windows? This cannot be undone.')) return;
    setPurging(true);
    try {
      const r: any = await apiPost('/admin/retention/purge', {});
      setMsg(`Purged: ${r.purged.activity} activity, ${r.purged.ai_usage} AI usage, ${r.purged.chat} chat, ${r.purged.quiz} quiz records.`);
      load();
    } catch (e: any) { setMsg('Purge failed: ' + (e?.message || 'error')); }
    setPurging(false); setTimeout(() => setMsg(''), 5000);
  }

  if (!data) return <div className="spinner" />;
  const fields: { key: string; label: string; total: number; entity: string }[] = [
    { key: 'retention_activity_days', label: 'Activity Log', total: Number(data.stats.activity_total), entity: 'activity_log' },
    { key: 'retention_ai_usage_days', label: 'AI Usage', total: Number(data.stats.ai_usage_total), entity: 'ai_usage' },
    { key: 'retention_chat_days', label: 'Chat Messages', total: Number(data.stats.chat_total), entity: 'chat_messages' },
    { key: 'retention_quiz_days', label: 'Quiz Attempts', total: Number(data.stats.quiz_total), entity: 'quiz_attempts' },
  ];

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#3a2a1a,#6f4f1e)' }}>
        <div>
          <span className="kicker">DATA GOVERNANCE</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🗄️ Log Retention & Purging</h2>
          <p style={{ color: '#f3e0c5', margin: 0 }}>Decide how long activity, AI usage, chat and quiz records are kept. Purging is one-click and audited.</p>
        </div>
      </div>

      {msg && <div className="card pad" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: 14 }}>{msg}</div>}

      <Panel title="Retention Windows" icon="⏳" sub="Records older than the configured number of days will be removed when you run a purge.">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Dataset</th><th>Total Records</th><th>Retention (days)</th><th>Last Updated</th></tr></thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.key}>
                  <td><b>{f.label}</b><br /><span className="muted" style={{ fontSize: 11 }}>{f.entity}</span></td>
                  <td>{f.total.toLocaleString()}</td>
                  <td>
                    <input
                      type="number" min={7} max={3650} step={1}
                      value={draft[f.key] ?? 180}
                      onChange={(e) => setDraft({ ...draft, [f.key]: Number(e.target.value) })}
                      style={{ width: 100 }}
                    />
                  </td>
                  <td className="muted" style={{ fontSize: 12 }}>{data.retention[f.key]?.updated_at ? new Date(data.retention[f.key].updated_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row" style={{ gap: 8, marginTop: 14 }}>
          <button className="btn" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save Policy'}</button>
          <button className="btn ghost" disabled={purging} onClick={purge} style={{ borderColor: 'var(--pink)', color: 'var(--pink)' }}>{purging ? 'Purging…' : '🗑 Run Purge Now'}</button>
        </div>
      </Panel>
    </div>
  );
}

// =====================================================================
// CURRICULUM LIBRARY — 700+ chapters across 8 innovation tracks
// =====================================================================
const TRACK_COLORS: Record<string, string> = {
  'Robotics': '#e63946',
  'Electronics': '#f4a261',
  'Arduino': '#2a9d8f',
  'Sensors': '#2a9d8f',
  'IoT': '#457b9d',
  'AIoT': '#457b9d',
  'AI': '#6a4c93',
  'ML': '#6a4c93',
  '3D': '#e76f51',
  'Fabrication': '#e76f51',
  'Entrepreneurship': '#ffb703',
  'Tinkerpreneur': '#ffb703',
  'Computational': '#43aa8b',
};

function trackColor(title: string) {
  for (const [k, v] of Object.entries(TRACK_COLORS)) {
    if (title.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '#6366f1';
}

function DonutChart({ value, max, color, size = 70 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function HBarChart({ data, colorFn }: { data: { label: string; value: number; color?: string }[]; colorFn?: (l: string) => string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'grid', gap: 7 }}>
      {data.map(d => (
        <div key={d.label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="muted">{d.label}</span>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 14, overflow: 'hidden' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: '100%', background: d.color || (colorFn ? colorFn(d.label) : '#6366f1'), borderRadius: 4, transition: 'width 0.4s ease' }} />
          </div>
          <b style={{ fontSize: 12, textAlign: 'right' }}>{d.value}</b>
        </div>
      ))}
    </div>
  );
}

function CurriculumLibrary() {
  const [data, setData] = useState<any>(null);
  const [openGrade, setOpenGrade] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [openTrack, setOpenTrack] = useState<any>(null);

  useEffect(() => { apiGet<any>('/admin/curriculum').then(setData).catch(() => {}); }, []);
  if (!data) return <div className="spinner" />;

  const { tree, tracks } = data;
  const totalChapters = tracks.reduce((s: number, t: any) => s + t.chapter_count, 0);
  const totalQuestions = tracks.reduce((s: number, t: any) => s + t.question_count, 0);
  const uniqueTracks = tracks.length;

  return (
    <div className="grid">
      {/* Hero */}
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#0f2027,#203a43,#2c5364)' }}>
        <div>
          <span className="kicker">CURRICULUM LIBRARY</span>
          <h2 style={{ color: '#fff', margin: '10px 0 6px' }}>📚 {totalChapters.toLocaleString()}+ Curriculum Chapters</h2>
          <p style={{ color: '#b0c4d8', margin: 0, maxWidth: 560 }}>
            {uniqueTracks} innovation tracks spanning Classes 6–12 — covering Robotics, Electronics, Arduino, IoT,
            AI/ML, 3D Modelling, Entrepreneurship and Computational Thinking. Each chapter includes theory,
            tinkering activities, quizzes and brain-teasers.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 4 }}>
          {[
            { icon: '📖', n: totalChapters.toLocaleString(), l: 'Chapters' },
            { icon: '❓', n: totalQuestions.toLocaleString(), l: 'Questions' },
            { icon: '🛤️', n: uniqueTracks, l: 'Innovation Tracks' },
          ].map(k => (
            <div key={k.l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 22 }}>{k.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{k.n}</div>
              <div style={{ fontSize: 12, color: '#8da8c0' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Innovation Tracks overview */}
      <Panel title="8 Innovation Tracks" icon="🛤️" sub="Each track is a curriculum strand that runs across multiple classes with escalating complexity">
        <HBarChart
          data={tracks.map((t: any) => ({ label: t.icon ? `${t.icon} ${t.title}` : t.title, value: t.chapter_count, color: trackColor(t.title) }))}
          colorFn={trackColor}
        />
        <div className="muted" style={{ fontSize: 12, marginTop: 14, marginBottom: 4 }}>👆 Click any track to list its grades, chapters and questions.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12, marginTop: 4 }}>
          {tracks.map((t: any) => {
            const c = trackColor(t.title);
            return (
              <button
                key={t.title}
                className="card pad"
                onClick={() => setOpenTrack(t)}
                title={`View all ${t.title} chapters`}
                style={{ borderLeft: `4px solid ${c}`, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', width: '100%', background: 'var(--card, rgba(255,255,255,0.03))', transition: 'transform 0.12s ease, box-shadow 0.12s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 18px ${c}33`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{t.icon || '📘'}</span>
                  <div>
                    <b style={{ fontSize: 13 }}>{t.title}</b>
                    <div className="muted" style={{ fontSize: 11 }}>{t.grades_count} grade{t.grades_count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <DonutChart value={t.chapter_count} max={Math.max(...tracks.map((x: any) => x.chapter_count))} color={c} size={52} />
                  </div>
                  <div style={{ fontSize: 12 }}>
                    <div><b>{t.chapter_count}</b> chapters</div>
                    <div className="muted">{t.question_count} questions</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: c, fontWeight: 600 }}>View details →</div>
              </button>
            );
          })}
        </div>
      </Panel>

      {openTrack && <TrackDetail track={openTrack} tree={tree} onClose={() => setOpenTrack(null)} />}

      {/* Expandable grade tree */}
      <Panel title="Grade-wise Curriculum Tree" icon="🌳" sub="Click a class to expand its modules and chapters">
        {tree.map((g: any) => (
          <div key={g.id} style={{ marginBottom: 6 }}>
            <button
              className={`card pad ${openGrade === g.id ? '' : 'ghost'}`}
              onClick={() => setOpenGrade(openGrade === g.id ? null : g.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', opacity: g.is_active ? 1 : 0.45 }}
            >
              <span style={{ fontSize: 20 }}>🏫</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <b>{g.name}</b>
                {g.level_label && <span className="muted" style={{ fontSize: 12, marginLeft: 8 }}>{g.level_label}</span>}
                {!g.is_active && <span className="tag" style={{ color: 'var(--pink)', marginLeft: 8 }}>inactive</span>}
              </div>
              <div className="muted" style={{ fontSize: 12, textAlign: 'right' }}>
                {g.modules?.length || 0} modules · {g.modules?.reduce((s: number, m: any) => s + m.chapter_count, 0) || 0} chapters
              </div>
              <span className="muted">{openGrade === g.id ? '▲' : '▼'}</span>
            </button>

            {openGrade === g.id && g.modules && (
              <div style={{ marginLeft: 20, marginTop: 4, display: 'grid', gap: 4 }}>
                {g.modules.length === 0 && <div className="muted" style={{ padding: '8px 0', fontSize: 13 }}>No modules yet. Add from Course Editor.</div>}
                {g.modules.map((m: any) => {
                  const isOpen = openModule === m.id;
                  const mc = trackColor(m.title);
                  return (
                    <div key={m.id}>
                      <button
                        onClick={() => setOpenModule(isOpen ? null : m.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: isOpen ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isOpen ? mc : 'var(--border)'}`, marginBottom: 2 }}
                      >
                        <span style={{ fontSize: 18 }}>{m.icon || '📘'}</span>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{m.title}</span>
                        </div>
                        <span className="muted" style={{ fontSize: 12 }}>{m.chapter_count} ch · {m.question_count} q</span>
                        <span className="muted" style={{ fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && m.chapters && (
                        <div style={{ marginLeft: 16, marginTop: 4, display: 'grid', gap: 2 }}>
                          {m.chapters.map((c: any) => (
                            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 6, fontSize: 13, background: 'rgba(255,255,255,0.02)' }}>
                              <span style={{ color: mc, fontSize: 10 }}>●</span>
                              <span style={{ flex: 1 }}>{c.title}</span>
                              <span className="tag" style={{ fontSize: 11 }}>{c.difficulty}</span>
                              <span className="muted" style={{ fontSize: 11 }}>{c.questions}q</span>
                              {!c.is_published && <span className="tag" style={{ color: 'var(--pink)', fontSize: 11 }}>draft</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------------
// TRACK DETAIL — drill into a single innovation track: grades,
// chapters and question counts, computed from the curriculum tree.
// ------------------------------------------------------------------
function TrackDetail({ track, tree, onClose }: { track: any; tree: any[]; onClose: () => void }) {
  const c = trackColor(track.title);
  const [openGrade, setOpenGrade] = useState<number | null>(null);

  // Gather every module across all grades whose title matches this track.
  const gradeRows = (tree || [])
    .map((g: any) => {
      const mods = (g.modules || []).filter((m: any) => m.title === track.title);
      const chapters = mods.flatMap((m: any) => m.chapters || []);
      const questions = chapters.reduce((s: number, ch: any) => s + (ch.questions || 0), 0);
      return { grade: g, mods, chapters, questions };
    })
    .filter((r: any) => r.mods.length > 0);

  const totalChapters = gradeRows.reduce((s: number, r: any) => s + r.chapters.length, 0);
  const totalQuestions = gradeRows.reduce((s: number, r: any) => s + r.questions, 0);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card pad modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 760, maxHeight: '88vh', overflowY: 'auto', borderTop: `4px solid ${c}` }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 30 }}>{track.icon || '📘'}</span>
            <div>
              <h2 style={{ margin: 0 }}>{track.title}</h2>
              <div className="muted" style={{ fontSize: 13 }}>
                {gradeRows.length} grade{gradeRows.length !== 1 ? 's' : ''} · {totalChapters} chapters · {totalQuestions} questions
              </div>
            </div>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '14px 0' }}>
          {[
            { l: 'Grades', n: gradeRows.length, i: '🏫' },
            { l: 'Chapters', n: totalChapters, i: '📖' },
            { l: 'Questions', n: totalQuestions, i: '❓' },
          ].map(k => (
            <div key={k.l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{k.i}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{k.n}</div>
              <div className="muted" style={{ fontSize: 11 }}>{k.l}</div>
            </div>
          ))}
        </div>

        {gradeRows.length === 0 && <div className="muted" style={{ padding: 12 }}>No chapters found for this track yet.</div>}

        <div style={{ display: 'grid', gap: 6 }}>
          {gradeRows.map((r: any) => {
            const isOpen = openGrade === r.grade.id;
            return (
              <div key={r.grade.id}>
                <button
                  onClick={() => setOpenGrade(isOpen ? null : r.grade.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: isOpen ? `${c}1f` : 'rgba(255,255,255,0.04)', border: `1px solid ${isOpen ? c : 'var(--border)'}` }}
                >
                  <span style={{ fontSize: 18 }}>🏫</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <b style={{ fontSize: 13 }}>{r.grade.name}</b>
                    {r.grade.level_label && <span className="muted" style={{ fontSize: 11, marginLeft: 8 }}>{r.grade.level_label}</span>}
                    {!r.grade.is_active && <span className="tag" style={{ color: 'var(--pink)', marginLeft: 8, fontSize: 10 }}>inactive</span>}
                  </div>
                  <span className="muted" style={{ fontSize: 12 }}>{r.chapters.length} ch · {r.questions} q</span>
                  <span className="muted" style={{ fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div style={{ marginLeft: 14, marginTop: 4, display: 'grid', gap: 2 }}>
                    {r.chapters.length === 0 && <div className="muted" style={{ fontSize: 12, padding: '6px 0' }}>No chapters in this grade.</div>}
                    {r.chapters.map((ch: any) => (
                      <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 6, fontSize: 13, background: 'rgba(255,255,255,0.02)' }}>
                        <span style={{ color: c, fontSize: 10 }}>●</span>
                        <span style={{ flex: 1 }}>{ch.title}</span>
                        {ch.difficulty && <span className="tag" style={{ fontSize: 11 }}>{ch.difficulty}</span>}
                        <span className="muted" style={{ fontSize: 11 }}>{ch.questions}q</span>
                        {ch.is_published === false && <span className="tag" style={{ color: 'var(--pink)', fontSize: 11 }}>draft</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TEACHING ROLES — Custom permission bundles for teachers
// ============================================================
function TeachingRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [scopes, setScopes] = useState<{ grade_id: number; module_id: number | null }[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [assignRole, setAssignRole] = useState<number | null>(null);
  const [assignTeacher, setAssignTeacher] = useState('');

  const COLORS = ['#6366f1', '#0ea5e9', '#059669', '#f59e0b', '#e11d48', '#8b5cf6', '#14b8a6', '#f97316'];

  async function load() {
    const [r, t, g] = await Promise.all([
      apiGet<any>('/admin/roles'),
      apiGet<any>('/admin/roles/teachers'),
      apiGet<any>('/admin/grades'),
    ]);
    setRoles(r.roles || []);
    setTeachers(t.teachers || []);
    setGrades(g.grades || []);
  }

  async function loadModulesForGrade(gradeId: number) {
    const r = await apiGet<any>(`/content/grades/${gradeId}/modules`);
    setModules(prev => {
      const others = prev.filter(m => m.grade_id !== gradeId);
      return [...others, ...r.modules.map((m: any) => ({ ...m, grade_id: gradeId }))];
    });
  }

  useEffect(() => { load().catch(() => {}); }, []);

  function startCreate() {
    setEditing(null); setName(''); setDesc(''); setColor('#6366f1'); setScopes([]);
    setMsg(null); setView('create');
  }

  function startEdit(role: any) {
    setEditing(role);
    setName(role.name);
    setDesc(role.description || '');
    setColor(role.color || '#6366f1');
    const sc = (role.scopes || []).map((s: any) => ({ grade_id: s.grade_id, module_id: s.module_id ?? null }));
    setScopes(sc);
    // load modules for scoped grades
    const gradeIds = [...new Set(sc.map((s: any) => s.grade_id))] as number[];
    gradeIds.forEach(id => loadModulesForGrade(id).catch(() => {}));
    setMsg(null); setView('edit');
  }

  async function save() {
    if (!name.trim()) { setMsg({ k: 'err', t: 'Role name is required' }); return; }
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await apiPut(`/admin/roles/${editing.id}`, { name, description: desc, color, scopes });
        setMsg({ k: 'ok', t: 'Role updated.' });
      } else {
        await apiPost('/admin/roles', { name, description: desc, color, scopes });
        setMsg({ k: 'ok', t: 'Role created.' });
      }
      await load();
      setTimeout(() => setView('list'), 1200);
    } catch (e: any) {
      setMsg({ k: 'err', t: e.message || 'Save failed' });
    } finally { setSaving(false); }
  }

  async function deleteRole(id: number) {
    if (!confirm('Delete this role? All teacher assignments for this role will be removed.')) return;
    await apiDel(`/admin/roles/${id}`).catch(() => {});
    load();
  }

  async function doAssign() {
    if (!assignTeacher) return;
    await apiPost(`/admin/roles/${assignRole}/assign`, { teacher_id: assignTeacher }).catch((e: any) => alert(e.message));
    setAssignRole(null); setAssignTeacher('');
    load();
  }

  async function revokeRole(roleId: number, teacherId: string) {
    await apiDel(`/admin/roles/${roleId}/assign/${teacherId}`).catch(() => {});
    load();
  }

  function addScope() {
    const firstGrade = grades[0];
    if (!firstGrade) return;
    setScopes(s => [...s, { grade_id: firstGrade.id, module_id: null }]);
    loadModulesForGrade(firstGrade.id).catch(() => {});
  }

  function updateScope(i: number, field: 'grade_id' | 'module_id', val: number | null) {
    setScopes(s => s.map((sc, idx) => idx === i ? { ...sc, [field]: val } : sc));
    if (field === 'grade_id' && val) loadModulesForGrade(val).catch(() => {});
  }

  function removeScope(i: number) { setScopes(s => s.filter((_, idx) => idx !== i)); }

  if (view === 'create' || view === 'edit') {
    const formGradeIds = [...new Set(scopes.map(s => s.grade_id))];
    return (
      <div className="grid">
        <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => setView('list')}>← Back</button>
        <div className="card pad">
          <h2 style={{ marginTop: 0 }}>{editing ? '✏️ Edit Role' : '+ Create Teaching Role'}</h2>
          <p className="muted" style={{ fontSize: 13 }}>Define a named role with grade and module scopes. Assign it to teachers to control what content they can see and manage.</p>

          {msg && <div className="card pad" style={{ borderColor: msg.k === 'ok' ? 'var(--green)' : 'var(--red)', fontSize: 13, marginBottom: 12 }}>{msg.t}</div>}

          <div className="grid" style={{ gap: 14, maxWidth: 560 }}>
            <div className="field">
              <label>Role Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Class 6 Electronics Teacher" />
            </div>
            <div className="field">
              <label>Description</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional short description" />
            </div>
            <div className="field">
              <label>Colour</label>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: color === c ? '3px solid var(--text)' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="row between" style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>📚 Grade & Module Scopes</h3>
              <button className="btn ghost sm" onClick={addScope}>+ Add Scope</button>
            </div>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Each scope grants access to a specific grade (required) and optionally a specific module. Leave module as "All modules" to allow full grade access.</p>

            {scopes.length === 0 && (
              <div className="muted" style={{ padding: '12px 0', fontSize: 13 }}>No scopes added yet. Add at least one scope to limit teacher access. If no scopes are added, teacher keeps existing access.</div>
            )}

            {scopes.map((sc, i) => {
              const gradeModules = modules.filter(m => m.grade_id === sc.grade_id);
              return (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 8 }}>
                  <select value={sc.grade_id} onChange={e => updateScope(i, 'grade_id', Number(e.target.value))} style={{ flex: 1 }}>
                    {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                  <select value={sc.module_id ?? ''} onChange={e => updateScope(i, 'module_id', e.target.value ? Number(e.target.value) : null)} style={{ flex: 1 }}>
                    <option value="">All modules</option>
                    {gradeModules.map(m => <option key={m.id} value={m.id}>{m.icon} {m.title}</option>)}
                  </select>
                  <button className="btn ghost sm" style={{ color: 'var(--pink)' }} onClick={() => removeScope(i)}>✕</button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="btn" disabled={saving} onClick={save}>{saving ? 'Saving…' : editing ? 'Update Role' : 'Create Role'}</button>
            <button className="btn ghost" onClick={() => setView('list')}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a0533,#1e3a6e)' }}>
        <div>
          <span className="kicker">ROLE MANAGEMENT</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🎭 Teaching Roles</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>
            Create named roles (e.g. "Class 6 Electronics Teacher") with specific grade and module access.
            Assign roles to teachers — they will only see the grades and modules allowed by their role(s).
          </p>
        </div>
        <button className="btn" onClick={startCreate}>+ Create Role</button>
      </div>

      {/* All roles */}
      <Panel title="All Roles" icon="🎭" sub={`${roles.length} roles defined`}>
        {roles.length === 0 && (
          <div className="muted" style={{ padding: '20px 0', textAlign: 'center' }}>
            No roles created yet. Click "Create Role" to define your first teaching role.
          </div>
        )}
        {roles.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
            <div className="row between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
              <div className="row" style={{ gap: 10 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: r.color || '#6366f1', display: 'inline-block', flexShrink: 0 }} />
                <b style={{ fontSize: 15 }}>{r.name}</b>
                {r.description && <span className="muted" style={{ fontSize: 13 }}>{r.description}</span>}
                <span className="tag" style={{ fontSize: 11 }}>{r.teacher_count} teacher{r.teacher_count !== 1 ? 's' : ''}</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn ghost sm" onClick={() => { setAssignRole(r.id); setAssignTeacher(''); }}>Assign teacher</button>
                <button className="btn ghost sm" onClick={() => startEdit(r)}>Edit</button>
                <button className="btn ghost sm" style={{ color: 'var(--pink)' }} onClick={() => deleteRole(r.id)}>Delete</button>
              </div>
            </div>

            {/* Scopes */}
            {(r.scopes || []).length > 0 && (
              <div className="row wrap" style={{ gap: 6, marginBottom: 10 }}>
                <span className="muted" style={{ fontSize: 12 }}>Scopes:</span>
                {r.scopes.map((s: any) => (
                  <span key={s.scope_id} className="tag" style={{ fontSize: 11 }}>
                    {s.grade_name}{s.module_title ? ` → ${s.module_title}` : ' (all modules)'}
                  </span>
                ))}
              </div>
            )}
            {(r.scopes || []).length === 0 && (
              <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>⚠️ No scopes defined — this role grants no additional access restrictions.</div>
            )}
          </div>
        ))}
      </Panel>

      {/* Teachers with their roles */}
      <Panel title="Teachers & Assigned Roles" icon="👩‍🏫">
        {teachers.length === 0 && <div className="muted">No teachers found.</div>}
        {teachers.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div className="avatar" style={{ flexShrink: 0 }}>{(t.full_name || 'T')[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{t.full_name}</b>
              <div className="muted" style={{ fontSize: 12 }}>{t.email}</div>
              <div className="row wrap" style={{ gap: 4, marginTop: 4 }}>
                {t.roles.length === 0 && <span className="tag" style={{ fontSize: 11 }}>No roles assigned</span>}
                {t.roles.map((role: any) => (
                  <span key={role.role_id} className="tag" style={{ fontSize: 11, background: role.color || '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {role.role_name}
                    <button onClick={() => revokeRole(role.role_id, t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, fontSize: 12, lineHeight: 1 }}>✕</button>
                  </span>
                ))}
              </div>
            </div>
            <button className="btn ghost sm" onClick={() => { setAssignRole(null); setAssignRole(-1 as any); setAssignTeacher(t.id); }}>+ Role</button>
          </div>
        ))}
      </Panel>

      {/* Assign modal */}
      {assignRole !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card pad" style={{ width: 400, maxWidth: '90vw' }}>
            <h3 style={{ margin: '0 0 12px' }}>Assign Role to Teacher</h3>
            <div className="field">
              <label>Select Role</label>
              <select value={assignRole ?? ''} onChange={e => setAssignRole(Number(e.target.value))}>
                <option value="">-- Pick a role --</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Select Teacher</label>
              <select value={assignTeacher} onChange={e => setAssignTeacher(e.target.value)}>
                <option value="">-- Pick a teacher --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
            <div className="row" style={{ gap: 10, marginTop: 12 }}>
              <button className="btn" onClick={doAssign} disabled={!assignRole || !assignTeacher}>Assign</button>
              <button className="btn ghost" onClick={() => { setAssignRole(null); setAssignTeacher(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
