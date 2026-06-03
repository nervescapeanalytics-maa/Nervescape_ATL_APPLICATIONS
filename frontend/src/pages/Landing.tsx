import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../auth';
import { apiPost } from '../api';
import { PROGRAMS, IMG } from '../data/programs';
import Logo from '../components/Logo';
import SiteFooter from '../components/SiteFooter';

const ROLES: { key: Role; label: string; emoji: string; blurb: string }[] = [
  { key: 'admin', label: 'Admin Portal', emoji: '🛡️', blurb: 'Schools, users, courses, labs & operations' },
  { key: 'teacher', label: 'Teacher Portal', emoji: '👩‍🏫', blurb: 'Classes, AI quizzes, assignments & analytics' },
  { key: 'student', label: 'Student Portal', emoji: '🎒', blurb: 'Robotics, projects, AI assessments & mentors' },
];

const DEMO: Record<Role, { id: string; pw: string }> = {
  admin: { id: 'admin@lms.local', pw: 'Admin@123' },
  teacher: { id: 'teacher6@lms.local', pw: 'Teacher@123' },
  student: { id: 'student61@lms.local', pw: 'Student@123' },
};

const WHY = [
  { t: 'Computational Thinking', d: 'Decompose complex problems, find patterns, abstract elegantly and build robust algorithms in every chapter.', i: '🧠', img: '1518186285589-2f7649de83e0' },
  { t: 'Logical Reasoning Engine', d: 'Brain teasers and logic puzzles that train sharp, structured, founder-grade thinking.', i: '🔍', img: '1456513080510-7bf3a84b82f8' },
  { t: 'AI-Powered Mentor', d: 'An always-on, context-aware chatbot delivering doubts, hints and personalised guidance 24×7.', i: '🤖', img: '1677442136019-21780ecad995' },
  { t: 'Tinkering Challenges', d: 'Hands-on, project-based learning aligned to ATL labs — prototype like a maker, ship like an engineer.', i: '🛠', img: '1581091226825-a6a2a5aee158' },
  { t: 'Wired Admin → Teacher → Student', d: 'Every role connected with live progress tracking, deep analytics and frictionless workflows.', i: '🔗', img: '1551288049-bebda4e38f71' },
  { t: 'Gamified Mastery', d: 'XP, leaderboards and innovation scores keep learners hooked and consistently outperforming.', i: '🏆', img: '1552664730-d307ca884978' },
];

// Landing stats, journey steps and testimonials
const STATS = [
  { n: '700+', l: 'Curriculum chapters' },
  { n: '8', l: 'Innovation tracks' },
  { n: '24×7', l: 'AI mentor' },
  { n: '6–12', l: 'Classes served' },
];
const STEPS = [
  { n: '01', i: '🧭', t: 'Pick your track', d: 'Choose from eight hands-on programs — robotics, IoT, AI/ML, 3D fabrication, entrepreneurship and more.', img: '1581092580497-e0d23cbdf1dc' },
  { n: '02', i: '🛠', t: 'Learn by building', d: 'Work through bite-sized chapters with live circuits, code and projects aligned to ATL outcomes.', img: '1581091226825-a6a2a5aee158' },
  { n: '03', i: '🤖', t: 'Get AI mentorship', d: 'A 24×7 context-aware mentor gives hints, explanations and instant feedback whenever you are stuck.', img: '1677442136019-21780ecad995' },
  { n: '04', i: '🏆', t: 'Ship & compete', d: 'Submit projects, climb the leaderboard and earn XP as teachers and admins track your growth live.', img: '1552664730-d307ca884978' },
];
const TESTIMONIALS = [
  { q: 'Our students went from never touching a breadboard to building autonomous robots in a single term. The platform makes innovation feel inevitable.', n: 'Anjali Mehta', r: 'ATL In-charge, Delhi Public School', a: '👩‍🏫' },
  { q: 'The AI mentor answers doubts at midnight better than I expected. My class engagement has never been higher.', n: 'Rohan Verma', r: 'STEM Teacher, Bengaluru', a: '👨‍🏫' },
  { q: 'As a principal I finally have live visibility into every learner. The Admin → Teacher → Student wiring is brilliant.', n: 'S. Krishnan', r: 'Principal, Chennai', a: '🧑‍💼' },
];

// Curriculum highlighted in the hero message
const CURRICULUM = [
  { i: '💡', t: 'Design thinking & problem framing' },
  { i: '🔌', t: 'Basic electronics & breadboarding' },
  { i: '🎛️', t: 'Sensors, Arduino, microcontrollers' },
  { i: '🤖', t: 'Robotics (line-follower, obstacle-avoider)' },
  { i: '🖨️', t: '3D modelling (Tinkercad, CollabCAD) & 3D printing' },
  { i: '🌐', t: 'IoT and AIoT integration' },
  { i: '🧠', t: 'AI/ML basics, computer vision starters' },
  { i: '🚀', t: 'Entrepreneurship (Tinkerpreneur projects)' },
];

// Quick prompt suggestions for the public AI mentor
const MENTOR_SUGGESTIONS = [
  'What programs do you offer?',
  'How does the AI mentor help students?',
  'Which class should a 7th grader start with?',
  'How do I get started?',
];

type MentorMsg = { role: 'user' | 'bot'; text: string };

function PublicMentor({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<MentorMsg[]>([
    { role: 'bot', text: "Hi! I'm Nerve 🤖 — your guide to the Nervescape ATL, Robotics & STEM platform. Ask me anything about our programs or how to get started!" },
  ]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  async function send(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    setText('');
    setMsgs((m) => [...m, { role: 'user', text: question }]);
    setBusy(true);
    try {
      const r = await apiPost<{ answer: string }>('/public/chat', { message: question });
      setMsgs((m) => [...m, { role: 'bot', text: r.answer }]);
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: 'Sorry, I had trouble responding just now. Please try again in a moment.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pm-panel" role="dialog" aria-label="AI mentor chat">
      <div className="pm-head">
        <div className="pm-head-title"><span className="pm-avatar">🤖</span>
          <div><strong>AI Mentor</strong><small>Online · 24×7</small></div>
        </div>
        <button className="pm-close" aria-label="Close chat" onClick={onClose}>×</button>
      </div>
      <div className="pm-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`pm-msg ${m.role}`}>{m.text}</div>
        ))}
        {busy && <div className="pm-msg bot pm-typing"><span /><span /><span /></div>}
        {msgs.length <= 1 && !busy && (
          <div className="pm-suggest">
            {MENTOR_SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>
      <form className="pm-input" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about our programs…" aria-label="Message" />
        <button type="submit" disabled={busy || !text.trim()} aria-label="Send">➤</button>
      </form>
    </div>
  );
}

// Premium full-bleed hero carousel slides
const SLIDES = [
  {
    tag: 'Atal Tinkering Lab',
    kicker: 'Welcome to Nervescape',
    t: 'Where Curious Minds Become Makers',
    d: 'A complete, hands-on innovation journey for Classes 6–12 — design, build and ship real projects with an AI mentor by your side every step of the way.',
    img: '1581091226825-a6a2a5aee158',
    g: 'linear-gradient(115deg,rgba(8,15,32,0.92) 8%,rgba(13,38,76,0.78) 48%,rgba(13,38,76,0.25) 100%)',
    points: [
      { i: '💡', t: 'Design thinking & problem framing' },
      { i: '🧭', t: 'Computational & logical reasoning' },
      { i: '🛠️', t: 'Hands-on ATL tinkering challenges' },
      { i: '🤖', t: '24×7 AI mentor & instant feedback' },
      { i: '🏆', t: 'XP, badges & live leaderboards' },
      { i: '🔗', t: 'Admin → Teacher → Student wired' },
    ],
  },
  {
    tag: 'Robotics',
    kicker: 'Build machines that think',
    t: 'Robots & Autonomous Systems',
    d: 'Construct line-followers, obstacle-avoiders and robotic arms that sense the world, make decisions and move entirely on their own.',
    img: '1535378917042-10a22c95931a',
    g: 'linear-gradient(115deg,rgba(8,15,32,0.92) 8%,rgba(76,5,25,0.72) 48%,rgba(76,5,25,0.2) 100%)',
    points: [
      { i: '🔌', t: 'Electronics & breadboarding' },
      { i: '🎛️', t: 'Sensors, Arduino & microcontrollers' },
      { i: '🤖', t: 'Line-follower & obstacle-avoider bots' },
      { i: '🦾', t: 'Servo-driven robotic arms' },
      { i: '⚙️', t: 'Motor drivers & motion control' },
      { i: '🔍', t: 'Debugging & iterative building' },
    ],
  },
  {
    tag: 'AI · IoT · ML',
    kicker: 'Real-world intelligence',
    t: 'Teach Machines to Learn & Connect',
    d: 'Train no-code AI models, wire smart IoT devices to the cloud and bring edge intelligence to everyday objects with industry-grade tooling.',
    img: '1620712943543-bcc4688e7485',
    g: 'linear-gradient(115deg,rgba(8,15,32,0.92) 8%,rgba(46,16,101,0.74) 48%,rgba(46,16,101,0.2) 100%)',
    points: [
      { i: '🧠', t: 'AI/ML basics, no-code model training' },
      { i: '👁️', t: 'Computer vision starters' },
      { i: '🌐', t: 'IoT & AIoT cloud integration' },
      { i: '📡', t: 'Smart sensors & data pipelines' },
      { i: '📊', t: 'Dashboards & live telemetry' },
      { i: '⚡', t: 'Edge intelligence on devices' },
    ],
  },
  {
    tag: 'Tinkerpreneur',
    kicker: 'From idea to impact',
    t: 'Innovate, Pitch & Launch',
    d: 'Turn prototypes into real student-led ventures — design with purpose, pitch with confidence and compete on a live national-style leaderboard.',
    img: '1556761175-5973dc0f32e7',
    g: 'linear-gradient(115deg,rgba(8,15,32,0.92) 8%,rgba(6,78,59,0.72) 48%,rgba(6,78,59,0.2) 100%)',
    points: [
      { i: '💡', t: 'Idea validation & problem-solution fit' },
      { i: '🖨️', t: '3D modelling & rapid prototyping' },
      { i: '🎤', t: 'Pitch decks & storytelling' },
      { i: '💰', t: 'Business model & costing basics' },
      { i: '🚀', t: 'Student-led venture projects' },
      { i: '🏆', t: 'National-style competition' },
    ],
  },
];

function HeroCarousel({ onExplore }: { onExplore: () => void }) {
  const [idx, setIdx] = useState(0);
  const go = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hc">
      {SLIDES.map((s, i) => (
        <div
          key={s.t}
          className={`hc-slide ${i === idx ? 'is-active' : ''}`}
          style={{ backgroundImage: `${s.g}, url(${IMG(s.img, 1800)})` }}
          aria-hidden={i !== idx}
        >
          <div className="hc-inner">
            <span className="hc-kicker">⚡ {s.kicker}</span>
            <span className="hc-tag">{s.tag}</span>
            <h1>{s.t}</h1>
            <p>{s.d}</p>
            <div className="hc-cta">
              <button className="rb-hero-cta primary" onClick={onExplore}>Explore programs →</button>
              <a className="rb-hero-cta ghost" href="#why">Why Nervescape</a>
            </div>
            <ul className="hc-chips">
              {s.points.map((c) => (
                <li key={c.t}><span>{c.i}</span>{c.t}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <span className="hc-orb hc-orb-a" aria-hidden="true" />
      <span className="hc-orb hc-orb-b" aria-hidden="true" />

      <button className="hc-arrow prev" aria-label="Previous slide" onClick={() => go(idx - 1)}>‹</button>
      <button className="hc-arrow next" aria-label="Next slide" onClick={() => go(idx + 1)}>›</button>

      <div className="hc-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.t}
            aria-label={`Go to slide ${i + 1}`}
            className={i === idx ? 'on' : ''}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}


export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [identifier, setId] = useState('');
  const [password, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setErr(''); setBusy(true);
    try { await login(identifier.trim(), password, role); }
    catch (e: any) { setErr(e.message || 'Login failed'); }
    finally { setBusy(false); }
  }
  function pick(r: Role) { setRole(r); setErr(''); setId(DEMO[r].id); setPw(DEMO[r].pw); }
  function openLogin() { setShowLogin(true); setRole(null); }

  return (
    <div className="landing">
      {/* nav */}
      <header className="rb-nav">
        <div className="rb-nav-inner">
          <div className="rb-logo">
            <Logo size={36} style={{ marginRight: 10 }} />
            <span>Nerve<b>scape</b><small>ANALYTICS</small></span>
          </div>
          <nav className="rb-nav-links">
            <a href="#home">Home</a>
            <a onClick={() => navigate('/programs')}>Programs</a>
            <a href="#why">Why Nervescape</a>
            <a onClick={() => navigate('/about')}>About Us</a>
            <a onClick={() => navigate('/contact')}>Contact</a>
            <a onClick={openLogin}>Sign in</a>
          </nav>
        </div>
      </header>

      {/* hero — premium full-width carousel */}
      <section id="home" className="rb-hero2">
        <HeroCarousel onExplore={() => navigate('/programs')} />
      </section>

      {/* programs */}
      <section id="programs" className="rb-section">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">What you will master</span>
            <h2>End-to-end Technology &amp; Innovation Programs</h2>
            <p>From your first circuit to your first startup pitch — a complete maker journey for Classes 6–12.</p>
          </div>
          <div className="rb-topic-grid">
            {PROGRAMS.map((tp) => (
              <article key={tp.slug} className="rb-topic" onClick={() => navigate(`/programs/${tp.slug}`)}>
                <div className="rb-topic-img"><img loading="lazy" src={IMG(tp.img)} alt={tp.title} /><span className="rb-topic-tag">{tp.tag}</span></div>
                <div className="rb-topic-body"><h3>{tp.title}</h3><p>{tp.short}</p><button className="rb-topic-btn" onClick={(e) => { e.stopPropagation(); navigate(`/programs/${tp.slug}`); }}>Explore →</button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* why us */}
      <section id="why" className="rb-section alt">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">Why Nervescape</span>
            <h2>The premium edge — powerful, intelligent, beautifully connected</h2>
            <p>A platform engineered for outcomes: every learner sharper, every teacher empowered, every administrator in command.</p>
          </div>
          <div className="rb-why-grid">
            {WHY.map((w) => (
              <article key={w.t} className="rb-why" style={{ ['--why-img' as any]: `url(${IMG(w.img, 800)})` }}>
                <div className="rb-why-media" aria-hidden="true" />
                <div className="rb-why-body">
                  <div className="rb-why-icon">{w.i}</div>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* stats band */}
      <section className="rb-stats">
        <div className="rb-stats-inner">
          {STATS.map((s) => (
            <div key={s.l} className="rb-stat"><b>{s.n}</b><span>{s.l}</span></div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="rb-section">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">How it works</span>
            <h2>From curious beginner to confident innovator</h2>
            <p>A guided, four-step journey that turns every learner into a maker.</p>
          </div>
          <div className="rb-steps">
            {STEPS.map((s) => (
              <article key={s.n} className="rb-step">
                <div className="rb-step-img">
                  <img loading="lazy" src={IMG(s.img, 600)} alt={s.t} />
                  <span className="rb-step-n">{s.n}</span>
                  <span className="rb-step-ico">{s.i}</span>
                </div>
                <div className="rb-step-body">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="rb-section alt">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">Loved by schools</span>
            <h2>Educators and leaders trust Nervescape</h2>
            <p>Real outcomes from the classrooms already building the future.</p>
          </div>
          <div className="rb-tst-grid">
            {TESTIMONIALS.map((t) => (
              <article key={t.n} className="rb-tst">
                <div className="rb-tst-stars">★★★★★</div>
                <p>“{t.q}”</p>
                <div className="rb-tst-by"><span className="rb-tst-av">{t.a}</span><div><b>{t.n}</b><small>{t.r}</small></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="rb-cta-band">
        <div className="rb-cta-inner">
          <h2>Ready to build the future?</h2>
          <p>Bring a world-class Atal Tinkering Lab experience to your students today.</p>
          <div className="rb-cta-actions">
            <button className="rb-hero-cta primary" onClick={() => navigate('/programs')}>Explore programs →</button>
            <button className="rb-hero-cta ghost" onClick={() => navigate('/contact')}>Contact us</button>
          </div>
        </div>
      </section>

      {/* footer */}
      <SiteFooter />

      {/* floating AI mentor badge (bottom-right) */}
      <button className="rb-mentor-badge" onClick={() => setMentorOpen((o) => !o)}>
        <span className="rb-mentor-dot" />🤖 24×7 AI mentor
      </button>
      {mentorOpen && <PublicMentor onClose={() => setMentorOpen(false)} />}

      {/* login modal — premium split panel */}
      {showLogin && (
        <div className="modal-bg" onClick={() => setShowLogin(false)}>
          <div className="lm-panel" onClick={(e) => e.stopPropagation()}>
            {/* left: branding */}
            <div className="lm-left">
              <div className="lm-brand"><Logo size={40} style={{ marginBottom: 10 }} /><br/>Nerve<b>scape</b><br/><small>ANALYTICS</small></div>
              <p className="lm-tagline">The next-generation ATL, Robotics &amp; STEM platform for Classes 6–12.</p>
              <ul className="lm-perks">
                <li><span>🤖</span> AI-powered 24×7 mentor</li>
                <li><span>📊</span> Live analytics for every role</li>
                <li><span>🎯</span> Adaptive quizzes &amp; challenges</li>
                <li><span>🔗</span> Admin → Teacher → Student, wired</li>
                <li><span>🏆</span> Gamified XP &amp; leaderboards</li>
              </ul>
              <div className="lm-stats">
                <div><b>700+</b><span>Chapters</span></div>
                <div><b>3</b><span>Classes</span></div>
                <div><b>∞</b><span>AI tokens</span></div>
              </div>
            </div>
            {/* right: form */}
            <div className="lm-right">
              <button className="modal-x" onClick={() => setShowLogin(false)}>✕</button>
              {!role ? (
                <>
                  <h2 className="lm-title">Sign in to your portal</h2>
                  <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>Choose your role to continue</p>
                  <div className="lm-roles">
                    {ROLES.map((r) => (
                      <button key={r.key} className="lm-role" onClick={() => pick(r.key)}>
                        <span className="lm-role-ico">{r.emoji}</span>
                        <div><b>{r.label}</b><br/><small className="muted">{r.blurb}</small></div>
                        <span className="lm-role-arr">›</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="lm-back">
                    <button className="btn ghost sm" onClick={() => setRole(null)}>← Back</button>
                    <span className="lm-role-badge">{ROLES.find(x => x.key === role)!.emoji} {ROLES.find(x => x.key === role)!.label}</span>
                  </div>
                  <h2 className="lm-title">Welcome back!</h2>
                  <form onSubmit={submit} style={{ marginTop: 20 }}>
                    {err && <div className="err" style={{ marginBottom: 12 }}>{err}</div>}
                    <div className="field"><label>Email or Username</label><input value={identifier} onChange={(e) => setId(e.target.value)} autoFocus required /></div>
                    <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPw(e.target.value)} required /></div>
                    <button className="btn lg" style={{ width: '100%', marginTop: 8 }} disabled={busy}>{busy ? 'Signing in…' : `Sign in →`}</button>
                    <div className="demo"><b>Demo:</b> {DEMO[role].id} / {DEMO[role].pw}</div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
