import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const adminNavItems = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/food-places', icon: 'storefront', label: 'Tempat Makan' },
  { to: '/admin/menus', icon: 'restaurant_menu', label: 'Menu' },
  { to: '/admin/reviews', icon: 'reviews', label: 'Ulasan' },
];

function AdminLayout({ children, title }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mm-app-layout">
      <nav className="mm-sidenav d-none d-md-flex">
        <div className="mm-sidenav-brand">
          <span className="mm-brand-name">MilkyMaps</span>
          <span className="mm-brand-sub" style={{ color: 'var(--error)' }}>Admin Panel</span>
        </div>
        <div className="mm-sidenav-links">
          {adminNavItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) =>
              `mm-nav-item ${isActive ? 'active' : ''}`
            }>
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div style={{ padding: '0 0.75rem', marginTop: 'auto' }}>
          <button className="mm-profile-menu-item danger w-100" onClick={() => { logoutUser(); navigate('/login'); }}>
            <div className="mm-profile-menu-left">
              <div className="mm-profile-menu-icon danger">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <span className="mm-profile-menu-label danger">Logout</span>
            </div>
          </button>
        </div>
      </nav>
      <main className="mm-main-content">
        <header className="mm-topbar">
          <h1 className="mm-topbar-title">{title}</h1>
          <div className="mm-topbar-actions">
            <div className="mm-avatar-sm">{user?.full_name?.charAt(0) || 'A'}</div>
          </div>
        </header>
        <div className="mm-page-content">{children}</div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ food_places: 0, menus: 0, reviews: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/food-places').catch(() => ({ data: [] })),
      API.get('/menus').catch(() => ({ data: [] })),
      API.get('/reviews').catch(() => ({ data: [] })),
      API.get('/users').catch(() => ({ data: [] })),
    ]).then(([fp, mn, rv, us]) => {
      setStats({
        food_places: (fp.data?.data || fp.data || []).length,
        menus: (mn.data?.data || mn.data || []).length,
        reviews: (rv.data?.data || rv.data || []).length,
        users: (us.data?.data || us.data || []).length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: 'storefront', label: 'Tempat Makan', value: stats.food_places, color: '#ff5f00', bg: '#ffdbce', link: '/admin/food-places' },
    { icon: 'restaurant_menu', label: 'Total Menu', value: stats.menus, color: '#fd8b00', bg: '#ffdcc3', link: '/admin/menus' },
    { icon: 'reviews', label: 'Total Ulasan', value: stats.reviews, color: '#785a00', bg: '#ffdf9a', link: '/admin/reviews' },
    { icon: 'group', label: 'Total User', value: stats.users, color: '#a63b00', bg: '#ffb599', link: null },
  ];

  const navigate = useNavigate();

  return (
    <AdminLayout title="Dashboard Overview">
      <section className="mm-welcome-section">
        <h2 className="mm-page-title">Selamat Datang, Admin!</h2>
        <p className="mm-page-subtitle">Ringkasan data MilkyMaps.</p>
      </section>

      <div className="row g-3 mb-4">
        {cards.map((card, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="mm-stat-card" onClick={() => card.link && navigate(card.link)}
              style={{ cursor: card.link ? 'pointer' : 'default' }}>
              <div className="mm-stat-icon" style={{ background: card.bg, color: card.color }}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <div className="mm-stat-info">
                <span className="mm-stat-value">{loading ? '...' : card.value}</span>
                <span className="mm-stat-label">{card.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

// Export AdminLayout for use by other admin pages
export { AdminLayout, adminNavItems };
