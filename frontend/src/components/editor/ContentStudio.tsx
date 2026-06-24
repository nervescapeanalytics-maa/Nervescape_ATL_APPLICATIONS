import { useEffect, useState, useRef, type CSSProperties, type ReactNode } from 'react';
import { apiGet } from '../../api';
import Blocks from '../Blocks';
import RichTextEditor from './RichTextEditor';
import CanvasEditor from './CanvasEditor';
import ImageEditor from './ImageEditor';

// ── helpers ──────────────────────────────────────────────────────────────────
const linesToArr = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const arrToLines = (a?: string[]) => (a || []).join('\n');
const plain = (html?: string) => (html || '').replace(/<[^>]+>/g, '').trim();

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── block catalogue ──────────────────────────────────────────────────────────
const BLOCK_TYPES: { type: string; label: string; icon: string; cat: string; make: () => any }[] = [
  { type: 'heading', label: 'Heading', icon: '🔠', cat: 'Text', make: () => ({ type: 'heading', level: 2, text: 'New heading', html: '<h2>New heading</h2>' }) },
  { type: 'paragraph', label: 'Paragraph', icon: '¶', cat: 'Text', make: () => ({ type: 'paragraph', text: '', html: '<p>Start writing…</p>' }) },
  { type: 'richtext', label: 'Rich document', icon: '📄', cat: 'Text', make: () => ({ type: 'richtext', html: '<p></p>' }) },
  { type: 'callout', label: 'Callout', icon: '💡', cat: 'Text', make: () => ({ type: 'callout', variant: 'tip', title: 'Tip', text: '', html: '<p>Highlighted note…</p>' }) },
  { type: 'list', label: 'Bullet list', icon: '•', cat: 'Text', make: () => ({ type: 'list', title: '', items: ['First item', 'Second item'] }) },
  { type: 'steps', label: 'Numbered steps', icon: '🔢', cat: 'Text', make: () => ({ type: 'steps', title: 'Steps', items: ['Step one', 'Step two'] }) },
  { type: 'image', label: 'Image', icon: '🖼️', cat: 'Media', make: () => ({ type: 'image', url: '', caption: '' }) },
  { type: 'audio', label: 'Audio', icon: '🎵', cat: 'Media', make: () => ({ type: 'audio', url: '', caption: '' }) },
  { type: 'video', label: 'Video', icon: '🎬', cat: 'Media', make: () => ({ type: 'video', url: '', caption: '' }) },
  { type: 'attachment', label: 'Attachment', icon: '📎', cat: 'Media', make: () => ({ type: 'attachment', url: '', name: 'file.pdf' }) },
  { type: 'canvas', label: 'Drawing', icon: '🎨', cat: 'Media', make: () => ({ type: 'canvas', url: '', caption: '' }) },
  { type: 'table', label: 'Table', icon: '⊞', cat: 'Media', make: () => ({ type: 'table', html: '<table><thead><tr><th>Col 1</th><th>Col 2</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>' }) },
  { type: 'code', label: 'Code', icon: '💻', cat: 'STEM', make: () => ({ type: 'code', language: 'python', code: '# code here', note: '' }) },
  { type: 'example', label: 'Example', icon: '📌', cat: 'STEM', make: () => ({ type: 'example', title: 'Example', text: '', html: '<p></p>' }) },
  { type: 'analogy', label: 'Analogy', icon: '🔗', cat: 'STEM', make: () => ({ type: 'analogy', concept: '', analogy: '', explanation: '' }) },
  { type: 'activity', label: 'Activity', icon: '🧪', cat: 'STEM', make: () => ({ type: 'activity', title: 'Activity', duration: '20 min', materials: [], steps: [], expected: '' }) },
  { type: 'quiz', label: 'Quiz', icon: '❓', cat: 'STEM', make: () => ({ type: 'quiz', questions: [{ qtype: 'mcq', prompt: '', options: ['', ''], answer: '', explanation: '', difficulty: 'beginner' }] }) },
  { type: 'figure', label: 'Figure (SVG)', icon: '📐', cat: 'STEM', make: () => ({ type: 'figure', svg: '', caption: '' }) },
];

const inputStyle: CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card,#fff)', color: 'inherit', fontSize: 13 };
function Lbl({ children }: { children: ReactNode }) {
  return <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>{children}</label>;
}

// ── media upload helper ──────────────────────────────────────────────────────
function MediaUpload({ accept, label, onUrl }: { accept: string; label: string; onUrl: (url: string, name?: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className="btn ghost sm" onClick={() => ref.current?.click()}>📁 {label}</button>
      <input ref={ref} type="file" accept={accept} hidden onChange={async (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        onUrl(await fileToDataUrl(f), f.name);
        e.target.value = '';
      }} />
    </>
  );
}

// ── block field editor ───────────────────────────────────────────────────────
function BlockFields({ block, onChange, onOpenCanvas, onEditImage }: {
  block: any; onChange: (b: any) => void;
  onOpenCanvas: () => void; onEditImage: (url: string) => void;
}) {
  const set = (patch: any) => onChange({ ...block, ...patch });
  const richChange = (html: string, textKey = 'text') => set({ html, [textKey]: plain(html) });

  switch (block.type) {
    case 'heading':
      return (
        <div className="grid2" style={{ gap: 8 }}>
          <div><Lbl>Level</Lbl>
            <select style={inputStyle} value={block.level || 2} onChange={(e) => set({ level: Number(e.target.value) })}>
              <option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / span 2' }}><Lbl>Heading text</Lbl>
            <RichTextEditor compact value={block.html || `<h${block.level || 2}>${block.text || ''}</h${block.level || 2}>`}
              onChange={(html) => richChange(html)} minHeight={60} placeholder="Heading…" />
          </div>
        </div>
      );
    case 'paragraph':
    case 'richtext':
      return <RichTextEditor value={block.html || (block.text ? `<p>${block.text}</p>` : '')} onChange={(html) => richChange(html)} minHeight={block.type === 'richtext' ? 200 : 100} />;
    case 'callout':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <div className="grid2" style={{ gap: 8 }}>
            <div><Lbl>Variant</Lbl>
              <select style={inputStyle} value={block.variant || 'tip'} onChange={(e) => set({ variant: e.target.value })}>
                {['tip', 'concept', 'logic', 'realworld', 'warning', 'curiosity', 'objective', 'story', 'industry', 'project', 'revision'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><Lbl>Title</Lbl><input style={inputStyle} value={block.title || ''} onChange={(e) => set({ title: e.target.value })} /></div>
          </div>
          <div><Lbl>Body</Lbl>
            <RichTextEditor compact value={block.html || (block.text ? `<p>${block.text}</p>` : '')} onChange={(html) => richChange(html)} minHeight={90} />
          </div>
        </div>
      );
    case 'example':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <div><Lbl>Title</Lbl><input style={inputStyle} value={block.title || ''} onChange={(e) => set({ title: e.target.value })} /></div>
          <div><Lbl>Content</Lbl><RichTextEditor compact value={block.html || ''} onChange={(html) => richChange(html)} minHeight={80} /></div>
        </div>
      );
    case 'list':
    case 'steps':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <div><Lbl>Title (optional)</Lbl><input style={inputStyle} value={block.title || ''} onChange={(e) => set({ title: e.target.value })} /></div>
          <div><Lbl>Items (one per line)</Lbl><textarea style={{ ...inputStyle, minHeight: 90 }} value={arrToLines(block.items)} onChange={(e) => set({ items: linesToArr(e.target.value) })} /></div>
        </div>
      );
    case 'image':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <MediaUpload accept="image/*" label="Upload image" onUrl={(url) => set({ url })} />
            {block.url && <button type="button" className="btn ghost sm" onClick={() => onEditImage(block.url)}>✂️ Edit image</button>}
          </div>
          <div><Lbl>Image URL</Lbl><input style={inputStyle} value={block.url || ''} onChange={(e) => set({ url: e.target.value })} placeholder="https://… or upload above" /></div>
          <div><Lbl>Caption</Lbl><input style={inputStyle} value={block.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></div>
          {block.url && <img src={block.url} alt="" style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'contain' }} />}
        </div>
      );
    case 'audio':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <MediaUpload accept="audio/*" label="Upload audio" onUrl={(url) => set({ url })} />
          <div><Lbl>Audio URL</Lbl><input style={inputStyle} value={block.url || ''} onChange={(e) => set({ url: e.target.value })} /></div>
          <div><Lbl>Caption</Lbl><input style={inputStyle} value={block.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></div>
          {block.url && <audio controls src={block.url} style={{ width: '100%' }} />}
        </div>
      );
    case 'video':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <MediaUpload accept="video/*" label="Upload video" onUrl={(url) => set({ url })} />
          <div><Lbl>Video URL</Lbl><input style={inputStyle} value={block.url || ''} onChange={(e) => set({ url: e.target.value })} /></div>
          <div><Lbl>Caption</Lbl><input style={inputStyle} value={block.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></div>
          {block.url && <video controls src={block.url} style={{ width: '100%', maxHeight: 240, borderRadius: 8 }} />}
        </div>
      );
    case 'attachment':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <MediaUpload accept="*/*" label="Upload file" onUrl={(url, name) => set({ url, name: name || block.name })} />
          <div><Lbl>File name</Lbl><input style={inputStyle} value={block.name || ''} onChange={(e) => set({ name: e.target.value })} /></div>
          <div><Lbl>File URL</Lbl><input style={inputStyle} value={block.url || ''} onChange={(e) => set({ url: e.target.value })} /></div>
        </div>
      );
    case 'canvas':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <button type="button" className="btn sm" onClick={onOpenCanvas}>{block.url ? '✏️ Edit drawing' : '🎨 Open drawing studio'}</button>
          {block.url && <img src={block.url} alt={block.caption || 'Drawing'} style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />}
          <div><Lbl>Caption</Lbl><input style={inputStyle} value={block.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></div>
        </div>
      );
    case 'table':
      return <RichTextEditor value={block.html || ''} onChange={(html) => set({ html })} minHeight={120} placeholder="Use the table button in the toolbar to insert a table…" />;
    case 'code':
      return (
        <div className="grid" style={{ gap: 8 }}>
          <div className="grid2" style={{ gap: 8 }}>
            <div><Lbl>Language</Lbl><input style={inputStyle} value={block.language || ''} onChange={(e) => set({ language: e.target.value })} /></div>
            <div><Lbl>Note</Lbl><input style={inputStyle} value={block.note || ''} onChange={(e) => set({ note: e.target.value })} /></div>
          </div>
          <div><Lbl>Code</Lbl><textarea style={{ ...inputStyle, minHeight: 120, fontFamily: 'ui-monospace, monospace' }} value={block.code || ''} onChange={(e) => set({ code: e.target.value })} spellCheck={false} /></div>
        </div>
      );
    case 'quiz':
      return <QuizFields block={block} onChange={onChange} />;
    default:
      return (
        <textarea style={{ ...inputStyle, minHeight: 100, fontFamily: 'ui-monospace, monospace' }}
          defaultValue={JSON.stringify(block, null, 2)}
          onBlur={(e) => { try { onChange(JSON.parse(e.target.value)); } catch { /* ignore */ } }} />
      );
  }
}

function QuizFields({ block, onChange }: { block: any; onChange: (b: any) => void }) {
  const questions: any[] = block.questions || [];
  const setQ = (i: number, patch: any) => onChange({ ...block, questions: questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)) });
  return (
    <div className="grid" style={{ gap: 10 }}>
      {questions.map((q, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
          <div className="row between" style={{ marginBottom: 6 }}>
            <b style={{ fontSize: 12 }}>Q{i + 1}</b>
            <button type="button" className="btn danger sm" onClick={() => onChange({ ...block, questions: questions.filter((_, idx) => idx !== i) })}>🗑</button>
          </div>
          <div><Lbl>Prompt</Lbl><RichTextEditor compact value={q.html || (q.prompt ? `<p>${q.prompt}</p>` : '')}
            onChange={(html) => setQ(i, { html, prompt: plain(html) })} minHeight={50} /></div>
          <div style={{ marginTop: 6 }}><Lbl>Options (one per line)</Lbl>
            <textarea style={{ ...inputStyle, minHeight: 50 }} value={arrToLines(q.options)} onChange={(e) => setQ(i, { options: linesToArr(e.target.value) })} /></div>
          <div className="grid2" style={{ gap: 8, marginTop: 6 }}>
            <div><Lbl>Answer</Lbl><input style={inputStyle} value={q.answer || ''} onChange={(e) => setQ(i, { answer: e.target.value })} /></div>
            <div><Lbl>Explanation</Lbl><input style={inputStyle} value={q.explanation || ''} onChange={(e) => setQ(i, { explanation: e.target.value })} /></div>
          </div>
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={() => onChange({ ...block, questions: [...questions, { qtype: 'mcq', prompt: '', options: ['', ''], answer: '', explanation: '', difficulty: 'beginner' }] })}>➕ Add question</button>
    </div>
  );
}

function BlockCard({ block, index, total, onChange, onMove, onDuplicate, onDelete, onOpenCanvas, onEditImage }: {
  block: any; index: number; total: number;
  onChange: (b: any) => void; onMove: (d: -1 | 1) => void; onDuplicate: () => void; onDelete: () => void;
  onOpenCanvas: () => void; onEditImage: (url: string) => void;
}) {
  const [open, setOpen] = useState(index < 3);
  const meta = BLOCK_TYPES.find((b) => b.type === block.type);
  const preview = plain(block.html) || block.text || block.title || block.caption || block.type;
  return (
    <div className="cs-block-card">
      <div className="cs-block-head">
        <button type="button" className="cs-block-toggle" onClick={() => setOpen((o) => !o)}>
          <span>{meta?.icon || '📦'}</span>
          <b>{meta?.label || block.type}</b>
          <span className="muted cs-block-preview">{preview.slice(0, 80)}</span>
          <span className="cs-block-chev">{open ? '▾' : '▸'}</span>
        </button>
        <div className="row" style={{ gap: 2 }}>
          <button type="button" className="rte-btn" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
          <button type="button" className="rte-btn" disabled={index === total - 1} onClick={() => onMove(1)}>↓</button>
          <button type="button" className="rte-btn" onClick={onDuplicate}>⧉</button>
          <button type="button" className="rte-btn danger" onClick={onDelete}>🗑</button>
        </div>
      </div>
      {open && (
        <div className="cs-block-body">
          <BlockFields block={block} onChange={onChange} onOpenCanvas={onOpenCanvas} onEditImage={onEditImage} />
        </div>
      )}
    </div>
  );
}

// ── main Content Studio ────────────────────────────────────────────────────────
export default function ContentStudio({ chapter, onClose, onSave, catalog }: {
  chapter: any; onClose: () => void; onSave: (blocks: any[]) => void; catalog?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [mode, setMode] = useState<'visual' | 'preview' | 'json'>('visual');
  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showInsert, setShowInsert] = useState(false);
  const [json, setJson] = useState('');
  const [jsonErr, setJsonErr] = useState('');
  const [canvasIdx, setCanvasIdx] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlockIdx, setImageBlockIdx] = useState<number | null>(null);

  useEffect(() => {
    const url = catalog ? `/admin/catalog/chapters/${chapter.id}` : `/content/chapters/${chapter.id}`;
    apiGet<any>(url).then((d) => {
      const b = Array.isArray(d.chapter?.content) ? d.chapter.content : [];
      setBlocks(b); setJson(JSON.stringify(b, null, 2)); setLoaded(true);
    }).catch(() => setLoaded(true));
  }, [chapter.id, catalog]);

  const updateBlock = (i: number, b: any) => setBlocks((p) => p.map((x, idx) => (idx === i ? b : x)));
  const moveBlock = (i: number, dir: -1 | 1) => setBlocks((p) => { const j = i + dir; if (j < 0 || j >= p.length) return p; const n = [...p]; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const duplicateBlock = (i: number) => setBlocks((p) => { const n = [...p]; n.splice(i + 1, 0, JSON.parse(JSON.stringify(p[i]))); return n; });
  const deleteBlock = (i: number) => setBlocks((p) => p.filter((_, idx) => idx !== i));
  const addBlock = (maker: () => any) => { setBlocks((p) => [...p, maker()]); setShowInsert(false); };

  function switchMode(next: typeof mode) {
    if (mode === 'json' && next !== 'json') {
      try { const p = JSON.parse(json); if (!Array.isArray(p)) { setJsonErr('Must be an array'); return; } setBlocks(p); setJsonErr(''); }
      catch (e: any) { setJsonErr(e.message); return; }
    }
    if (next === 'json') setJson(JSON.stringify(blocks, null, 2));
    setMode(next);
  }

  async function handleSave() {
    let final = blocks;
    if (mode === 'json') {
      try { const p = JSON.parse(json); if (!Array.isArray(p)) { setJsonErr('Must be an array'); return; } final = p; }
      catch (e: any) { setJsonErr(e.message); return; }
    }
    setSaving(true);
    try { await onSave(final); } finally { setSaving(false); }
  }

  const insertCats = [...new Set(BLOCK_TYPES.map((b) => b.cat))];

  return (
    <>
      <div className={`modal-bg cs-overlay${fullscreen ? ' cs-fullscreen-active' : ''}`} onClick={onClose}>
        <div className={`card modal cs-studio${fullscreen ? ' cs-fullscreen' : ''}`} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="cs-header">
            <div>
              <h3 style={{ margin: 0 }}>📝 Content Studio</h3>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{chapter.title} · {blocks.length} blocks</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button type="button" className="btn ghost sm" title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={() => setFullscreen((f) => !f)}>
                {fullscreen ? '⊡' : '⛶'}
              </button>
              <button type="button" className="modal-x" onClick={onClose}>✕</button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="cs-toolbar">
            <div className="row" style={{ gap: 6 }}>
              {(['visual', 'preview', 'json'] as const).map((m) => (
                <button key={m} type="button" className={`btn sm ${mode === m ? '' : 'ghost'}`} onClick={() => switchMode(m)}>
                  {m === 'visual' ? '✏️ Edit' : m === 'preview' ? '👁 Preview' : '{ } JSON'}
                </button>
              ))}
            </div>
            {mode === 'visual' && (
              <div className="row" style={{ gap: 6, position: 'relative' }}>
                <button type="button" className="btn sm" onClick={() => setShowInsert((s) => !s)}>➕ Insert</button>
                {showInsert && (
                  <div className="cs-insert-menu">
                    {insertCats.map((cat) => (
                      <div key={cat}>
                        <div className="cs-insert-cat">{cat}</div>
                        {BLOCK_TYPES.filter((b) => b.cat === cat).map((bt) => (
                          <button key={bt.type} type="button" className="cs-insert-item" onClick={() => addBlock(bt.make)}>
                            <span>{bt.icon}</span> {bt.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="cs-body">
            {!loaded && <div className="spinner" />}
            {loaded && mode === 'visual' && (
              <div className="cs-blocks">
                {blocks.length === 0 && (
                  <div className="cs-empty">
                    <div style={{ fontSize: 40 }}>📝</div>
                    <p>No content yet. Click <b>➕ Insert</b> to add your first block.</p>
                  </div>
                )}
                {blocks.map((b, i) => (
                  <BlockCard key={i} block={b} index={i} total={blocks.length}
                    onChange={(nb) => updateBlock(i, nb)}
                    onMove={(dir) => moveBlock(i, dir)}
                    onDuplicate={() => duplicateBlock(i)}
                    onDelete={() => deleteBlock(i)}
                    onOpenCanvas={() => setCanvasIdx(i)}
                    onEditImage={(url) => { setImageUrl(url); setImageBlockIdx(i); }}
                  />
                ))}
              </div>
            )}
            {loaded && mode === 'preview' && <div className="content card pad"><Blocks blocks={blocks} /></div>}
            {loaded && mode === 'json' && (
              <div>
                <textarea className="cs-json" value={json} spellCheck={false}
                  onChange={(e) => { setJson(e.target.value); try { JSON.parse(e.target.value); setJsonErr(''); } catch (err: any) { setJsonErr(err.message); } }} />
                {jsonErr && <div className="cs-json-err">⚠ {jsonErr}</div>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="cs-footer">
            <span className="muted" style={{ fontSize: 12 }}>{blocks.length} blocks</span>
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
              <button type="button" className="btn" disabled={saving || (mode === 'json' && !!jsonErr)} onClick={handleSave}>
                {saving ? 'Saving…' : '💾 Save Content'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {canvasIdx !== null && (
        <CanvasEditor
          initialDataUrl={blocks[canvasIdx]?.url}
          onClose={() => setCanvasIdx(null)}
          onSave={(url) => { updateBlock(canvasIdx, { ...blocks[canvasIdx], type: 'canvas', url }); setCanvasIdx(null); }}
        />
      )}
      {imageUrl && imageBlockIdx !== null && (
        <ImageEditor
          src={imageUrl}
          onClose={() => { setImageUrl(null); setImageBlockIdx(null); }}
          onSave={(url) => { updateBlock(imageBlockIdx, { ...blocks[imageBlockIdx], url }); setImageUrl(null); setImageBlockIdx(null); }}
        />
      )}
    </>
  );
}
