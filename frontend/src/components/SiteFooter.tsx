import { Link } from 'react-router-dom';
import { PROGRAMS } from '../data/programs';
import Logo from './Logo';

export const SOCIALS: { label: string; href: string; path: string }[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nervescape-analytics', path: 'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.25 8.25h4.5V24h-4.5V8.25zM8.25 8.25h4.31v2.15h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V24h-4.5v-6.96c0-1.66-.03-3.8-2.31-3.8-2.31 0-2.66 1.8-2.66 3.67V24h-4.5V8.25z' },
  { label: 'Twitter', href: 'https://twitter.com/nervescape', path: 'M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.5h7.59l5.24 6.93L18.9 1.5zm-1.29 18.79h2.04L6.48 3.6H4.29l13.32 16.69z' },
  { label: 'Instagram', href: 'https://www.instagram.com/nervescape', path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.41a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z' },
  { label: 'YouTube', href: 'https://www.youtube.com/@nervescape', path: 'M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z' },
  { label: 'Facebook', href: 'https://www.facebook.com/nervescape', path: 'M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z' },
];

export default function SiteFooter() {
  return (
    <footer className="rb-footer">
      <div className="rb-footer-inner">
        <div>
          <div className="rb-logo" style={{ marginBottom: 12 }}>
            <Logo size={32} style={{ marginRight: 8 }} />
            <span>Nerve<b>scape</b><small style={{ color: '#cfd6dd' }}>ANALYTICS</small></span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#cfd6dd', maxWidth: 320, margin: 0 }}>
            Empowering Innovation in Education. A unified ATL, Robotics, AI &amp; STEM analytics platform for Classes 6–12.
          </p>
          <div className="rb-social">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Programs</h4>
          {PROGRAMS.slice(0, 4).map((p) => (
            <Link key={p.slug} to={`/programs/${p.slug}`}>{p.title}</Link>
          ))}
        </div>
        <div>
          <h4>More Programs</h4>
          {PROGRAMS.slice(4).map((p) => (
            <Link key={p.slug} to={`/programs/${p.slug}`}>{p.title}</Link>
          ))}
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/programs">All Programs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <div className="rb-footer-bottom">
        © 2023 Nervescape Analytics · Empowering Innovation in Education · Admin → Teacher → Student, fully wired.
      </div>
    </footer>
  );
}
