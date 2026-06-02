import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../auth';
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
  { n: '01', i: '🧭', t: 'Pick your track', d: 'Choose from eight hands-on programs — robotics, IoT, AI/ML, 3D fabrication, entrepreneurship and more.' },
  { n: '02', i: '🛠', t: 'Learn by building', d: 'Work through bite-sized chapters with live circuits, code and projects aligned to ATL outcomes.' },
  { n: '03', i: '🤖', t: 'Get AI mentorship', d: 'A 24×7 context-aware mentor gives hints, explanations and instant feedback whenever you are stuck.' },
  { n: '04', i: '🏆', t: 'Ship & compete', d: 'Submit projects, climb the leaderboard and earn XP as teachers and admins track your growth live.' },
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

// Live, auto-advancing hero slides
const SLIDES = [
  { tag: 'Robotics', t: 'Line-follower & obstacle-avoider bots', d: 'Program autonomous machines that sense, decide and move on their own.', img: '1485827404703-89b55fcc595e', g: 'linear-gradient(135deg,#1e88e5cc,#0b3a8ccc)' },
  { tag: 'Electronics', t: 'Breadboarding & live circuits', d: 'Master voltage, current and components by building real, working circuits.', img: '1597852074816-d933c7d2b988', g: 'linear-gradient(135deg,#1e88e5cc,#1e3a8ccc)' },
  { tag: 'Embedded', t: 'Sensors, Arduino & microcontrollers', d: 'Give your projects a brain — read the world and react in real time.', img: '1553406830-ef2513450d76', g: 'linear-gradient(135deg,#1e88e5cc,#0a2e6ecc)' },
  { tag: 'Fabrication', t: '3D modelling & 3D printing', d: 'Turn ideas into printable objects with Tinkercad & CollabCAD.', img: '1635070041078-e363dbe005cb', g: 'linear-gradient(135deg,#1e88e5cc,#15357acc)' },
  { tag: 'AIoT', t: 'IoT & AIoT integration', d: 'Connect devices to the cloud and add edge intelligence to everything.', img: '1518770660439-4636190af475', g: 'linear-gradient(135deg,#1e88e5cc,#102b63cc)' },
  { tag: 'AI / ML', t: 'AI/ML & computer vision starters', d: 'Teach machines to learn, classify and see with industry-grade tooling.', img: '1677442136019-21780ecad995', g: 'linear-gradient(135deg,#1e88e5cc,#0b3a8ccc)' },
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
        <div className="rb-slide-chip rb-chip-1">⚡ 700+ chapters</div>
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
  const navigate = useNavigate();
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
          <div className="rb-logo">
            <Logo size={36} style={{ marginRight: 10 }} />
            <span>Nerve<b>scape</b><small>ANALYTICS</small></span>
          </div>
          <nav className="rb-nav-links">
            <a href="#home">Home</a>
            <a onClick={() => navigate('/programs')}>Programs</a>
            <a href="#why">Why Nervescape</a>
            <a onClick={() => navigate('/about')}>About</a>
            <a onClick={() => navigate('/contact')}>Contact</a>
            <a onClick={openLogin}>Sign in</a>
          </nav>
        </div>
      </header>

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
            <span className="rb-hero-badge">⚡ ATL · Robotics · AI · STEM — Classes 6–12</span>
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
              <button className="rb-hero-cta primary" onClick={() => navigate('/programs')}>Explore programs →</button>
            </div>
          </div>
          <div className="rb-hero-art"><HeroSlides /></div>
        </div>
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
                <span className="rb-step-n">{s.n}</span>
                <span className="rb-step-ico">{s.i}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
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
      <button className="rb-mentor-badge" onClick={openLogin}>
        <span className="rb-mentor-dot" />🤖 24×7 AI mentor
      </button>

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
