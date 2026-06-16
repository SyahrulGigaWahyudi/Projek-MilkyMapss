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
  const [touched, setTouched] = useState({ email: false, password: false });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email dan password tidak boleh kosong.');
      return;
    }
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
      setSuccess(true);
      loginUser(token, user);
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : '/home');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-auth-bg">
      <div className={`mm-auth-card ${success ? 'mm-auth-success' : ''}`}>
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
          <button 
            type="button"
            className={`mm-tab-btn ${tab === 'mahasiswa' ? 'active' : ''}`} 
            onClick={() => {
              setTab('mahasiswa');
              setError('');
            }}
          >
            <span className="material-symbols-outlined">school</span>
            <span>Mahasiswa</span>
          </button>
          <button 
            type="button"
            className={`mm-tab-btn ${tab === 'admin' ? 'active' : ''}`} 
            onClick={() => {
              setTab('admin');
              setError('');
            }}
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span>Admin</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mm-auth-form" noValidate>
          {error && (
            <div className="mm-alert mm-alert-error mm-alert-animated">
              <span className="material-symbols-outlined mm-alert-icon">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="mm-field">
            <label htmlFor="email">Email / Username</label>
            <div className={`mm-input-wrap ${touched.email && form.email ? 'mm-input-valid' : ''} ${touched.email && !form.email ? 'mm-input-error' : ''}`}>
              <span className="material-symbols-outlined mm-input-icon">mail</span>
              <input
                id="email" 
                type="text" 
                placeholder="Masukkan email atau username"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                onBlur={() => setTouched({ ...touched, email: true })}
                required
                disabled={loading}
                aria-label="Email atau Username"
              />
              {touched.email && form.email && <span className="material-symbols-outlined mm-input-check">done</span>}
            </div>
          </div>

          <div className="mm-field">
            <div className="mm-field-label-row">
              <label htmlFor="password">Password</label>
              <a href="#" className="mm-link-sm" onClick={(e) => e.preventDefault()}>Lupa password?</a>
            </div>
            <div className={`mm-input-wrap ${touched.password && form.password ? 'mm-input-valid' : ''} ${touched.password && !form.password ? 'mm-input-error' : ''}`}>
              <span className="material-symbols-outlined mm-input-icon">lock</span>
              <input
                id="password" 
                type={showPass ? 'text' : 'password'} 
                placeholder="Masukkan password"
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })}
                onBlur={() => setTouched({ ...touched, password: true })}
                required
                disabled={loading}
                aria-label="Password"
              />
              <button 
                type="button" 
                className="mm-input-toggle" 
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
              {touched.password && form.password && <span className="material-symbols-outlined mm-input-check">done</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="mm-btn-primary mm-btn-lg" 
            disabled={loading || success}
          >
            {loading ? (
              <>
                <span className="mm-btn-spinner"></span>
                <span>Memproses...</span>
              </>
            ) : success ? (
              <>
                <span className="material-symbols-outlined">done_all</span>
                <span>Login Berhasil!</span>
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="mm-auth-footer">
          <p>Belum punya akun? <Link to="/register" className="mm-link">Daftar sekarang</Link></p>
        </div>
      </div>
    </div>
  );
}
