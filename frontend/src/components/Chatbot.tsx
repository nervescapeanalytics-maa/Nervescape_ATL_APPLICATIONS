import { useEffect, useRef, useState } from 'react';
import { apiGet, apiPost } from '../api';

interface Msg { role: 'user' | 'assistant'; content: string; }

export default function Chatbot({ chapterId, chapterTitle }: { chapterId?: number | null; chapterTitle?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    apiGet<{ messages: Msg[] }>(`/student/chat/${chapterId ?? ''}`)
      .then((r) => setMsgs(r.messages))
      .catch(() => {});
  }, [open, chapterId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);

  async function send() {
    const message = text.trim();
    if (!message || busy) return;
    setText('');
    setMsgs((m) => [...m, { role: 'user', content: message }]);
    setBusy(true);
    try {
      const r = await apiPost<{ answer: string }>('/student/chat', { chapter_id: chapterId ?? null, message });
      setMsgs((m) => [...m, { role: 'assistant', content: r.answer }]);
    } catch (e: any) {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Sorry, I could not answer right now. Please try again.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} title="Ask the AI tutor">
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className="card chat-panel">
          <div className="pad" style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
            <b>AI Doubt Solver</b>
            <div className="muted" style={{ fontSize: 12 }}>
              {chapterTitle ? `Context: ${chapterTitle}` : 'Ask anything about your lessons'}
            </div>
          </div>
          <div className="chat-msgs">
            {msgs.length === 0 && (
              <div className="bubble assistant">Hi! I'm your AI tutor 🤖. Ask me to explain a concept, give a hint, or clear a doubt!</div>
            )}
            {msgs.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.content}</div>)}
            {busy && <div className="bubble assistant">…thinking</div>}
            <div ref={endRef} />
          </div>
          <div className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type your doubt…"
            />
            <button className="btn sm" onClick={send} disabled={busy}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
