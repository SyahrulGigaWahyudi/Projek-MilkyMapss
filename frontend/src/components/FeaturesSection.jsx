const features = [
  { icon: 'search', title: 'Cari Tempat Makan', desc: 'Temukan berbagai pilihan tempat makan di sekitar kampus dengan mudah melalui pencarian cerdas.', color: '#ff5f00', bg: '#ffdbce' },
  { icon: 'menu_book', title: 'Lihat Menu & Harga', desc: 'Cek detail menu dan estimasi harga sebelum datang agar sesuai dengan budget mahasiswa.', color: '#fd8b00', bg: '#ffdcc3' },
  { icon: 'route', title: 'Navigasi Rute', desc: 'Dapatkan panduan rute terdekat dari kampus menuju lokasi tempat makan favoritmu.', color: '#e68a00', bg: '#ffdf9a' },
  { icon: 'favorite', title: 'Simpan Favorit', desc: 'Simpan tempat makan langganan untuk diakses lebih cepat di kemudian hari.', color: '#ba1a1a', bg: '#ffdad6' },
];

function FeaturesSection() {
  return (
    <section className="lp-features" id="features">
      <div className="lp-container">
        <div className="lp-features-header">
          <h2>Fitur Utama</h2>
          <p>Semua yang kamu butuhkan untuk mencari makan siang dengan cepat dan tepat.</p>
        </div>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div key={i} className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: f.bg, color: f.color }}>
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
