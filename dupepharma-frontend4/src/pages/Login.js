import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Şifremi unuttum
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.login(form);
      if (res.token) {
        login(res.token, res.user);
        navigate('/');
      } else {
        setError(res.message || 'E-posta veya şifre hatalı.');
      }
    } catch { setError('Sunucuya bağlanılamadı.'); }
    setLoading(false);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setForgotMsg('Şifrenizi sıfırlamak için bizimle iletişime geçin: dupepharma@gmail.com');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="tabs" style={{ marginBottom: '1.5rem' }}>
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Giriş Yap</button>
          <button className={`tab-btn ${tab === 'forgot' ? 'active' : ''}`} onClick={() => { setTab('forgot'); setError(''); }}>Şifremi Unuttum</button>
        </div>

        {/* Giriş */}
        {tab === 'login' && (
          <>
            <h1>Hoş Geldiniz</h1>
            <p>Hesabınıza giriş yapın</p>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>E-posta</label>
                <input type="email" placeholder="ornek@mail.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Şifre</label>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
            <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
              <button className="link-btn" onClick={() => setTab('forgot')}>Şifremi unuttum</button>
            </div>
            <div className="divider" />
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem' }}>
              Hesabınız yok mu?{' '}
              <Link to="/register" style={{ color: 'var(--accent)' }}>Üye Olun</Link>
            </p>
          </>
        )}

        {/* Şifremi Unuttum */}
        {tab === 'forgot' && (
          <>
            <h1>Şifremi Unuttum</h1>
            <p>E-posta adresinizi girin</p>
            {forgotErr && <div className="alert alert-error">{forgotErr}</div>}
            {forgotMsg && <div className="alert alert-success">{forgotMsg}</div>}
            {!forgotMsg && (
              <form onSubmit={handleForgot}>
                <div className="form-group">
                  <label>E-posta Adresi</label>
                  <input type="email" placeholder="ornek@mail.com" value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  İletişim Bilgisi Al
                </button>
              </form>
            )}
            <div className="divider" />
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem' }}>
              <button className="link-btn" onClick={() => { setTab('login'); setForgotMsg(''); }}>← Giriş sayfasına dön</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
