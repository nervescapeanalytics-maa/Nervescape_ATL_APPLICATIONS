import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api';
import Blocks, { Block } from '../components/Blocks';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../auth';

interface Question {
  id: number; qtype: string; prompt: string; options: string[]; difficulty: string; points: number;
}

export default function ChapterView() {
  const { id } = useParams();
  const cid = Number(id);
  const nav = useNavigate();
  const { logout } = useAuth();
  const [chapter, setChapter] = useState<any>(null);
  const [facts, setFacts] = useState<{ id: number; text: string }[]>([]);
  const [tab, setTab] = useState<'read' | 'quiz' | 'challenges'>('read');

  useEffect(() => {
    apiGet(`/content/chapters/${cid}`).then((r: any) => { setChapter(r.chapter); setFacts(r.facts); }).catch(() => {});
    apiPost('/student/progress', { chapter_id: cid, status: 'in_progress' }).catch(() => {});
  }, [cid]);

  if (!chapter) return <div className="spinner" />;
  const blocks: Block[] = Array.isArray(chapter.content) ? chapter.content : [];

  return (
    <div>
      <div className="topbar">
        <div className="inner">
          <button className="btn ghost sm" onClick={() => nav('/student')}>← Back</button>
          <div className="logo">Tinker<span>Verse</span></div>
          <button className="btn ghost sm" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="container">
        <div className="card pad">
          <div className="muted" style={{ fontSize: 13 }}>{chapter.grade_name} · {chapter.module_title}</div>
          <h1 style={{ margin: '6px 0' }}>{chapter.title}</h1>
          <div className="row wrap">
            <span className={`tag ${chapter.difficulty}`}>{chapter.difficulty}</span>
            <span className="muted">⏱ {chapter.est_minutes} min</span>
          </div>
          <p className="muted">{chapter.summary}</p>
          <div className="nav" style={{ marginTop: 8 }}>
            <button className={tab === 'read' ? 'active' : ''} onClick={() => setTab('read')}>📖 Learn</button>
            <button className={tab === 'quiz' ? 'active' : ''} onClick={() => setTab('quiz')}>🧠 AI Quiz</button>
            <button className={tab === 'challenges' ? 'active' : ''} onClick={() => setTab('challenges')}>🏗 Challenges</button>
          </div>
        </div>

        {tab === 'read' && (
          <div className="grid" style={{ marginTop: 16 }}>
            <div className="card pad"><Blocks blocks={blocks} /></div>
            {facts.length > 0 && (
              <div className="card pad">
                <h2 style={{ marginTop: 0 }}>💡 Did you know?</h2>
                <ul>{facts.map((f) => <li key={f.id} style={{ lineHeight: 1.8 }}>{f.text}</li>)}</ul>
              </div>
            )}
          </div>
        )}
        {tab === 'quiz' && <Quiz cid={cid} />}
        {tab === 'challenges' && <Challenges cid={cid} />}
      </div>
      <Chatbot chapterId={cid} chapterTitle={chapter.title} />
    </div>
  );
}

function Quiz({ cid }: { cid: number }) {
  const [qs, setQs] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    apiGet<{ questions: Question[] }>(`/content/chapters/${cid}/questions?type=mcq`).then((r) => setQs(r.questions)).catch(() => {});
  }, [cid]);

  const detailMap = useMemo(() => {
    const m: Record<number, any> = {};
    (result?.details || []).forEach((d: any) => { m[d.question_id] = d; });
    return m;
  }, [result]);

  async function submit() {
    const payload = Object.entries(answers).map(([qid, response]) => ({ question_id: Number(qid), response }));
    if (!payload.length) return;
    const r = await apiPost('/student/quiz/submit', { chapter_id: cid, answers: payload });
    setResult(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (qs.length === 0) return <div className="card pad" style={{ marginTop: 16 }}>No MCQ quiz yet for this chapter.</div>;

  return (
    <div style={{ marginTop: 16 }}>
      {result && (
        <div className="card pad" style={{ marginBottom: 12, borderColor: 'var(--green)' }}>
          <h2 style={{ marginTop: 0 }}>Score: {result.percent}% ({result.score}/{result.total} pts)</h2>
          <div className="muted">{result.percent >= 80 ? '🏆 GOAT performance! ' : result.percent >= 50 ? '👍 Good — review and retry to top it!' : '💪 Keep going — review the explanations below.'}</div>
        </div>
      )}
      {qs.map((q, i) => {
        const d = detailMap[q.id];
        return (
          <div key={q.id} className="card q-card">
            <div className="row between">
              <b>Q{i + 1}. {q.prompt}</b>
              <span className={`tag ${q.difficulty}`}>{q.difficulty}</span>
            </div>
            {q.options.map((opt) => {
              const sel = answers[q.id] === opt;
              let cls = 'opt' + (sel ? ' sel' : '');
              if (d) {
                if (opt === d.correctAnswer) cls = 'opt correct';
                else if (sel && !d.correct) cls = 'opt wrong';
              }
              return (
                <div key={opt} className={cls} onClick={() => !result && setAnswers((a) => ({ ...a, [q.id]: opt }))}>
                  {opt}
                </div>
              );
            })}
            {d && <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>💬 {d.explanation}</div>}
          </div>
        );
      })}
      {!result && <button className="btn green" onClick={submit} disabled={Object.keys(answers).length === 0}>Submit Quiz</button>}
      {result && <button className="btn ghost" onClick={() => { setResult(null); setAnswers({}); }}>Retry</button>}
    </div>
  );
}

function Challenges({ cid }: { cid: number }) {
  const [qs, setQs] = useState<Question[]>([]);
  useEffect(() => {
    Promise.all([
      apiGet<{ questions: Question[] }>(`/content/chapters/${cid}/questions?type=brain_teaser`),
      apiGet<{ questions: Question[] }>(`/content/chapters/${cid}/questions?type=tinkering`),
      apiGet<{ questions: Question[] }>(`/content/chapters/${cid}/questions?type=logical`),
      apiGet<{ questions: Question[] }>(`/content/chapters/${cid}/questions?type=computational`),
    ]).then((rs) => setQs(rs.flatMap((r) => r.questions))).catch(() => {});
  }, [cid]);

  if (qs.length === 0) return <div className="card pad" style={{ marginTop: 16 }}>No challenges yet for this chapter.</div>;
  return (
    <div className="grid" style={{ marginTop: 16 }}>
      {qs.map((q) => <ChallengeCard key={q.id} cid={cid} q={q} />)}
    </div>
  );
}

const LABELS: Record<string, string> = { brain_teaser: '🧩 Brain Teaser', tinkering: '🏗 Tinkering Challenge', logical: '🔎 Logical Thinking', computational: '🧮 Computational Thinking' };

function ChallengeCard({ cid, q }: { cid: number; q: Question }) {
  const [resp, setResp] = useState('');
  const [fb, setFb] = useState<{ feedback: string; score: number } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!resp.trim()) return;
    setBusy(true);
    try {
      const r = await apiPost<{ feedback: string; score: number }>('/student/challenge/submit', {
        chapter_id: cid, qtype: q.qtype, prompt: q.prompt, response: resp,
      });
      setFb(r);
    } finally { setBusy(false); }
  }

  return (
    <div className="card pad">
      <span className="pill">{LABELS[q.qtype] || q.qtype}</span>
      <p style={{ fontWeight: 600 }}>{q.prompt}</p>
      <textarea rows={3} value={resp} onChange={(e) => setResp(e.target.value)} placeholder="Type your idea / solution…" />
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn sm" onClick={submit} disabled={busy}>{busy ? 'Evaluating…' : 'Submit for AI feedback'}</button>
      </div>
      {fb && (
        <div className="callout logic" style={{ marginTop: 10 }}>
          <div className="title">🤖 AI Feedback · Score {fb.score}/10</div>
          <div>{fb.feedback}</div>
        </div>
      )}
    </div>
  );
}
