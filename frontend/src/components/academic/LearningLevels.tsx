import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../../api';

export default function LearningLevels() {
  const [levels, setLevels] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [msg, setMsg] = useState('');

  function load() {
    apiGet<any>('/admin/catalog/levels').then((r) => setLevels(r.levels)).catch(() => {});
  }
  useEffect(() => { load(); }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 2500); }

  async function save() {
    if (!edit) return;
    try {
      await apiPut(`/admin/catalog/levels/${edit.id}`, {
        name: edit.name, description: edit.description, order_index: edit.order_index, is_active: edit.is_active,
      });
      setEdit(null); flash('Level updated.'); load();
    } catch (e: any) { alert(e?.message || 'Save failed'); }
  }

  return (
    <div className="grid">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#2d1b69,#11998e)' }}>
        <span className="kicker">ACADEMIC · LEVELS</span>
        <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>📊 Learning Levels</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: 560 }}>
          The ten learning levels group courses by age band and programme stage — from AI Sprouts through Capstone &amp; Innovation.
          Each active class is linked to its primary level.
        </p>
      </div>

      {msg && <div className="card pad" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: 14 }}>{msg}</div>}

      <div className="card pad">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Level</th>
              <th>Courses</th>
              <th>Primary classes</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lv, i) => (
              <tr key={lv.id}>
                <td>{lv.order_index ?? i + 1}</td>
                <td>
                  <b>{lv.name}</b>
                  {lv.description && <div className="muted" style={{ fontSize: 12, maxWidth: 360 }}>{lv.description}</div>}
                </td>
                <td><span className="tag">{lv.course_count}</span></td>
                <td className="muted">{lv.primary_classes}</td>
                <td><span className={`tag ${lv.is_active ? '' : 'ghost'}`}>{lv.is_active ? 'Active' : 'Inactive'}</span></td>
                <td><button type="button" className="btn ghost sm" onClick={() => setEdit({ ...lv })}>✏️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="modal-bg" onClick={() => setEdit(null)}>
          <div className="modal card pad" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3 style={{ marginTop: 0 }}>Edit level — {edit.name}</h3>
            <div className="grid" style={{ gap: 10 }}>
              <div className="field"><label>Name</label><input value={edit.name || ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div className="field"><label>Description</label><textarea rows={3} value={edit.description || ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
              <div className="field"><label>Order</label><input type="number" value={edit.order_index ?? 0} onChange={(e) => setEdit({ ...edit, order_index: Number(e.target.value) })} /></div>
              <label className="row" style={{ gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={edit.is_active !== false} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 14 }}>
              <button type="button" className="btn" onClick={save}>Save</button>
              <button type="button" className="btn ghost" onClick={() => setEdit(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
