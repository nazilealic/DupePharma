import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Pharmacy() {
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const { isAdmin } = useAuth();

  const fetchPharmacy = async () => {
    setLoading(true);
    try {
      const data = await api.getOnDutyPharmacy();
      if (data && data.imageUrl) setPharmacy(data);
      else setPharmacy(null);
    } catch { setPharmacy(null); }
    setLoading(false);
  };

  useEffect(() => { fetchPharmacy(); }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('pharmacyListImage', file);
      const res = await api.updateOnDutyPharmacy(formData);
      if (res.imageUrl) {
        setSuccess('Nöbetçi eczane listesi güncellendi! ✅');
        setFile(null); setPreview(null);
        fetchPharmacy();
      } else {
        setError(res.message || 'Yükleme başarısız.');
      }
    } catch { setError('Sunucuya bağlanılamadı.'); }
    setUploading(false);
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">🏥 Nöbetçi Eczane</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {isAdmin && (
        <div className="card" style={{ maxWidth: 520, marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>
            📤 Listeyi Güncelle
            <span className="badge badge-gold" style={{ marginLeft: '0.5rem' }}>Admin</span>
          </h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Nöbetçi Eczane Görseli (JPG, PNG)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            {preview && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Önizleme:</p>
                <img src={preview} alt="Önizleme"
                  style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)', maxHeight: 280, objectFit: 'contain' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
                {uploading ? '⏳ Yükleniyor...' : '📤 Listeyi Güncelle'}
              </button>
              {file && (
                <button type="button" className="btn btn-secondary"
                  onClick={() => { setFile(null); setPreview(null); }}>İptal</button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>📋 Güncel Nöbetçi Eczane Listesi</h3>
        {loading ? (
          <div className="skeleton" style={{ height: 400, borderRadius: 10 }} />
        ) : pharmacy ? (
          <>
            <p style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '1rem' }}>
              🕐 Son güncelleme: {new Date(pharmacy.updatedAt).toLocaleString('tr-TR')}
            </p>
            <img src={pharmacy.imageUrl} alt="Nöbetçi Eczane Listesi"
              style={{ width: '100%', borderRadius: 10, border: '1px solid var(--border)' }} />
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">🏥</div>
            <p>Nöbetçi eczane listesi henüz yüklenmemiş.</p>
            {isAdmin
              ? <p style={{ marginTop: '0.5rem', fontSize: '0.84rem', color: 'var(--accent)' }}>Yukarıdan liste ekleyebilirsiniz.</p>
              : <p style={{ marginTop: '0.5rem', fontSize: '0.84rem' }}>Admin tarafından güncellenecektir.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
