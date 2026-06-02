import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROGRAMS, getProgram, IMG } from '../data/programs';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

function ProgramList() {
  return (
    <>
      <section className="pg-hero">
        <div className="pg-hero-inner">
          <span className="rb-kicker" style={{ color: '#bcd4ff' }}>What you will master</span>
          <h1>Explore our Programs</h1>
          <p>From your first circuit to your first startup pitch — eight deep, hands-on tracks that make up the complete Nervescape maker journey. Pick any program for a full breakdown.</p>
        </div>
      </section>
      <section className="rb-section">
        <div className="rb-section-inner">
          <div className="rb-topic-grid">
            {PROGRAMS.map((p) => (
              <article key={p.slug} className="rb-topic">
                <div className="rb-topic-img">
                  <img loading="lazy" src={IMG(p.img)} alt={p.title} />
                  <span className="rb-topic-tag">{p.tag}</span>
                </div>
                <div className="rb-topic-body">
                  <h3>{p.title}</h3>
                  <p>{p.short}</p>
                  <Link className="rb-topic-btn" to={`/programs/${p.slug}`}>Explore →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProgramDetail({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const p = getProgram(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!p) {
    return (
      <section className="rb-section">
        <div className="rb-section-inner" style={{ textAlign: 'center' }}>
          <h2>Program not found</h2>
          <Link className="rb-hero-cta primary" to="/programs">← Back to all programs</Link>
        </div>
      </section>
    );
  }

  const idx = PROGRAMS.findIndex((x) => x.slug === slug);
  const next = PROGRAMS[(idx + 1) % PROGRAMS.length];

  return (
    <>
      <section
        className="pg-detail-hero"
        style={{ backgroundImage: `linear-gradient(120deg, ${p.accent}f2, #0a1530f2), url(${IMG(p.img, 1400)})` }}
      >
        <div className="pg-detail-hero-inner">
          <div className="pg-breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <Link to="/programs">Programs</Link> <span>/</span> <b>{p.tag}</b>
          </div>
          <span className="rb-slide-tag" style={{ position: 'static', display: 'inline-block', marginBottom: 14 }}>{p.tag}</span>
          <h1>{p.title}</h1>
          <p className="pg-tagline">{p.tagline}</p>
          <div className="pg-meta">
            <span>🎓 {p.classes}</span>
            <span>⏱ {p.duration}</span>
            <span>📈 {p.level}</span>
          </div>
        </div>
      </section>

      <section className="rb-section">
        <div className="pg-detail-grid">
          <div className="pg-main">
            <h2>Program overview</h2>
            <p className="pg-overview">{p.overview}</p>

            <h2 style={{ marginTop: 38 }}>Curriculum &amp; modules</h2>
            <div className="pg-modules">
              {p.modules.map((m, i) => (
                <div key={m.t} className="pg-module">
                  <span className="pg-module-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{m.t}</h4>
                    <p>{m.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ marginTop: 38 }}>Hands-on projects</h2>
            <div className="pg-projects">
              {p.projects.map((pr) => (
                <span key={pr} className="pg-project-chip">🛠 {pr}</span>
              ))}
            </div>
          </div>

          <aside className="pg-aside">
            <div className="pg-card">
              <h3>What you’ll achieve</h3>
              <ul className="pg-outcomes">
                {p.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
            <div className="pg-card">
              <h3>Tools &amp; tech</h3>
              <div className="pg-tools">
                {p.tools.map((t) => (
                  <span key={t} className="pg-tool">{t}</span>
                ))}
              </div>
            </div>
            <div className="pg-card pg-cta-card" style={{ background: `linear-gradient(135deg, ${p.accent}, #0a3d6e)` }}>
              <h3>Ready to start?</h3>
              <p>Sign in to begin {p.tag} chapters, quizzes and AI-mentored challenges.</p>
              <button className="rb-hero-cta primary" style={{ width: '100%' }} onClick={() => navigate('/')}>Get started →</button>
            </div>
          </aside>
        </div>
      </section>

      <section className="rb-section alt" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="rb-section-inner pg-next">
          <Link className="rb-hero-cta ghost" to="/programs">← All programs</Link>
          <Link className="rb-hero-cta primary" to={`/programs/${next.slug}`}>Next: {next.title} →</Link>
        </div>
      </section>
    </>
  );
}

export default function Programs() {
  const { slug } = useParams();
  return (
    <div className="landing">
      <SiteNav />
      {slug ? <ProgramDetail slug={slug} /> : <ProgramList />}
      <SiteFooter />
    </div>
  );
}
