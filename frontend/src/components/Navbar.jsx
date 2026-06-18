import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // Deteksi apakah section features terlihat
      const features = document.getElementById('features');
      if (features) {
        const rect = features.getBoundingClientRect();
        setActiveHash(rect.top < 200 ? '#features' : '');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTentang = (e) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveHash('#features');
  };

  const isBerandaActive = location.pathname === '/' && activeHash !== '#features';
  const isTentangActive = activeHash === '#features';

  return (
    <nav className={`lp-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="lp-navbar-inner">
        <Link to="/" className="lp-logo">MilkyMaps</Link>
        <div className="lp-nav-links">
          <Link
            to="/"
            className={`lp-nav-link ${isBerandaActive ? 'active' : ''}`}
            onClick={() => setActiveHash('')}>
            Beranda
          </Link>
          <a
            href="#features"
            className={`lp-nav-link ${isTentangActive ? 'active' : ''}`}
            onClick={handleTentang}>
            Tentang
          </a>
        </div>
        <Link to="/login" className="lp-login-btn">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
