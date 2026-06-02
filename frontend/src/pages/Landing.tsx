import { useState, useEffect } from 'react';
import { useAuth, Role } from '../auth';

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

const IMG = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

const TOPICS = [
  { t: 'Robotics & Autonomous Systems', d: 'Design line-followers, robotic arms and intelligent autonomous machines.', img: '1485827404703-89b55fcc595e', tag: 'Robotics' },
  { t: 'STEM Labs & Innovation', d: 'World-class hands-on labs for inquiry, experimentation and engineering.', img: '1581091226825-a6a2a5aee158', tag: 'STEM' },
  { t: 'IoT & AIoT Integration', d: 'Connect devices to the cloud, add edge intelligence and build smart systems.', img: '1518770660439-4636190af475', tag: 'IoT' },
  { t: 'Electronics & Breadboarding', d: 'Build live circuits and master current, voltage and components from scratch.', img: '1597852074816-d933c7d2b988', tag: 'Electronics' },
  { t: 'Sensors, Arduino & Microcontrollers', d: 'Program the brains of machines to sense and react to the real world.', img: '1553406830-ef2513450d76', tag: 'Embedded' },
  { t: '3D Modelling & Fabrication', d: 'Turn premium-grade ideas into printable physical objects, layer by layer.', img: '1631467018858-d7a0fa45c842', tag: 'Fabrication' },
  { t: 'AI / ML Foundations', d: 'Teach machines to learn, classify and see — with industry-grade tooling.', img: '1677442136019-21780ecad995', tag: 'AI' },
  { t: 'Entrepreneurship & Tinkerpreneur', d: 'Take innovation to market: pitch, prototype and present like a founder.', img: '1556761175-5973dc0f32e7', tag: 'Startup' },
];

const WHY = [
  { t: 'Computational Thinking', d: 'Decompose complex problems, find patterns, abstract elegantly and build robust algorithms in every chapter.', i: '🧠' },
  { t: 'Logical Reasoning Engine', d: 'Brain teasers and logic puzzles that train sharp, structured, founder-grade thinking.', i: '🔍' },
  { t: 'AI-Powered Mentor', d: 'An always-on, context-aware chatbot delivering doubts, hints and personalised guidance 24×7.', i: '🤖' },
  { t: 'Tinkering Challenges', d: 'Hands-on, project-based learning aligned to ATL labs — prototype like a maker, ship like an engineer.', i: '🛠' },
  { t: 'Wired Admin → Teacher → Student', d: 'Every role connected with live progress tracking, deep analytics and frictionless workflows.', i: '🔗' },
  { t: 'Gamified Mastery', d: 'XP, leaderboards and innovation scores keep learners hooked and consistently outperforming.', i: '🏆' },
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

// Live, auto-advancing hero slides
const SLIDES = [
  { tag: 'Robotics', t: 'Line-follower & obstacle-avoider bots', d: 'Program autonomous machines that sense, decide and move on their own.', img: '1485827404703-89b55fcc595e', g: 'linear-gradient(135deg,#1e73ff,#0b3a8c)' },
  { tag: 'Electronics', t: 'Breadboarding & live circuits', d: 'Master voltage, current and components by building real, working circuits.', img: '1597852074816-d933c7d2b988', g: 'linear-gradient(135deg,#2563eb,#1e3a8c)' },
  { tag: 'Embedded', t: 'Sensors, Arduino & microcontrollers', d: 'Give your projects a brain — read the world and react in real time.', img: '1553406830-ef2513450d76', g: 'linear-gradient(135deg,#1d4ed8,#0a2e6e)' },
  { tag: 'Fabrication', t: '3D modelling & 3D printing', d: 'Turn ideas into printable objects with Tinkercad & CollabCAD.', img: '1631467018858-d7a0fa45c842', g: 'linear-gradient(135deg,#3b82f6,#15357a)' },
  { tag: 'AIoT', t: 'IoT & AIoT integration', d: 'Connect devices to the cloud and add edge intelligence to everything.', img: '1518770660439-4636190af475', g: 'linear-gradient(135deg,#2563eb,#102b63)' },
  { tag: 'AI / ML', t: 'AI/ML & computer vision starters', d: 'Teach machines to learn, classify and see with industry-grade tooling.', img: '1677442136019-21780ecad995', g: 'linear-gradient(135deg,#1e73ff,#0b3a8c)' },
];

function HeroSlides() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rb-slides">
      <div className="rb-slides-stage">
        {SLIDES.map((s, i) => (
          <article
            key={s.t}
            className={`rb-slide ${i === idx ? 'is-active' : ''}`}
            style={{ backgroundImage: `${s.g}, url(${IMG(s.img, 1000)})` }}
          >
            <span className="rb-slide-tag">{s.tag}</span>
            <div className="rb-slide-body">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </article>
        ))}
        <div className="rb-slide-orb rb-orb-a" />
        <div className="rb-slide-orb rb-orb-b" />
      </div>
      <div className="rb-slide-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.t}
            aria-label={`Go to slide ${i + 1}`}
            className={i === idx ? 'on' : ''}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}


export default function Landing() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [identifier, setId] = useState('');
  const [password, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
          <div className="rb-logo">Nerve<b>scape</b><small>ANALYTICS</small></div>
          <nav className="rb-nav-links">
            <a href="#home">Home</a>
            <a href="#programs">Programs</a>
            <a href="#why">Why Nervescape</a>
            <a onClick={openLogin}>Sign in</a>
          </nav>
          <button className="rb-nav-cta" onClick={openLogin}>Get started</button>
        </div>
      </header>

      {/* floating right tab */}
      <button className="rb-buy-tab" onClick={openLogin}>
        <span className="icn">🚀</span>
        <b>Get started</b>
        700+ chapters
      </button>

      {/* hero */}
      <section id="home" className="rb-hero">
        <div className="rb-hero-bg" aria-hidden="true">
          <span className="rb-grid-lines" />
          <span className="rb-glow rb-glow-1" />
          <span className="rb-glow rb-glow-2" />
          <span className="rb-glow rb-glow-3" />
        </div>
        <div className="rb-hero-grid">
          <div className="rb-hero-copy">
            <span className="rb-hero-badge">⚡ ATL · Robotics · AI · STEM — Classes 1–12</span>
            <h1>Build. Tinker.<br /><b>Innovate from Class 6.</b></h1>
            <p className="lead">
              Nervescape Analytics is a next-generation Atal Tinkering Lab platform with a complete,
              hands-on innovation journey:
            </p>
            <ul className="rb-curriculum">
              {CURRICULUM.map((c) => (
                <li key={c.t}><span className="rb-cur-ico">{c.i}</span>{c.t}</li>
              ))}
            </ul>
            <div className="rb-hero-actions">
              <button className="rb-hero-cta primary" onClick={openLogin}>Get started →</button>
              <a className="rb-hero-cta ghost" href="#programs">Explore programs</a>
            </div>
          </div>
          <div className="rb-hero-art"><HeroSlides /></div>
        </div>
      </section>

      {/* feature trio (overlap into hero) */}
      <section className="rb-features">
        <div className="rb-feat-row">
          <div className="rb-feat">
            <span className="rb-feat-icon">🌱</span>
            <h3>Grow your skills</h3>
            <p>Beginner-to-advanced learning paths in electronics, robotics, IoT, AI/ML, 3D printing &amp; entrepreneurship.</p>
          </div>
          <div className="rb-feat">
            <span className="rb-feat-icon">🤖</span>
            <h3>Automation</h3>
            <p>Auto-graded MCQ quizzes, AI-evaluated brain teasers and real-time progress tracking — no manual work.</p>
          </div>
          <div className="rb-feat">
            <span className="rb-feat-icon">📊</span>
            <h3>Full analysis</h3>
            <p>Live dashboards for admins, teachers and students with leaderboards, KPIs and class-wide insights.</p>
          </div>
        </div>
      </section>

      <div className="rb-social">
        <h4>Find us here</h4>
        <div className="rb-social-icons">
          <span>f</span><span>G+</span><span>𝕏</span><span>in</span>
        </div>
      </div>

      {/* programs */}
      <section id="programs" className="rb-section">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">What you will master</span>
            <h2>End-to-end Technology &amp; Innovation Programs</h2>
            <p>From your first circuit to your first startup pitch — a complete maker journey for Classes 1–12.</p>
          </div>
          <div className="rb-topic-grid">
            {TOPICS.map((tp) => (
              <article key={tp.t} className="rb-topic">
                <div className="rb-topic-img"><img loading="lazy" src={IMG(tp.img)} alt={tp.t} /><span className="rb-topic-tag">{tp.tag}</span></div>
                <div className="rb-topic-body"><h3>{tp.t}</h3><p>{tp.d}</p><button className="rb-topic-btn" onClick={openLogin}>Explore →</button></div>
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
              <article key={w.t} className="rb-why">
                <div className="rb-why-icon">{w.i}</div>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="rb-footer">
        <div className="rb-footer-inner">
          <div>
            <div className="rb-logo" style={{ marginBottom: 12 }}>Nerve<b>scape</b><small style={{ color: '#cfd6dd' }}>ANALYTICS</small></div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#cfd6dd', maxWidth: 320, margin: 0 }}>
              Empowering Innovation in Education. A unified ATL, Robotics, AI &amp; STEM analytics platform for Classes 1–12.
            </p>
          </div>
          <div><h4>Programs</h4><a href="#programs">Robotics</a><a href="#programs">Electronics</a><a href="#programs">AI / ML</a><a href="#programs">IoT &amp; AIoT</a></div>
          <div><h4>Platform</h4><a onClick={openLogin}>Student Portal</a><a onClick={openLogin}>Teacher Portal</a><a onClick={openLogin}>Admin Portal</a></div>
          <div><h4>Get Started</h4><a onClick={openLogin}>Login</a><a href="#why">Why Nervescape</a><a href="#programs">Course Details</a></div>
        </div>
        <div className="rb-footer-bottom">
          © {new Date().getFullYear()} Nervescape Analytics · Empowering Innovation in Education · Admin → Teacher → Student, fully wired.
        </div>
      </footer>

      {/* login modal — premium split panel */}
      {showLogin && (
        <div className="modal-bg" onClick={() => setShowLogin(false)}>
          <div className="lm-panel" onClick={(e) => e.stopPropagation()}>
            {/* left: branding */}
            <div className="lm-left">
              <div className="lm-brand">Nerve<b>scape</b><br/><small>ANALYTICS</small></div>
              <p className="lm-tagline">The next-generation ATL, Robotics &amp; STEM platform for Classes 1–12.</p>
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
