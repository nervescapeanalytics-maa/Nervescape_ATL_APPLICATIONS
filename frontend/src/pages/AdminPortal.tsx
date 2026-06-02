import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDel } from '../api';
import Layout from '../components/Layout';

export default function AdminPortal() {
  const [tab, setTab] = useState('overview');
  return (
    <Layout
      title="Admin Console"
      subtitle="Govern schools, users, courses & operations across the Nervescape network"
      active={tab}
      onTab={setTab}
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
        { key: 'ai', label: 'AI Platform', icon: '🤖', group: 'System' },
        { key: 'settings', label: 'Settings', icon: '⚙️', group: 'System' },
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
      {tab === 'ai' && <AiMonitor />}
      {tab === 'settings' && <Settings />}
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
  { i: '⚙️', t: 'Settings', d: 'Platform configuration', tab: '' },
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
  const [tid, setTid] = useState('');
  const [gid, setGid] = useState<number | ''>('');

  function load() { apiGet<{ assignments: any[] }>('/admin/assignments').then((r) => setRows(r.assignments)).catch(() => {}); }
  useEffect(() => {
    load();
    apiGet('/admin/users?role=teacher').then((r: any) => setTeachers(r.users)).catch(() => {});
    apiGet('/content/grades').then((r: any) => setGrades(r.grades)).catch(() => {});
  }, []);

  async function add() {
    if (!tid || gid === '') return;
    await apiPost('/admin/assignments', { teacher_id: tid, grade_id: Number(gid), module_id: null });
    setTid(''); setGid(''); load();
  }
  async function del(id: number) { await apiDel(`/admin/assignments/${id}`); load(); }

  return (
    <div className="grid">
      <div className="card pad">
        <h3 style={{ marginTop: 0 }}>Wire a teacher to a class</h3>
        <div className="row wrap">
          <select value={tid} onChange={(e) => setTid(e.target.value)} style={{ maxWidth: 240 }}>
            <option value="">— teacher —</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
          <select value={gid} onChange={(e) => setGid(e.target.value === '' ? '' : Number(e.target.value))} style={{ maxWidth: 200 }}>
            <option value="">— class —</option>
            {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button className="btn" onClick={add}>Assign</button>
        </div>
      </div>
      <div className="card pad">
        <table>
          <thead><tr><th>Teacher</th><th>Class</th><th>Module</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}><td>{r.teacher}</td><td>{r.grade}</td><td>{r.module || 'All modules'}</td>
                <td><button className="btn danger sm" onClick={() => del(r.id)}>Remove</button></td></tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="muted">No assignments yet.</td></tr>}
          </tbody>
        </table>
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

  useEffect(() => {
    apiGet<any>('/content/grades').then((r) => { setGrades(r.grades); if (r.grades.length) setSelGrade(r.grades[0].id); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selGrade) return;
    apiGet<any>(`/content/modules?grade_id=${selGrade}`).then((r) => setModules(r.modules)).catch(() => {});
  }, [selGrade]);

  return (
    <div className="grid">
      <div className="card pad">
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <b>Class:</b>
          {grades.map((g) => (
            <button key={g.id} className={`btn ghost sm${selGrade === g.id ? ' active' : ''}`} onClick={() => setSelGrade(g.id)}>{g.name}</button>
          ))}
        </div>
      </div>
      {modules.map((m) => (
        <div key={m.id} className="card pad">
          <div className="row between" style={{ marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>{m.icon} {m.title}</h3>
            <span className="tag">{m.chapters?.length || 0} chapters</span>
          </div>
          <p className="muted" style={{ fontSize: 13, margin: '0 0 10px' }}>{m.description}</p>
          <table>
            <thead><tr><th>#</th><th>Chapter</th><th>Difficulty</th><th>Est.</th><th>Published</th></tr></thead>
            <tbody>
              {(m.chapters || []).map((c: any, i: number) => (
                <tr key={c.id}>
                  <td className="muted">{i + 1}</td>
                  <td>{c.title}</td>
                  <td><span className="tag">{c.difficulty}</span></td>
                  <td className="muted">{c.est_minutes}m</td>
                  <td>{c.is_published ? <span style={{ color: 'var(--green)' }}>✓</span> : <span className="muted">—</span>}</td>
                </tr>
              ))}
              {(!m.chapters || m.chapters.length === 0) && <tr><td colSpan={5} className="muted">No chapters yet.</td></tr>}
            </tbody>
          </table>
        </div>
      ))}
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
  const MOCK = [
    { id: 1, title: 'Intro to Robotics — Class 6A', teacher: 'Ms. Priya', grade: 'Class 6', scheduled: '2025-07-15 10:00', status: 'scheduled' },
    { id: 2, title: 'IoT Basics Workshop', teacher: 'Mr. Rajan', grade: 'Class 7', scheduled: '2025-07-16 14:00', status: 'scheduled' },
    { id: 3, title: 'AI & Sensors Demo', teacher: 'Ms. Kavitha', grade: 'Class 8', scheduled: '2025-07-10 09:00', status: 'completed' },
  ];
  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a2a3a,#2a3a5e)' }}>
        <div>
          <span className="kicker">LIVE SESSIONS</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>Live Class Scheduler 📡</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>Schedule and monitor live classes, record attendance and track engagement across all grades.</p>
        </div>
      </div>
      <div className="card pad">
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Upcoming Sessions</h3>
          <button className="btn" disabled>+ Schedule Class</button>
        </div>
        <table>
          <thead><tr><th>Title</th><th>Teacher</th><th>Class</th><th>Scheduled</th><th>Status</th></tr></thead>
          <tbody>
            {MOCK.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td><td>{c.teacher}</td><td>{c.grade}</td>
                <td>{c.scheduled}</td>
                <td><span className="tag" style={{ color: c.status === 'completed' ? 'var(--green)' : 'var(--primary)' }}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>Full scheduling integration coming in next release. Connect a calendar API or video platform.</div>
      </div>
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
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [cfg, setCfg] = useState<Record<string, string>>({});

  useEffect(() => {
    apiGet<any>('/admin/ai/usage').then((r) => { setData(r); setCfg(r.config || {}); }).catch(() => {});
  }, []);

  async function saveCfg() {
    setSaving(true);
    await apiPut('/admin/ai/config', cfg).catch(() => {});
    setSaving(false);
  }

  if (!data) return <div className="spinner" />;
  const s = data.summary;
  const budget = Number(cfg.monthly_token_budget) || 1000000;
  const pct = Math.min(100, Math.round((s.total_tokens / budget) * 100));

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a1a3a,#1e3a5e)' }}>
        <div>
          <span className="kicker">AI PLATFORM MONITORING</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🤖 AI LLM Console</h2>
          <p style={{ color: '#b0c4de', margin: 0 }}>Monitor token consumption across all AI features — chatbot, quiz generation &amp; challenge evaluation. Configure your LLM endpoint.</p>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--primary)' }}>🔢</span><div><div className="kpi-n">{s.total_tokens.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Tokens This Month</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--green)' }}>📤</span><div><div className="kpi-n">{s.prompt_tokens.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Prompt Tokens</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--purple)' }}>📥</span><div><div className="kpi-n">{s.completion_tokens.toLocaleString()}</div><div className="muted" style={{ fontSize: 13 }}>Completion Tokens</div></div></div>
        <div className="card kpi"><span className="kpi-ico" style={{ color: 'var(--yellow)' }}>📞</span><div><div className="kpi-n">{s.total_calls}</div><div className="muted" style={{ fontSize: 13 }}>AI Calls</div></div></div>
      </div>

      <div className="dash-cols">
        <Panel title="Monthly Budget Usage" icon="📊">
          <div style={{ marginBottom: 8 }}>
            <div className="row between" style={{ fontSize: 13, marginBottom: 6 }}>
              <span>{s.total_tokens.toLocaleString()} / {Number(budget).toLocaleString()} tokens</span>
              <b>{pct}%</b>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 8, height: 12 }}>
              <div style={{ width: `${pct}%`, background: pct > 80 ? 'var(--pink)' : pct > 50 ? 'var(--yellow)' : 'var(--green)', height: '100%', borderRadius: 8, transition: 'width .3s' }} />
            </div>
          </div>
          <h4 style={{ marginTop: 16, marginBottom: 8 }}>Usage by Feature</h4>
          {data.byFeature.length === 0 && <div className="muted">No AI calls logged yet.</div>}
          {data.byFeature.map((f: any) => (
            <div key={f.feature} className="row between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ textTransform: 'capitalize' }}>{f.feature.replace(/_/g, ' ')}</span>
              <span><b>{f.tokens.toLocaleString()}</b> tokens · {f.calls} calls</span>
            </div>
          ))}
        </Panel>

        <Panel title="LLM Configuration" icon="⚙️">
          {[['provider','Provider (offline / openai / custom)'],['model','Model'],['base_url','Base URL'],['monthly_token_budget','Monthly Token Budget']].map(([k,l]) => (
            <div key={k} className="field" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 13 }}>{l}</label>
              <input value={cfg[k] || ''} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} />
            </div>
          ))}
          <h4 style={{ marginTop: 16, marginBottom: 8 }}>Feature Toggles</h4>
          {[['chatbot_enabled','Student Chatbot (TinkerBot)'],['quiz_gen_enabled','AI Quiz Generation'],['challenge_eval_enabled','Challenge Evaluation']].map(([k,l]) => (
            <div key={k} className="row between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13 }}>{l}</span>
              <button className={`btn sm ${cfg[k] === 'true' ? '' : 'ghost'}`}
                onClick={() => setCfg({ ...cfg, [k]: cfg[k] === 'true' ? 'false' : 'true' })}>
                {cfg[k] === 'true' ? '✓ Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
          <button className="btn" style={{ marginTop: 14 }} disabled={saving} onClick={saveCfg}>{saving ? 'Saving…' : 'Save Configuration'}</button>
        </Panel>
      </div>

      <Panel title="Daily Token Usage (Last 30 Days)" icon="📈">
        {data.daily.length === 0 ? (
          <div className="muted">No usage data yet. AI calls will appear here once students use TinkerBot, quizzes or challenges.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Date</th><th>Tokens Used</th><th>Bar</th></tr></thead>
              <tbody>
                {(() => { const max = Math.max(...data.daily.map((d: any) => d.tokens), 1);
                  return data.daily.map((d: any) => (
                    <tr key={d.day}>
                      <td style={{ fontSize: 12 }}>{d.day}</td>
                      <td><b>{d.tokens.toLocaleString()}</b></td>
                      <td style={{ width: 200 }}>
                        <div style={{ background: 'var(--border)', borderRadius: 4, height: 8 }}>
                          <div style={{ width: `${(d.tokens / max) * 100}%`, background: 'var(--primary)', height: '100%', borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
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
        <div className="field"><label>Support Email</label><input defaultValue="support@nervescape.io" /></div>
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

