import { Link } from 'react-router-dom';
import heroMap from '../assets/hero-map.png';

function HeroSection() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-blob-1"></div>
      <div className="lp-hero-blob-2"></div>

      <div className="lp-container">
        <div className="lp-hero-grid">
          {/* Left Content */}
          <div className="lp-hero-content">
            <div className="lp-badge">
              <span className="lp-badge-dot"></span>
              <span>Solusi Makan Siang Mahasiswa STT-NF</span>
            </div>

            <h1 className="lp-hero-title">
              Cari Tempat Makan<br />
              <span className="lp-highlight">Terdekat</span> dari Kampus
            </h1>

            <p className="lp-hero-desc">
              Temukan tempat makan sekitar Kampus A dan Kampus B STT-NF dengan
              info jarak, harga, rating, dan navigasi. Bebas bingung mau makan
              apa hari ini!
            </p>

            <div className="lp-hero-btns">
              <Link to="/explore" className="lp-btn-primary">
                Mulai Cari
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
              <Link to="/login" className="lp-btn-outline">Login</Link>
            </div>

            <div className="lp-social-proof">
              <div className="lp-avatars">
                <div className="lp-avatar" style={{ background: 'linear-gradient(135deg, #ffb599, #ff5f00)' }}>A</div>
                <div className="lp-avatar" style={{ background: 'linear-gradient(135deg, #ffdcc3, #fd8b00)' }}>B</div>
                <div className="lp-avatar" style={{ background: 'linear-gradient(135deg, #ffdf9a, #e68a00)' }}>C</div>
              </div>
              <p className="lp-social-text">
                Bergabung dengan <strong>500+</strong> mahasiswa lainnya.
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="lp-hero-visual">
            <div className="lp-map-wrapper">
              <img src={heroMap} alt="MilkyMaps - Peta tempat makan kampus" className="lp-map-img" />
              <div className="lp-map-overlay"></div>

              {/* Floating Card 1 - Top */}
              <div className="lp-float-card lp-float-1">
                <div className="lp-float-icon">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div>
                  <h4>Warteg Kharisma</h4>
                  <p>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>directions_walk</span>
                    3 min (250m)
                  </p>
                </div>
              </div>

              {/* Center Pin */}
              <div className="lp-center-pin">
                <div className="lp-pin-label">Kampus B</div>
                <span className="material-symbols-outlined lp-pin-icon">location_on</span>
              </div>

              {/* Floating Card 2 - Bottom */}
              <div className="lp-float-card lp-float-2">
                <div style={{ flex: 1 }}>
                  <div className="lp-float-rating">
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#FFD400' }}>star</span>
                    <strong>4.8</strong>
                  </div>
                  <h4>Ayam Geprek Bensu</h4>
                  <p>Rp 15.000 - Rp 25.000</p>
                </div>
                <div className="lp-float-nav">
                  <span className="material-symbols-outlined">directions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
