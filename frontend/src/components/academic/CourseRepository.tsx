import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiPatch, apiDel } from '../../api';
import ContentStudio from '../editor/ContentStudio';

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

export default function CourseRepository() {
  const [overview, setOverview] = useState<any>(null);
  const [selLevel, setSelLevel] = useState<number | 'all'>('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [selCourse, setSelCourse] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [editCourse, setEditCourse] = useState<any>(null);
  const [editContent, setEditContent] = useState<any>(null);
  const [addPicker, setAddPicker] = useState(false);
  const [pickerCourses, setPickerCourses] = useState<any[]>([]);
  const [pickerQ, setPickerQ] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  function loadOverview() {
    apiGet<any>('/admin/catalog/overview').then(setOverview).catch(() => {});
  }
  function loadCourses() {
    const q = selLevel === 'all' ? '' : `?levelId=${selLevel}`;
    apiGet<any>(`/admin/catalog/courses${q}`).then((r) => setCourses(r.courses)).catch(() => {});
  }
  function loadGrades() {
    apiGet<any>('/admin/grades').then((r) => setGrades(r.grades.filter((g: any) => g.is_active))).catch(() => {});
  }
  function loadDetail(id: number) {
    apiGet<any>(`/admin/catalog/courses/${id}`).then(setDetail).catch(() => {});
  }

  useEffect(() => { loadOverview(); loadGrades(); }, []);
  useEffect(() => { loadCourses(); setSelected(new Set()); }, [selLevel]);
  useEffect(() => { if (selCourse?.id) loadDetail(selCourse.id); else setDetail(null); }, [selCourse?.id]);

  async function setCourseLevel(courseId: number, levelId: number | null) {
    await apiPatch(`/admin/catalog/courses/${courseId}/level`, { level_id: levelId });
  }

  async function removeSelectedFromLevel() {
    if (selLevel === 'all' || selected.size === 0) return;
    const n = selected.size;
    if (!confirm(`Remove ${n} course(s) from this learning level?`)) return;
    setBusy(true);
    try {
      await Promise.all([...selected].map((id) => setCourseLevel(id, null)));
      setSelected(new Set());
      flash(`${n} course(s) removed from level.`);
      loadCourses(); loadOverview();
    } catch (e: any) { alert(e?.message || 'Bulk remove failed'); }
    finally { setBusy(false); }
  }

  async function removeFromLevel(courseId: number, title: string) {
    if (!confirm(`Remove "${title}" from this learning level?\n\nThe course stays in the repository (unassigned).`)) return;
    setBusy(true);
    try {
      await setCourseLevel(courseId, null);
      if (selCourse?.id === courseId) setSelCourse(null);
      flash('Course removed from level.');
      loadCourses(); loadOverview();
    } catch (e: any) { alert(e?.message || 'Could not remove course'); }
    finally { setBusy(false); }
  }

  function openAddPicker() {
    if (selLevel === 'all') return;
    apiGet<any>('/admin/catalog/courses').then((r) => {
      setPickerCourses(r.courses.filter((c: any) => c.level_id !== selLevel));
      setPickerQ('');
      setAddPicker(true);
    }).catch(() => alert('Could not load courses'));
  }

  async function saveCourse(d: any) {
    try {
      if (d.id) await apiPut(`/admin/catalog/courses/${d.id}`, d);
      else await apiPost('/admin/catalog/courses', d);
      setEditCourse(null); flash('Course saved.'); loadCourses(); loadOverview();
      if (selCourse?.id === d.id) loadDetail(d.id);
    } catch (e: any) { alert(e?.message || 'Save failed'); }
  }

  async function deleteCourse(id: number, title: string) {
    if (!confirm(`Delete "${title}" from the repository? Deployed class copies will be unlinked.`)) return;
    try {
      await apiDel(`/admin/catalog/courses/${id}`);
      if (selCourse?.id === id) setSelCourse(null);
      flash('Course removed.'); loadCourses(); loadOverview();
    } catch (e: any) { alert(e?.message || 'Delete failed'); }
  }

  async function changeDetailLevel(levelId: number | null) {
    if (!detail?.course) return;
    setBusy(true);
    try {
      await setCourseLevel(detail.course.id, levelId);
      flash(levelId ? 'Learning level updated.' : 'Course unassigned from level.');
      loadDetail(detail.course.id); loadCourses(); loadOverview();
    } catch (e: any) { alert(e?.message || 'Level update failed'); }
    finally { setBusy(false); }
  }

  async function toggleMapping(gradeId: number, mapped: boolean) {
    if (!detail?.course) return;
    const current: number[] = (detail.mappings || []).map((m: any) => m.grade_id);
    const next = mapped ? [...current, gradeId] : current.filter((id) => id !== gradeId);
    setBusy(true);
    try {
      const r = await apiPut<any>(`/admin/catalog/courses/${detail.course.id}/mappings`, { grade_ids: next });
      setDetail((d: any) => ({ ...d, mappings: r.mappings }));
      flash(mapped ? 'Deployed to class.' : 'Removed from class.');
      loadCourses();
    } catch (e: any) { alert(e?.message || 'Mapping failed'); }
    finally { setBusy(false); }
  }

  async function syncCourse() {
    if (!detail?.course) return;
    setBusy(true);
    try {
      const r = await apiPost<any>(`/admin/catalog/courses/${detail.course.id}/sync`, {});
      flash(`Synced to ${r.synced_classes} class(es).`);
      loadDetail(detail.course.id);
    } catch (e: any) { alert(e?.message || 'Sync failed'); }
    finally { setBusy(false); }
  }

  async function saveCatalogContent(chapterId: number, blocks: any[]) {
    await apiPut(`/admin/catalog/chapters/${chapterId}`, { content: blocks });
    flash('Chapter content saved.');
    setEditContent(null);
    if (detail?.course) loadDetail(detail.course.id);
  }

  async function addChapter() {
    if (!detail?.course) return;
    const title = prompt('New chapter title:');
    if (!title?.trim()) return;
    try {
      await apiPost(`/admin/catalog/courses/${detail.course.id}/chapters`, { title: title.trim() });
      flash('Chapter added.'); loadDetail(detail.course.id);
    } catch (e: any) { alert(e?.message || 'Failed'); }
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const levels = overview?.levels || [];
  const stats = overview?.stats || {};
  const levelName = selLevel === 'all' ? 'All courses' : levels.find((l: any) => l.id === selLevel)?.name;
  const pickerFiltered = pickerCourses.filter((c) =>
    !pickerQ.trim() || c.title.toLowerCase().includes(pickerQ.toLowerCase())
    || (c.level_name || '').toLowerCase().includes(pickerQ.toLowerCase())
  );

  return (
    <div className="grid repo-wrap">
      <div className="card pad dash-hero" style={{ background: 'linear-gradient(120deg,#1a1a2e,#16213e,#0f3460)' }}>
        <div>
          <span className="kicker">ACADEMIC · CENTRAL REPOSITORY</span>
          <h2 style={{ color: '#fff', margin: '8px 0 6px' }}>🗄️ Course Repository</h2>
          <p style={{ color: '#a8c0d8', margin: 0, maxWidth: 620 }}>
            Maintain every course in one place, grouped by learning level. Map any course to multiple classes and sync updates with one click.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {[
            { n: stats.courses ?? '—', l: 'Courses' },
            { n: stats.chapters ?? '—', l: 'Chapters' },
            { n: stats.mappings ?? '—', l: 'Class mappings' },
            { n: levels.length, l: 'Learning levels' },
          ].map((k) => (
            <div key={k.l} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{k.n}</div>
              <div style={{ fontSize: 11, color: '#8da8c0' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {msg && <div className="card pad" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: 14 }}>{msg}</div>}

      <div className="repo-layout">
        <aside className="card pad repo-sidebar">
          <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)' }}>Learning levels</h4>
          <button type="button" className={`repo-level-btn${selLevel === 'all' ? ' active' : ''}`} onClick={() => { setSelLevel('all'); setSelCourse(null); }}>
            <span>📚</span> All courses <span className="repo-count">{stats.courses ?? 0}</span>
          </button>
          {levels.map((lv: any) => (
            <button key={lv.id} type="button" className={`repo-level-btn${selLevel === lv.id ? ' active' : ''}`}
              onClick={() => { setSelLevel(lv.id); setSelCourse(null); }}>
              <span style={{ flex: 1, textAlign: 'left' }}>{lv.name}</span>
              <span className="repo-count">{lv.course_count}</span>
            </button>
          ))}
          {selLevel !== 'all' && (
            <div className="grid" style={{ gap: 6, marginTop: 12 }}>
              <button type="button" className="btn sm" style={{ width: '100%' }} onClick={openAddPicker}>➕ Add existing course</button>
              <button type="button" className="btn ghost sm" style={{ width: '100%' }}
                onClick={() => setEditCourse({ level_id: selLevel, title: '', icon: '📘', color: '#6366f1', status: 'draft' })}>
                ➕ New course
              </button>
            </div>
          )}
          {selLevel === 'all' && (
            <button type="button" className="btn sm" style={{ width: '100%', marginTop: 12 }}
              onClick={() => setEditCourse({ level_id: levels[0]?.id, title: '', icon: '📘', color: '#6366f1', status: 'draft' })}>
              ➕ New course
            </button>
          )}
        </aside>

        <section className="repo-courses">
          {!selCourse && (
            <>
              <div className="row between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{levelName}</h3>
                  <span className="muted" style={{ fontSize: 13 }}>{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
                </div>
                {selLevel !== 'all' && selected.size > 0 && (
                  <button type="button" className="btn ghost sm" disabled={busy} onClick={removeSelectedFromLevel}>
                    ⊖ Remove {selected.size} from level
                  </button>
                )}
              </div>
              <div className="repo-grid">
                {courses.map((c) => (
                  <div key={c.id} className={`card pad repo-course-card${selected.has(c.id) ? ' selected' : ''}`}>
                    <div className="repo-card-actions">
                      {selLevel !== 'all' && (
                        <input type="checkbox" className="repo-card-check" checked={selected.has(c.id)}
                          onChange={() => toggleSelect(c.id)} title="Select for bulk remove" />
                      )}
                      <button type="button" className="repo-card-body" onClick={() => setSelCourse(c)}>
                        <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                          <span className="repo-card-icon" style={{ background: c.color || '#6366f1' }}>{c.icon || '📘'}</span>
                          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                            <b style={{ fontSize: 14 }}>{c.title}</b>
                            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{c.level_name || 'Unassigned'}</div>
                            <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                              <span className="tag">{c.chapter_count} ch</span>
                              <span className="tag">{c.mapped_classes} class{c.mapped_classes !== 1 ? 'es' : ''}</span>
                              <span className={`tag ${c.status === 'published' ? '' : 'ghost'}`}>{c.status}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                      {selLevel !== 'all' && (
                        <button type="button" className="repo-card-remove" title="Remove from this level"
                          disabled={busy} onClick={() => removeFromLevel(c.id, c.title)}>⊖</button>
                      )}
                    </div>
                  </div>
                ))}
                {courses.length === 0 && selLevel !== 'all' && (
                  <div className="muted repo-empty" style={{ gridColumn: '1 / -1' }}>
                    <p>No courses in this level yet.</p>
                    <div className="row" style={{ gap: 8, justifyContent: 'center', marginTop: 8 }}>
                      <button type="button" className="btn sm" onClick={openAddPicker}>➕ Add existing course</button>
                      <button type="button" className="btn ghost sm"
                        onClick={() => setEditCourse({ level_id: selLevel, title: '', icon: '📘', color: '#6366f1', status: 'draft' })}>
                        ➕ Create new
                      </button>
                    </div>
                  </div>
                )}
                {courses.length === 0 && selLevel === 'all' && (
                  <div className="muted" style={{ padding: 24, gridColumn: '1 / -1', textAlign: 'center' }}>No courses in the repository yet.</div>
                )}
              </div>
            </>
          )}

          {selCourse && detail && (
            <div className="repo-detail">
              <div className="row between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <button type="button" className="btn ghost sm" onClick={() => setSelCourse(null)}>← Back to list</button>
                <div className="row" style={{ gap: 6 }}>
                  <button type="button" className="btn ghost sm" onClick={() => setEditCourse(detail.course)}>✏️ Edit</button>
                  <button type="button" className="btn sm" disabled={busy} onClick={syncCourse}>🔄 Sync to classes</button>
                  {detail.course.level_id && (
                    <button type="button" className="btn ghost sm" disabled={busy}
                      onClick={() => changeDetailLevel(null)}>⊖ Unassign level</button>
                  )}
                  <button type="button" className="btn danger sm" onClick={() => deleteCourse(detail.course.id, detail.course.title)}>🗑</button>
                </div>
              </div>

              <div className="card pad" style={{ marginBottom: 14, borderLeft: `4px solid ${detail.course.color || '#6366f1'}` }}>
                <div className="row" style={{ gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 32 }}>{detail.course.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>{detail.course.title}</h3>
                    <div className="muted" style={{ fontSize: 13 }}>{detail.chapters?.length ?? 0} chapters</div>
                  </div>
                  <div className="field" style={{ margin: 0, minWidth: 220 }}>
                    <label style={{ fontSize: 11 }}>Learning level</label>
                    <select value={detail.course.level_id ?? ''} disabled={busy}
                      onChange={(e) => changeDetailLevel(e.target.value ? Number(e.target.value) : null)}>
                      <option value="">— Unassigned —</option>
                      {levels.map((lv: any) => <option key={lv.id} value={lv.id}>{lv.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="repo-detail-cols">
                <Panel title="Map to classes" icon="🏫" sub="Check classes where this course should appear. Changes deploy immediately.">
                  <div className="repo-class-grid">
                    {grades.map((g) => {
                      const mapped = (detail.mappings || []).some((m: any) => m.grade_id === g.id);
                      return (
                        <label key={g.id} className={`repo-class-chip${mapped ? ' on' : ''}`}>
                          <input type="checkbox" checked={mapped} disabled={busy}
                            onChange={(e) => toggleMapping(g.id, e.target.checked)} />
                          <span>{g.name}</span>
                          {g.level_label && <span className="muted" style={{ fontSize: 10 }}>{g.level_label}</span>}
                        </label>
                      );
                    })}
                  </div>
                  {(detail.mappings || []).length > 0 && (
                    <p className="muted" style={{ fontSize: 12, marginTop: 10, marginBottom: 0 }}>
                      Mapped to: {(detail.mappings || []).map((m: any) => m.grade_name).join(', ')}
                    </p>
                  )}
                </Panel>

                <Panel title="Chapters (master copy)" icon="📖" sub="Edit here once — use Sync to push to all mapped classes."
                  action={<button type="button" className="btn sm" onClick={addChapter}>➕ Chapter</button>}>
                  <div className="table-wrap">
                    <table className="table">
                      <thead><tr><th>#</th><th>Title</th><th>Status</th><th></th></tr></thead>
                      <tbody>
                        {(detail.chapters || []).map((ch: any, i: number) => (
                          <tr key={ch.id}>
                            <td>{i + 1}</td>
                            <td><b>{ch.title}</b><div className="muted" style={{ fontSize: 11 }}>{ch.summary?.slice(0, 60)}</div></td>
                            <td><span className={`tag ${ch.is_published ? '' : 'ghost'}`}>{ch.is_published ? 'Published' : 'Draft'}</span></td>
                            <td>
                              <button type="button" className="btn ghost sm" onClick={() => setEditContent(ch)}>📝 Content</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </section>
      </div>

      {addPicker && selLevel !== 'all' && (
        <div className="modal-bg" onClick={() => setAddPicker(false)}>
          <div className="modal card pad" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Add course to {levelName}</h3>
            <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Pick an existing repository course from another level or unassigned.</p>
            <input placeholder="Search courses…" value={pickerQ} onChange={(e) => setPickerQ(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
            <div className="grid" style={{ gap: 8 }}>
              {pickerFiltered.map((c) => (
                <div key={c.id} className="row between repo-picker-row" style={{ gap: 10, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <b style={{ fontSize: 14 }}>{c.icon} {c.title}</b>
                    <div className="muted" style={{ fontSize: 12 }}>{c.level_name || 'Unassigned'} · {c.chapter_count} ch</div>
                  </div>
                  <button type="button" className="btn sm" disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await setCourseLevel(c.id, selLevel);
                        flash(`"${c.title}" added to level.`);
                        setAddPicker(false);
                        loadCourses(); loadOverview();
                      } catch (e: any) { alert(e?.message || 'Failed'); }
                      finally { setBusy(false); }
                    }}>Add</button>
                </div>
              ))}
              {pickerFiltered.length === 0 && (
                <div className="muted" style={{ padding: 16, textAlign: 'center' }}>No other courses available to add.</div>
              )}
            </div>
            <button type="button" className="btn ghost" style={{ marginTop: 14 }} onClick={() => setAddPicker(false)}>Close</button>
          </div>
        </div>
      )}

      {editCourse && (
        <div className="modal-bg" onClick={() => setEditCourse(null)}>
          <div className="modal card pad" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h3 style={{ marginTop: 0 }}>{editCourse.id ? 'Edit course' : 'New course'}</h3>
            <div className="grid" style={{ gap: 10 }}>
              <div className="field"><label>Learning level</label>
                <select value={editCourse.level_id ?? ''} onChange={(e) => setEditCourse({ ...editCourse, level_id: Number(e.target.value) || null })}>
                  <option value="">— Unassigned —</option>
                  {levels.map((lv: any) => <option key={lv.id} value={lv.id}>{lv.name}</option>)}
                </select>
              </div>
              <div className="field"><label>Title</label>
                <input value={editCourse.title || ''} onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })} />
              </div>
              <div className="grid2" style={{ gap: 10 }}>
                <div className="field"><label>Icon</label><input value={editCourse.icon || ''} onChange={(e) => setEditCourse({ ...editCourse, icon: e.target.value })} /></div>
                <div className="field"><label>Color</label><input type="color" value={editCourse.color || '#6366f1'} onChange={(e) => setEditCourse({ ...editCourse, color: e.target.value })} style={{ width: '100%', height: 38 }} /></div>
              </div>
              <div className="field"><label>Description</label><textarea rows={2} value={editCourse.description || ''} onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })} /></div>
              <div className="field"><label>Status</label>
                <select value={editCourse.status || 'draft'} onChange={(e) => setEditCourse({ ...editCourse, status: e.target.value })}>
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 14 }}>
              <button type="button" className="btn" disabled={!editCourse.title} onClick={() => saveCourse(editCourse)}>Save</button>
              <button type="button" className="btn ghost" onClick={() => setEditCourse(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editContent && (
        <ContentStudio catalog chapter={editContent} onClose={() => setEditContent(null)}
          onSave={(blocks) => saveCatalogContent(editContent.id, blocks)} />
      )}
    </div>
  );
}
