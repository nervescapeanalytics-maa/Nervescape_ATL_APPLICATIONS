import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { IMG } from '../data/programs';

const VALUES = [
  { i: '🎯', t: 'Outcomes over activity', d: 'Every chapter, quiz and challenge is engineered to produce a measurable skill, not just keep students busy.' },
  { i: '🛠', t: 'Make to learn', d: 'We believe children understand deepest when they build — so tinkering, prototyping and shipping sit at the core.' },
  { i: '🤝', t: 'Equity of access', d: 'A world-class innovation lab experience, delivered consistently to every school and every learner.' },
  { i: '🔬', t: 'Rigour with wonder', d: 'Industry-grade tools and real engineering, wrapped in the curiosity and play that keep learners hooked.' },
  { i: '🔒', t: 'Trust by design', d: 'Multi-tenant isolation, transparent analytics and responsible AI keep data safe and decisions explainable.' },
  { i: '🌱', t: 'Lifelong builders', d: 'We grow not just coders, but founders, problem-framers and innovators who keep creating for life.' },
];

const TIMELINE = [
  { y: '2023', t: 'Founded', d: 'Nervescape Analytics is founded with a mission to bring premium, AI-assisted tinkering education to every classroom.' },
  { y: '2024', t: 'ATL platform launch', d: 'The unified Admin → Teacher → Student platform goes live, aligned to Atal Tinkering Lab guidelines.' },
  { y: '2025', t: 'AI mentor & analytics', d: 'A 24×7 context-aware AI mentor and live role-based analytics roll out across partner schools.' },
  { y: '2026', t: 'Scaling innovation', d: '700+ chapters across robotics, IoT, AI/ML, 3D fabrication and entrepreneurship reach learners in Classes 6–12.' },
];

const STATS = [
  { n: '700+', l: 'Curriculum chapters' },
  { n: '8', l: 'Innovation tracks' },
  { n: '24×7', l: 'AI mentor uptime' },
  { n: '6–12', l: 'Classes served' },
];

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="landing">
      <SiteNav />

      <section className="pg-hero">
        <div className="pg-hero-inner">
          <span className="rb-kicker" style={{ color: '#bcd4ff' }}>About Nervescape</span>
          <h1>Engineering the next generation of innovators</h1>
          <p>
            Nervescape Analytics is a next-generation Atal Tinkering Lab platform that turns curiosity into capability.
            We unite a rich, hands-on STEM curriculum, an always-on AI mentor and deep role-based analytics into a single,
            beautifully connected experience for schools, teachers and students.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section-inner about-split">
          <div className="about-media" style={{ backgroundImage: `url(${IMG('1581091226825-a6a2a5aee158', 1000)})` }} />
          <div>
            <span className="rb-kicker">Our mission</span>
            <h2>Make world-class innovation education accessible to every learner</h2>
            <p className="muted" style={{ lineHeight: 1.8 }}>
              We started with a simple conviction: every child is a maker waiting for the right tools and the right mentor.
              Traditional classrooms reward memorisation; the real world rewards those who can frame problems, prototype
              solutions and lead with technology. Nervescape closes that gap.
            </p>
            <p className="muted" style={{ lineHeight: 1.8 }}>
              From a student's first glowing paper circuit to their first startup pitch, our platform guides them through a
              structured maker journey — electronics, robotics, IoT &amp; AIoT, 3D modelling and fabrication, AI/ML and
              entrepreneurship — all aligned to ATL outcomes and powered by responsible AI.
            </p>
          </div>
        </div>
      </section>

      <section className="rb-section alt">
        <div className="rb-section-inner">
          <div className="about-stats">
            {STATS.map((s) => (
              <div key={s.l} className="about-stat"><b>{s.n}</b><span>{s.l}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">What we stand for</span>
            <h2>Values that shape every decision</h2>
            <p>The principles that guide how we design curriculum, build technology and partner with schools.</p>
          </div>
          <div className="about-values">
            {VALUES.map((v) => (
              <article key={v.t} className="about-value">
                <span className="about-value-ico">{v.i}</span>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-section alt">
        <div className="rb-section-inner">
          <div className="rb-section-head">
            <span className="rb-kicker">Our journey</span>
            <h2>From a bold idea to a national innovation platform</h2>
          </div>
          <div className="about-timeline">
            {TIMELINE.map((t) => (
              <div key={t.y} className="about-tl-item">
                <div className="about-tl-year">{t.y}</div>
                <div className="about-tl-body"><h3>{t.t}</h3><p>{t.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-cta-band">
        <div className="rb-cta-inner">
          <h2>Bring the Nervescape lab to your school</h2>
          <p>Partner with us to launch a future-ready innovation programme for your students.</p>
          <div className="rb-cta-actions">
            <Link className="rb-hero-cta primary" to="/contact">Talk to us →</Link>
            <Link className="rb-hero-cta ghost" to="/programs">Explore programs</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
