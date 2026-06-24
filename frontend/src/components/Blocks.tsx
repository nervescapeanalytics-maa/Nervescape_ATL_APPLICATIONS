// Renders the rich, typed content blocks produced by the backend curriculum builder.
// Supports all 17 block types including: analogy, activity, mistake, troubleshoot,
// miniproject, industry, quiz, and revision callouts.
import { useState } from 'react';
import type { CSSProperties } from 'react';

export interface Block {
  type: string;
  // heading / paragraph / callout / steps / list / figure / image / code / example
  level?: number;
  text?: string;
  html?: string;
  title?: string;
  items?: string[];
  svg?: string;
  url?: string;
  name?: string;
  caption?: string;
  language?: string;
  code?: string;
  note?: string;
  variant?: string;
  // analogy
  concept?: string;
  analogy?: string;
  explanation?: string;
  // mistake
  mistake?: string;
  why?: string;
  fix?: string;
  // troubleshoot
  problem?: string;
  cause?: string;
  // activity
  duration?: string;
  materials?: string[];
  steps?: string[];
  expected?: string;
  // miniproject
  description?: string;
  time?: string;
  expectedOutput?: string;
  extensions?: string[];
  // industry
  company?: string;
  useCase?: string;
  impact?: string;
  // quiz
  questions?: QuizQ[];
}

interface QuizQ {
  qtype: string;
  prompt: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: string;
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="content">
      {blocks.map((b, i) => <BlockView key={i} b={b} />)}
    </div>
  );
}

/** Render stored HTML from the Content Studio, or fall back to plain text. */
function RichHtml({ html, text, className, style }: { html?: string; text?: string; className?: string; style?: CSSProperties }) {
  const raw = html || (text && /<[a-z][\s\S]*>/i.test(text) ? text : '');
  if (raw) return <div className={`rich-html ${className || ''}`} style={style} dangerouslySetInnerHTML={{ __html: raw }} />;
  if (text) return <div className={className} style={style}>{text}</div>;
  return null;
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'heading':
      if (b.html) return <RichHtml html={b.html} className="block-heading" />;
      if (b.level === 1) return <h1 style={{ marginTop: 0 }}>{b.text}</h1>;
      if (b.level === 3) return <h3>{b.text}</h3>;
      return <h2>{b.text}</h2>;

    case 'paragraph':
    case 'richtext':
      return <RichHtml html={b.html} text={b.text} style={{ lineHeight: 1.75, marginBottom: 12 }} />;

    case 'callout':
      return (
        <div className={`callout ${b.variant || ''}`}>
          {b.title && <div className="title">{b.title}</div>}
          <RichHtml html={b.html} text={b.text} />
        </div>
      );

    case 'steps':
      return (
        <div style={{ marginBottom: 12 }}>
          {b.title && <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--muted)' }}>{b.title}</div>}
          <ol className="steps">{(b.items || []).map((it, i) => <li key={i} style={{ lineHeight: 1.7, marginBottom: 4 }}>{it}</li>)}</ol>
        </div>
      );

    case 'list':
      return (
        <div style={{ marginBottom: 10 }}>
          {b.title && <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--muted)' }}>{b.title}</div>}
          <ul>{(b.items || []).map((it, i) => <li key={i} style={{ lineHeight: 1.7 }}>{it}</li>)}</ul>
        </div>
      );

    case 'figure':
      return (
        <figure style={{ margin: '16px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: b.svg || '' }} style={{ maxWidth: '100%' }} />
          {b.caption && <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, textAlign: 'center' }}>{b.caption}</figcaption>}
        </figure>
      );

    case 'image':
      return (
        <figure style={{ margin: '16px 0' }}>
          <img src={b.url} alt={b.caption || ''} style={{ maxWidth: '100%', borderRadius: 10 }} />
          {b.caption && <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, textAlign: 'center' }}>{b.caption}</figcaption>}
        </figure>
      );

    case 'code':
      return (
        <div style={{ margin: '12px 0' }}>
          {b.note && <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 6px' }}>{b.note}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--purple)', color: '#fff', fontWeight: 600 }}>{b.language || 'code'}</span>
          </div>
          <pre style={{ margin: 0 }}><code>{b.code}</code></pre>
        </div>
      );

    case 'example':
      return (
        <div className="callout realworld">
          {b.title && <div className="title">{b.title}</div>}
          <RichHtml html={b.html} text={b.text} />
        </div>
      );

    // ── NEW RICH BLOCK TYPES ──────────────────────────────────────

    case 'analogy':
      return (
        <div className="callout tip" style={{ borderLeft: '4px solid #ffd60a', margin: '10px 0' }}>
          <div className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <span>Analogy: <strong>{b.concept}</strong></span>
          </div>
          <div style={{ marginTop: 8 }}>
            <em style={{ color: '#ffd60a' }}>Think of it like: </em>{b.analogy}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)' }}>{b.explanation}</div>
        </div>
      );

    case 'mistake':
      return (
        <div className="callout warning" style={{ margin: '8px 0' }}>
          <div className="title" style={{ display: 'flex', gap: 8 }}>
            <span>⚠️ Mistake:</span>
            <span style={{ fontStyle: 'italic' }}>{b.mistake}</span>
          </div>
          <div style={{ marginTop: 8, display: 'grid', gap: 4 }}>
            <div><span style={{ color: '#ef4444', fontWeight: 600 }}>Why it happens: </span>{b.why}</div>
            <div><span style={{ color: '#22c55e', fontWeight: 600 }}>✅ Fix: </span>{b.fix}</div>
          </div>
        </div>
      );

    case 'troubleshoot':
      return (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', margin: '8px 0' }}>
          <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>🔴 Problem: {b.problem}</div>
          <div style={{ marginBottom: 4, fontSize: 13 }}><span style={{ color: 'var(--muted)', fontWeight: 600 }}>Cause: </span>{b.cause}</div>
          <div style={{ fontSize: 13 }}><span style={{ color: '#22c55e', fontWeight: 600 }}>🛠 Fix: </span>{b.fix}</div>
        </div>
      );

    case 'activity':
      return (
        <div style={{ border: '1px solid var(--purple)', borderRadius: 12, padding: 16, margin: '12px 0', background: 'rgba(99,102,241,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>🔧 {b.title}</div>
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--purple)', color: '#fff' }}>⏱ {b.duration}</span>
          </div>
          {b.materials && b.materials.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Materials Needed:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {b.materials.map((m, i) => (
                  <span key={i} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)' }}>{m}</span>
                ))}
              </div>
            </div>
          )}
          {b.steps && b.steps.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Steps:</div>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {b.steps.map((s, i) => <li key={i} style={{ marginBottom: 4, lineHeight: 1.6, fontSize: 13 }}>{s}</li>)}
              </ol>
            </div>
          )}
          {b.expected && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>✅ Expected Result: </span>
              <span style={{ fontSize: 13 }}>{b.expected}</span>
            </div>
          )}
        </div>
      );

    case 'miniproject':
      return (
        <div style={{ border: '2px solid var(--green)', borderRadius: 14, padding: 18, margin: '14px 0', background: 'rgba(6,214,160,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>🚀 Mini Project</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{b.title}</div>
            </div>
            <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, background: 'var(--green)', color: '#000', fontWeight: 700 }}>⏱ {b.time}</span>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6 }}>{b.description}</p>
          {b.materials && b.materials.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>🛒 Materials:</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {b.materials.map((m, i) => <li key={i} style={{ fontSize: 13, marginBottom: 2 }}>{m}</li>)}
              </ul>
            </div>
          )}
          {b.steps && b.steps.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>📋 Build Steps:</div>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {b.steps.map((s, i) => <li key={i} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.6 }}>{s}</li>)}
              </ol>
            </div>
          )}
          {b.expectedOutput && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(6,214,160,0.12)', marginBottom: 10 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>🎯 Expected Output: </span>
              <span style={{ fontSize: 13 }}>{b.expectedOutput}</span>
            </div>
          )}
          {b.extensions && b.extensions.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>⚡ Level Up (Extensions):</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {b.extensions.map((e, i) => <li key={i} style={{ fontSize: 13, marginBottom: 2, color: 'var(--purple)' }}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      );

    case 'industry':
      return (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(67,97,238,0.08)', border: '1px solid rgba(67,97,238,0.3)', margin: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🏭</span>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{b.company}</div>
          </div>
          <div style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>{b.useCase}</div>
          <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>📈 Impact: {b.impact}</div>
        </div>
      );

    case 'quiz':
      return <InlineQuiz questions={b.questions || []} />;

    case 'audio':
      return (
        <figure style={{ margin: '16px 0' }}>
          <audio controls src={b.url} style={{ width: '100%' }} />
          {b.caption && <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{b.caption}</figcaption>}
        </figure>
      );

    case 'video':
      return (
        <figure style={{ margin: '16px 0' }}>
          <video controls src={b.url} style={{ width: '100%', maxHeight: 480, borderRadius: 10 }} />
          {b.caption && <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{b.caption}</figcaption>}
        </figure>
      );

    case 'attachment':
      return (
        <p style={{ margin: '12px 0' }}>
          <a href={b.url} download={b.name} className="rte-attachment" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
            📎 {b.name || 'Download attachment'}
          </a>
        </p>
      );

    case 'canvas':
      return (
        <figure style={{ margin: '16px 0' }}>
          <img src={b.url} alt={b.caption || 'Drawing'} style={{ maxWidth: '100%', borderRadius: 10, border: '1px solid var(--border)' }} />
          {b.caption && <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, textAlign: 'center' }}>{b.caption}</figcaption>}
        </figure>
      );

    case 'table':
      return <RichHtml html={b.html} style={{ margin: '12px 0', overflowX: 'auto' }} />;

    default:
      return b.text ? <p style={{ lineHeight: 1.75 }}>{b.text}</p> : null;
  }
}

function InlineQuiz({ questions }: { questions: QuizQ[] }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, string>>({});

  if (!questions.length) return null;

  return (
    <div style={{ margin: '14px 0', padding: '14px 16px', background: 'rgba(255,214,10,0.05)', borderRadius: 12, border: '1px solid rgba(255,214,10,0.25)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#ffd60a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        ✅ Check Your Understanding
      </div>
      {questions.map((q, qi) => {
        const isRev = revealed[qi];
        const sel = selected[qi];
        const isCorrect = sel === q.answer;
        return (
          <div key={qi} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>
              <span style={{ color: '#ffd60a', marginRight: 6 }}>Q{qi + 1}.</span>{q.prompt}
            </div>
            {q.options && q.options.length > 0 ? (
              <div style={{ display: 'grid', gap: 6 }}>
                {q.options.map((opt, oi) => {
                  let bg = 'rgba(255,255,255,0.05)';
                  let border = '1px solid var(--border)';
                  let color = 'inherit';
                  if (isRev) {
                    if (opt === q.answer) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; color = '#22c55e'; }
                    else if (opt === sel) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; color = '#ef4444'; }
                  } else if (opt === sel) {
                    bg = 'rgba(99,102,241,0.15)'; border = '1px solid var(--purple)';
                  }
                  return (
                    <div
                      key={oi}
                      onClick={() => !isRev && setSelected((s) => ({ ...s, [qi]: opt }))}
                      style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, cursor: isRev ? 'default' : 'pointer', background: bg, border, color, transition: 'all 0.15s' }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
                Open-ended question — reflect and write in your notebook.
              </div>
            )}
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              {!isRev && (q.answer || q.options?.length) && (
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [qi]: true }))}
                  style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(255,214,10,0.4)', background: 'transparent', color: '#ffd60a', cursor: 'pointer' }}
                >
                  Reveal Answer
                </button>
              )}
              {isRev && q.answer && (
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>Answer: </span>{q.answer}
                  {sel && !isCorrect && <span style={{ color: '#ef4444', marginLeft: 8 }}>❌</span>}
                  {sel && isCorrect && <span style={{ color: '#22c55e', marginLeft: 8 }}>✓</span>}
                </div>
              )}
            </div>
            {isRev && q.explanation && (
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                💬 {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
