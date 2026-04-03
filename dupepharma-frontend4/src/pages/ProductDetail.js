import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Stars = ({ value }) => (
  <span style={{ color: 'var(--accent)' }}>
    {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
  </span>
);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct]           = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [prices, setPrices]             = useState([]);
  const [aiReport, setAiReport]         = useState(null);
  const [tab, setTab]                   = useState('detail');
  const [loading, setLoading]           = useState(true);
  const [aiLoading, setAiLoading]       = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prod, alts, pc] = await Promise.all([
          api.getProductDetails(id),
          api.getAlternatives(id),
          api.getPriceComparison(id),
        ]);
        setProduct(prod);
        setAlternatives(Array.isArray(alts) ? alts : []);
        setPrices(Array.isArray(pc) ? pc : []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const data = await api.aiAnalysis(id);
      setAiReport(data);
      setTab('ai');
    } catch {}
    setAiLoading(false);
  };

  if (loading) return <div className="loading-screen">Yükleniyor...</div>;
  if (!product || product.code === 404) return (
    <div className="page-wrapper"><div className="empty-state"><p>Ürün bulunamadı.</p></div></div>
  );

  const recColor = { 'ÖNERILIR': 'badge-green', 'DİKKATLİ_KULLANIN': 'badge-gold', 'ÖNERİLMEZ': 'badge-red' };

  return (
    <div className="page-wrapper">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>← Geri</button>

      {/* Başlık */}
      <div className="card" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '4rem', lineHeight: 1 }}>💊</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{product.brand}</div>
          <h1 style={{ fontSize: '1.7rem', margin: '0.25rem 0 0.5rem' }}>{product.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '1.4rem', color: 'var(--accent)', fontWeight: 700 }}>{product.price?.toFixed(2)} ₺</span>
            <span className="badge badge-gold">{product.category}</span>
            {product.volume && <span style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>📦 {product.volume}</span>}
          </div>
          {product.averageRating > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: 'var(--text2)' }}>
              <Stars value={product.averageRating} /> {product.averageRating.toFixed(1)} ({product.totalRatings} değerlendirme)
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAI} disabled={aiLoading}>
              {aiLoading ? '⏳ Analiz ediliyor...' : '🤖 AI Analizi'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/products/${id}/reviews`)}>💬 Yorumlar</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['detail', 'alternatives', 'price'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ detail: 'Detaylar', alternatives: `Muadiller (${alternatives.length})`, price: 'Fiyat Karşılaştırması' }[t]}
          </button>
        ))}
        {aiReport && <button className={`tab-btn ${tab === 'ai' ? 'active' : ''}`} onClick={() => setTab('ai')}>🤖 AI Raporu</button>}
      </div>

      {/* Detay */}
      {tab === 'detail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {product.description && (
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>Açıklama</h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>{product.description}</p>
            </div>
          )}
          {product.ingredients?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>İçerikler</h3>
              <div className="tags">{product.ingredients.map((ing, i) => <span key={i} className="tag">{ing}</span>)}</div>
            </div>
          )}
          {product.usageInstructions && (
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>Kullanım Talimatları</h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>{product.usageInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Muadiller */}
      {tab === 'alternatives' && (
        alternatives.length === 0 ? (
          <div className="empty-state"><div className="icon">🔄</div><p>Muadil ürün bulunamadı.</p></div>
        ) : (
          <div className="product-grid">
            {alternatives.map(a => (
              <div key={a._id} className="product-card" onClick={() => navigate(`/products/${a._id}`)}>
                <div className="product-card-img">💊</div>
                <div className="product-card-body">
                  <div className="product-card-brand">{a.brand}</div>
                  <div className="product-card-name">{a.name}</div>
                  <div className="product-card-price">{a.price?.toFixed(2)} ₺</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Fiyat */}
      {tab === 'price' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr><th>Ürün</th><th>Marka</th><th>Hacim</th><th>Fiyat</th><th>₺/ml</th><th>Tür</th></tr>
            </thead>
            <tbody>
              {prices.map((item, i) => (
                <tr key={i} style={{ background: item.isOriginal ? 'rgba(201,169,110,0.04)' : undefined }}>
                  <td style={{ fontWeight: item.isOriginal ? 600 : 400 }}>{item.productName}</td>
                  <td style={{ color: 'var(--text2)' }}>{item.brand}</td>
                  <td style={{ color: 'var(--text2)' }}>{item.volume || '-'}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{item.price?.toFixed(2)} ₺</td>
                  <td style={{ color: 'var(--text2)' }}>{item.pricePerMl} ₺</td>
                  <td>{item.isOriginal ? <span className="badge badge-gold">Orijinal</span> : <span className="badge badge-green">Muadil</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI */}
      {tab === 'ai' && aiReport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Güvenlik Analizi</h3>
              <span className={`badge ${recColor[aiReport.recommendation] || 'badge-gold'}`}>{aiReport.recommendation}</span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>Güvenlik Skoru</span>
                <strong style={{ color: aiReport.safetyScore >= 70 ? 'var(--success)' : aiReport.safetyScore >= 40 ? 'var(--accent)' : 'var(--danger)' }}>
                  {aiReport.safetyScore}/100
                </strong>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${aiReport.safetyScore}%`,
                  background: aiReport.safetyScore >= 70 ? 'var(--success)' : aiReport.safetyScore >= 40 ? 'var(--accent)' : 'var(--danger)'
                }} />
              </div>
            </div>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '0.9rem' }}>{aiReport.analysisText}</p>
          </div>

          {aiReport.suitableForSkinTypes?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>Uygun Cilt Tipleri</h3>
              <div className="tags">{aiReport.suitableForSkinTypes.map((s, i) => <span key={i} className="tag">{s}</span>)}</div>
            </div>
          )}

          {aiReport.flaggedIngredients?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--danger)' }}>⚠️ Dikkat Gerektiren İçerikler</h3>
              {aiReport.flaggedIngredients.map((f, i) => (
                <div key={i} style={{ padding: '0.75rem', background: 'var(--bg3)', borderRadius: 9, marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--accent)' }}>{f.ingredient}</strong>
                  <p style={{ color: 'var(--text2)', fontSize: '0.84rem', marginTop: '0.2rem' }}>{f.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
