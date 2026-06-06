import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [tab, setTab] = useState('mahasiswa');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      const { token, user } = res.data;
      if (tab === 'admin' && user.role !== 'admin') {
        setError('Akun ini bukan akun admin.');
        setLoading(false);
        return;
      }
      if (tab === 'mahasiswa' && user.role !== 'customer') {
        setError('Akun ini bukan akun mahasiswa.');
        setLoading(false);
        return;
      }
      loginUser(token, user);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-auth-bg">
      <div className="mm-auth-card">
        {/* Header */}
        <div className="mm-auth-header">
          <div className="mm-auth-logo">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <h1 className="mm-auth-title">Masuk ke Akun</h1>
          <p className="mm-auth-subtitle">Selamat datang kembali! Silakan masuk untuk melanjutkan.</p>
        </div>

        {/* Tabs */}
        <div className="mm-auth-tabs">
          <button className={`mm-tab-btn ${tab === 'mahasiswa' ? 'active' : ''}`} onClick={() => setTab('mahasiswa')}>
            Mahasiswa
          </button>
          <button className={`mm-tab-btn ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mm-auth-form">
          {error && <div className="mm-alert mm-alert-error">{error}</div>}

          <div className="mm-field">
            <label htmlFor="email">Email / Username</label>
            <div className="mm-input-wrap">
              <span className="material-symbols-outlined mm-input-icon">mail</span>
              <input
                id="email" type="text" placeholder="Masukkan email atau username"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              />
            </div>
          </div>

          <div className="mm-field">
            <div className="mm-field-label-row">
              <label htmlFor="password">Password</label>
              <a href="#" className="mm-link-sm">Lupa password?</a>
            </div>
            <div className="mm-input-wrap">
              <span className="material-symbols-outlined mm-input-icon">lock</span>
              <input
                id="password" type={showPass ? 'text' : 'password'} placeholder="Masukkan password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              />
              <button type="button" className="mm-input-toggle" onClick={() => setShowPass(!showPass)}>
                <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <button type="submit" className="mm-btn-primary w-100" disabled={loading}>
            {loading ? <span className="mm-btn-spinner"></span> : 'Masuk'}
          </button>
        </form>

        <div className="mm-auth-footer">
          Belum punya akun? <Link to="/register" className="mm-link">Daftar</Link>
        </div>
      </div>
    </div>
  );
}
