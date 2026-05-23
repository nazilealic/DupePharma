import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SKIN_TYPES = ['yağlı', 'kuru', 'karma', 'normal', 'hassas'];
const PROBLEMS = ['akne', 'kızarıklık', 'kuruluk', 'gözenek', 'leke', 'kırışıklık', 'hassasiyet'];

export default function SkinProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ skinType: 'normal', sensitivity: false, skinProblems: [] });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);

  // Sayfa açılınca mevcut cilt profilini yükle
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await api.getSkinProfile(user.id);
        if (data && data.skinType) {
          setForm({
            skinType: data.skinType || 'normal',
            sensitivity: data.sensitivity || false,
            skinProblems: data.skinProblems || [],
          });
          setHasProfile(true);
        }
      } catch {}
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user.id]);

  useEffect(() => {
    if (activeTab === 'history') {
      setHistLoading(true);
      api.getSearchHistory(user.id).then(data => {
        setHistory(Array.isArray(data) ? data : []);
        setHistLoading(false);
      }).catch(() => setHistLoading(false));
    }
  }, [activeTab, user.id]);

  const toggleProblem = (p) => setForm(f => ({
    ...f,
    skinProblems: f.skinProblems.includes(p) ? f.skinProblems.filter(x => x !== p) : [...f.skinProblems, p],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setErr('');
    try {
      // Profil varsa güncelle, yoksa oluştur
      const fn = hasProfile ? api.updateSkinProfile : api.createSkinProfile;
      const res = await fn(user.id, form);
      if (res.code >= 400) {
        if (res.message?.toLowerCase().includes('put') || res.message?.toLowerCase().includes('mevcut')) {
          // Profil zaten var, güncelle
          const updateRes = await api.updateSkinProfile(user.id, form);
          if (updateRes.code >= 400) { setErr(updateRes.message); }
          else { setMsg('Cilt profili güncellendi! ✅'); setHasProfile(true); }
        } else {
          setErr(res.message);
        }
      } else {
        setMsg(hasProfile ? 'Cilt profili güncellendi! ✅' : 'Cilt profili oluşturuldu! ✅');
        setHasProfile(true);
      }
    } catch { setErr('Hata oluştu.'); }
    setLoading(false);
  };

  const handleDeleteHistory = async () => {
    if (!window.confirm('Tüm arama geçmişini sil?')) return;
    await api.deleteSearchHistory(user.id);
    setHistory([]);
  };

  if (profileLoading) return <div className="loading-screen">Yükleniyor...</div>;

  return (
    <div className="page-wrapper">
      <h1 className="page-title">🌿 Profilim</h1>
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Cilt Profili</button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Arama Geçmişi</button>
      </div>

      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: 580 }}>
          {hasProfile && (
            <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
              ✅ Mevcut cilt profiliniz yüklendi. Değişiklik yapıp kaydedebilirsiniz.
            </div>
          )}
          {msg && <div className="alert alert-success">{msg}</div>}
          {err && <div className="alert alert-error">{err}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cilt Tipi</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {SKIN_TYPES.map(t => (
                  <button key={t} type="button"
                    className={`btn btn-sm ${form.skinType === t ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setForm(f => ({ ...f, skinType: t }))}>{t}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Hassasiyet</label>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                <button type="button" className={`btn btn-sm ${form.sensitivity ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setForm(f => ({ ...f, sensitivity: true }))}>Evet</button>
                <button type="button" className={`btn btn-sm ${!form.sensitivity ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setForm(f => ({ ...f, sensitivity: false }))}>Hayır</button>
              </div>
            </div>

            <div className="form-group">
              <label>Cilt Sorunları</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {PROBLEMS.map(p => (
                  <button key={p} type="button"
                    className={`btn btn-sm ${form.skinProblems.includes(p) ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleProblem(p)}>{p}</button>
                ))}
              </div>
            </div>

            <div className="divider" />
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Kaydediliyor...' : hasProfile ? '💾 Profili Güncelle' : '✨ Profil Oluştur'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text2)' }}>{history.length} arama</h3>
            {history.length > 0 && <button className="btn btn-danger btn-sm" onClick={handleDeleteHistory}>🗑️ Geçmişi Sil</button>}
          </div>
          {histLoading ? <div className="loading-screen">Yükleniyor...</div> : history.length === 0 ? (
            <div className="empty-state"><div className="icon">🔍</div><p>Arama geçmişi boş.</p></div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="table">
                <thead><tr><th>Arama</th><th>Tarih</th></tr></thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>🔍 {h.query}</td>
                      <td style={{ color: 'var(--text2)' }}>{new Date(h.searchedOn).toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}