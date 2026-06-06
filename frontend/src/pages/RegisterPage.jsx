import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', username: '', password: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'full_name', label: 'Nama Lengkap', type: 'text', icon: 'person', placeholder: 'Masukkan nama lengkap Anda' },
    { name: 'email', label: 'Email', type: 'email', icon: 'mail', placeholder: 'email@kampus.ac.id' },
    { name: 'username', label: 'Username', type: 'text', icon: 'alternate_email', placeholder: 'Buat username unik' },
  ];

  return (
    <div className="mm-auth-bg">
      <div className="mm-auth-card" style={{ maxWidth: 480 }}>
        <div className="mm-auth-header">
          <div className="mm-auth-logo">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <h1 className="mm-auth-title">Daftar Akun Mahasiswa</h1>
          <p className="mm-auth-subtitle">Bergabung dengan MilkyMaps untuk rekomendasi makan terbaik.</p>
        </div>

        <form onSubmit={handleSubmit} className="mm-auth-form">
          {error && <div className="mm-alert mm-alert-error">{error}</div>}

          {fields.map(f => (
            <div className="mm-field" key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              <div className="mm-input-wrap">
                <span className="material-symbols-outlined mm-input-icon">{f.icon}</span>
                <input id={f.name} name={f.name} type={f.type} placeholder={f.placeholder}
                  value={form[f.name]} onChange={handleChange} required />
              </div>
            </div>
          ))}

          <div className="mm-field">
            <label htmlFor="password">Password</label>
            <div className="mm-input-wrap">
              <span className="material-symbols-outlined mm-input-icon">lock</span>
              <input id="password" name="password" type={showPass ? 'text' : 'password'}
                placeholder="Minimal 8 karakter" value={form.password} onChange={handleChange} required />
              <button type="button" className="mm-input-toggle" onClick={() => setShowPass(!showPass)}>
                <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="mm-field">
            <label htmlFor="confirm_password">Konfirmasi Password</label>
            <div className="mm-input-wrap">
              <span className="material-symbols-outlined mm-input-icon">lock_reset</span>
              <input id="confirm_password" name="confirm_password" type={showConfirmPass ? 'text' : 'password'}
                placeholder="Ulangi password" value={form.confirm_password} onChange={handleChange} required />
              <button type="button" className="mm-input-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                <span className="material-symbols-outlined">{showConfirmPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <button type="submit" className="mm-btn-primary w-100 mt-2" disabled={loading}>
            {loading ? <span className="mm-btn-spinner"></span> : 'Daftar'}
          </button>
        </form>

        <div className="mm-auth-footer">
          Sudah punya akun? <Link to="/login" className="mm-link">Login</Link>
        </div>
      </div>
    </div>
  );
}
