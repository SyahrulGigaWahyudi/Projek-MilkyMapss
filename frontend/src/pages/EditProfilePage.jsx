import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import SideNav from '../components/SideNav';

export default function EditProfilePage() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await updateProfile(user.id, form);
      // Update local user data
      const updatedUser = { ...user, ...form };
      loginUser(localStorage.getItem('mm_token'), updatedUser);
      setSuccess('Profil berhasil diperbarui!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'full_name', label: 'Nama Lengkap', icon: 'person', type: 'text' },
    { name: 'email', label: 'Email', icon: 'mail', type: 'email' },
    { name: 'username', label: 'Username', icon: 'alternate_email', type: 'text' },
  ];

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        <header className="mm-topbar">
          <button className="mm-back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
        </header>
        <div className="mm-page-content" style={{ maxWidth: 560 }}>
          <h2 className="mm-page-title">Edit Profil</h2>
          <p className="mm-page-subtitle mb-4">Perbarui informasi pribadi kamu.</p>

          <div className="mm-panel">
            <div className="mm-panel-header">
              <h3>Informasi Pribadi</h3>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
              {error && <div className="mm-alert mm-alert-error mb-3">{error}</div>}
              {success && <div className="mm-alert mm-alert-success mb-3">{success}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fields.map(f => (
                  <div className="mm-field" key={f.name}>
                    <label htmlFor={f.name}>{f.label}</label>
                    <div className="mm-input-wrap">
                      <span className="material-symbols-outlined mm-input-icon">{f.icon}</span>
                      <input id={f.name} name={f.name} type={f.type}
                        value={form[f.name]} onChange={handleChange} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="submit" className="mm-btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? <span className="mm-btn-spinner"></span> : 'Simpan Perubahan'}
                </button>
                <button type="button" className="mm-btn-outline" onClick={() => navigate('/profile')}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
