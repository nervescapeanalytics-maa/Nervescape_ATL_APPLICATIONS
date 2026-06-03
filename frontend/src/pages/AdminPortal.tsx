import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDel } from '../api';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { THEMES, getTheme, applyTheme, getBoolPref, setBoolPref, getPref, setPref } from '../theme';

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
        { key: 'activity', label: 'Activity Feed', icon: '🕒', group: 'Overview' },
        { key: 'courses', label: 'Courses', icon: '📚', group: 'Academics' },
        { key: 'assignments', label: 'Assignments', icon: '🔗', group: 'Academics' },
        { key: 'teachers', label: 'Teachers', icon: '👩‍🏫', group: 'People' },
        { key: 'students', label: 'Students', icon: '🎒', group: 'People' },
        { key: 'parents', label: 'Parents', icon: '👪', group: 'People' },
        { key: 'schools', label: 'Schools', icon: '🏫', group: 'Operations' },
        { key: 'live', label: 'Live Classes', icon: '📡', group: 'Operations' },
        { key: 'finance', label: 'Finance', icon: '💰', group: 'Operations' },
        { key: 'reports', label: 'Reports', icon: '📈', group: 'Governance' },
        { key: 'audit', label: 'Audit Log', icon: '🛡️', group: 'Governance' },
        { key: 'iam', label: 'Access Control', icon: '🔐', group: 'Governance' },
        { key: 'retention', label: 'Data Retention', icon: '🗄️', group: 'Governance' },
        { key: 'ai', label: 'AI Platform', icon: '🤖', group: 'System' },
      ]}
    >
      {tab === 'overview' && <Overview go={setTab} />}
      {tab === 'activity' && <ActivityFeed />}
      {tab === 'courses' && <Courses />}
      {tab === 'teachers' && <Users role="teacher" />}
      {tab === 'students' && <Users role="student" />}
      {tab === 'parents' && <Parents />}
      {tab === 'assignments' && <Assignments />}
      {tab === 'schools' && <Schools />}
      {tab === 'live' && <LiveClasses />}
      {tab === 'finance' && <Finance />}
      {tab === 'reports' && <Reports />}
      {tab === 'audit' && <AuditLog />}
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
                      <button className="btn ghost sm" onClick={() => setEditChap({ ...c, module_id: m.id })}>✏️</button>
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
    </div>
  );
}

function ModuleEditor({ initial, onClose, onSave }: { initial: any; onClose: () => void; onSave: (d: any) => void }) {
  const [d, setD] = useState<any>(initial);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{d.id ? '✏️ Edit Module' : '➕ New Module'}</h3>
          <button className="btn ghost sm" onClick={onClose}>✕</button>
        </div>
        <div className="grid2" style={{ gap: 10 }}>
          <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Title</label><input value={d.title || ''} onChange={(e) => setD({ ...d, title: e.target.value })} /></div>
          <div className="field"><label>Icon (emoji)</label><input value={d.icon || ''} onChange={(e) => setD({ ...d, icon: e.target.value })} placeholder="🤖" /></div>
          <div className="field"><label>Accent Color</label><input type="color" value={d.color || '#6366f1'} onChange={(e) => setD({ ...d, color: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: '1 / span 2' }}><label>Description</label><textarea rows={3} value={d.description || ''} onChange={(e) => setD({ ...d, description: e.target.value })} /></div>
          <div className="field"><label>Order Index</label><input type="number" value={d.order_index ?? ''} onChange={(e) => setD({ ...d, order_index: e.target.value === '' ? undefined : Number(e.target.value) })} /></div>
        </div>
        <div className="row" style={{ gap: 8, marginTop: 14 }}>
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
        <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>Rich block content (lessons, code, images) is edited from the Teacher portal. Here you manage the chapter's metadata and lifecycle.</p>
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
