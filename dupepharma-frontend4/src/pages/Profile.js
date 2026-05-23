import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pwForm, setPwForm] = useState({ newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm('Çıkış yapmak istediğinize emin misiniz?')) return;
    await api.logout();
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Şifreler eşleşmiyor.'); return; }
    if (pwForm.newPassword.length < 8) { setPwError('Şifre en az 8 karakter olmalı.'); return; }
    setPwLoading(true); setPwError(''); setPwSuccess('');
    try {
      const res = await api.updatePassword(user.id, { newPassword: pwForm.newPassword });
      if (res.message && !res.code) {
        setPwSuccess('Şifre güncellendi! ✅');
        setPwForm({ newPassword: '', confirm: '' });
        setShowPwForm(false);
      } else {
        setPwError(res.message || 'Güncelleme başarısız.');
      }
    } catch { setPwError('Sunucuya bağlanılamadı.'); }
    setPwLoading(false);
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">👤 Profilim</h1>

      <div className="card" style={{ maxWidth: 520, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--bg3)', border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', color: 'var(--accent)'
          }}>
            {user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{user?.fullName}</h2>
            <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>{user?.email}</p>
            <span className={`badge ${isAdmin ? 'badge-gold' : 'badge-green'}`} style={{ marginTop: '0.3rem', display: 'inline-block' }}>
              {isAdmin ? '⚙️ Admin' : '👤 Kullanıcı'}
            </span>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowPwForm(p => !p)}>
            🔑 Şifre Değiştir
          </button>
          {isAdmin && (
            <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
              ⚙️ Admin Paneli
            </button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Çıkış Yap
          </button>
        </div>
      </div>

      {showPwForm && (
        <div className="card" style={{ maxWidth: 520 }}>
          <h3 style={{ marginBottom: '1rem' }}>🔑 Şifre Değiştir</h3>
          {pwError   && <div className="alert alert-error">{pwError}</div>}
          {pwSuccess && <div className="alert alert-success">{pwSuccess}</div>}
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Yeni Şifre</label>
              <input type="password" placeholder="En az 8 karakter" value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required minLength={8} />
            </div>
            <div className="form-group">
              <label>Şifre Tekrar</label>
              <input type="password" placeholder="Tekrar girin" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={pwLoading}>
                {pwLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPwForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
