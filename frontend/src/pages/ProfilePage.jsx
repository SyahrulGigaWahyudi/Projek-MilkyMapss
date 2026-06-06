import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar } from '../services/api';
import SideNav from '../components/SideNav';

const API_BASE = 'http://localhost:3000';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = user?.profile_picture?.startsWith('http') 
    ? user.profile_picture 
    : user?.profile_picture 
      ? `${API_BASE}${user.profile_picture}` 
      : null;
  const avatarSrc = previewUrl || API_URL;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Hanya file JPG/PNG yang diperbolehkan.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB.');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);

    // Upload
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await uploadAvatar(formData);
      const avatarPath = res.data.avatar;
      // Update context DAN keep preview sampai foto server siap
      setUser(prev => ({ ...prev, profile_picture: avatarPath }));
      // Jangan hapus previewUrl — biarkan tetap tampil
      // previewUrl akan ter-replace saat user reload atau komponen remount
    } catch (err) {
      alert('Gagal mengupload foto. Coba lagi.');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const menuItems = [
    { icon: 'edit_document', label: 'Edit Profil', to: '/profile/edit' },
    { icon: 'favorite', label: 'Favorit Saya', to: '/favorites' },
    { icon: 'history', label: 'Riwayat Ulasan', to: '/profile/reviews' },
  ];

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        <header className="mm-topbar">
          <h1 className="mm-topbar-title">Profil</h1>
        </header>
        <div className="mm-page-content">
          <div className="row g-4 align-items-start">
            {/* Profile Card */}
            <div className="col-12 col-lg-5">
              <div className="mm-profile-card">
                <div className="mm-profile-blob"></div>
                <div className="mm-profile-body">
                  <div className="mm-profile-avatar-wrap">
                    <div className="mm-profile-avatar" onClick={() => fileInputRef.current?.click()}
                      style={{ cursor: 'pointer', position: 'relative' }}>
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Avatar" style={{
                          width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'
                        }} />
                      ) : (
                        user?.full_name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                      {uploading && (
                        <div style={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.4)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span className="mm-btn-spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></span>
                        </div>
                      )}
                    </div>
                    <button className="mm-avatar-edit-btn" onClick={() => fileInputRef.current?.click()}>
                      <span className="material-symbols-outlined">photo_camera</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                    />
                  </div>
                  <h3 className="mm-profile-name">{user?.full_name || user?.username}</h3>
                  <div className="mm-profile-contacts">
                    {user?.email && (
                      <div className="mm-contact-row">
                        <div className="mm-contact-icon"><span className="material-symbols-outlined">mail</span></div>
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                  <button className="mm-btn-primary w-100" onClick={() => navigate('/profile/edit')}>
                    <span className="material-symbols-outlined">edit</span>
                    Edit Profil
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="col-12 col-lg-7">
              <div className="mm-profile-menu">
                {menuItems.map(item => (
                  <button key={item.to} className="mm-profile-menu-item" onClick={() => navigate(item.to)}>
                    <div className="mm-profile-menu-left">
                      <div className="mm-profile-menu-icon">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <span className="mm-profile-menu-label">{item.label}</span>
                    </div>
                    <span className="material-symbols-outlined mm-profile-menu-arrow">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
