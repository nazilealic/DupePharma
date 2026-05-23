import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm]     = useState({ fullName: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.register(form);
      if (res.id) {
        navigate('/login');
      } else {
        setError(res.message || 'Kayıt başarısız.');
      }
    } catch {
      setError('Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Üye Olun</h1>
        <p>Yeni hesap oluşturun</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input type="text" placeholder="Ad Soyad" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} required minLength={3} />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" placeholder="ornek@mail.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="En az 8 karakter" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Üye Ol'}
          </button>
        </form>
        <div className="divider" />
        <p style={{ textAlign:'center', color:'var(--text2)', fontSize:'0.9rem' }}>
          Zaten hesabınız var mı? <Link to="/login" style={{ color:'var(--accent)' }}>Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
}
