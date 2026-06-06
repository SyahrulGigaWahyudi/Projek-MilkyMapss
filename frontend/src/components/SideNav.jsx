import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/home', icon: 'home', label: 'Beranda' },
  { to: '/explore', icon: 'search', label: 'Cari' },
  { to: '/favorites', icon: 'favorite', label: 'Favorit' },
  { to: '/profile', icon: 'person', label: 'Profil' },
];

export default function SideNav() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="mm-sidenav d-none d-md-flex">
        <div className="mm-sidenav-brand">
          <span className="mm-brand-name">MilkyMaps</span>
          <span className="mm-brand-sub">Food Locator</span>
        </div>
        <div className="mm-sidenav-links">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `mm-nav-item ${isActive ? 'active' : ''}`
            }>
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        {user && (
          <div className="mm-sidenav-user">
            <div className="mm-user-avatar-sm">
              {user.profile_picture ? (
                <img 
                  src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:3000${user.profile_picture}`} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                user.full_name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div className="mm-user-info">
              <span className="mm-user-name">{user.full_name || user.username}</span>
              <button className="mm-sidenav-logout-btn" onClick={handleLogout} style={{ border: 'none', background: 'transparent', padding: 0, color: '#dc3545', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginTop: '2px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>logout</span> Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mm-bottomnav d-md-none">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `mm-bottomnav-item ${isActive ? 'active' : ''}`
          }>
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
