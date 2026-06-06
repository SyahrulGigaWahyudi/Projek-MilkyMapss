import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`lp-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="lp-navbar-inner">
        <Link to="/" className="lp-logo">MilkyMaps</Link>
        <div className="lp-nav-links">
          <Link to="/" className={`lp-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Beranda
          </Link>
          <a href="#features" className="lp-nav-link">Tentang</a>
        </div>
        <Link to="/login" className="lp-login-btn">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
