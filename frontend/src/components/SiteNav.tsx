import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function SiteNav() {
  const navigate = useNavigate();
  return (
    <header className="rb-nav">
      <div className="rb-nav-inner">
        <div className="rb-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} style={{ marginRight: 10 }} />
          <span>Nerve<b>scape</b><small>ANALYTICS</small></span>
        </div>
        <nav className="rb-nav-links">
          <Link to="/">Home</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/" className="rb-nav-signin">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
