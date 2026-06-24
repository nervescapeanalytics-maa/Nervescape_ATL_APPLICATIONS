import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo, { BrandName } from './Logo';

export default function SiteNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  // Navigate to landing and trigger login modal via query param
  const goSignIn = () => { close(); navigate('/?login=1'); };

  return (
    <header className="rb-nav">
      <div className="rb-nav-inner">
        {/* Logo */}
        <div className="rb-logo" onClick={() => { navigate('/'); close(); }} style={{ cursor: 'pointer' }}>
          <Logo size={40} style={{ marginRight: 10 }} />
          <BrandName />
        </div>

        {/* Desktop nav links */}
        <nav className="rb-nav-links">
          <Link to="/">Home</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <a onClick={goSignIn} className="rb-nav-signin" style={{ cursor: 'pointer' }}>Sign In</a>
        </nav>

        {/* Mobile: Sign In always visible + hamburger */}
        <div className="rb-nav-mobile-actions">
          <button className="rb-mobile-signin" onClick={goSignIn}>Sign In</button>
          <button
            className="rb-hamburger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="rb-mobile-menu" onClick={close}>
          <nav onClick={(e) => e.stopPropagation()}>
            <Link to="/" onClick={close}>🏠 Home</Link>
            <Link to="/programs" onClick={close}>📚 Programs</Link>
            <Link to="/about" onClick={close}>ℹ️ About Us</Link>
            <Link to="/contact" onClick={close}>✉️ Contact</Link>
            <div className="rb-mobile-menu-divider" />
            <button className="rb-mobile-menu-signin" onClick={goSignIn}>🔐 Sign In to Portal</button>
          </nav>
        </div>
      )}
    </header>
  );
}
