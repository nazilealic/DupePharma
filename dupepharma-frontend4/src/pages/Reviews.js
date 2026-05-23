import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Stars = ({ value, onChange, readOnly }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`star ${s <= value ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
        onClick={() => !readOnly && onChange && onChange(s)}>★</span>
    ))}
  </div>
);

export default function Reviews() {
  const { id: productId } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRating, setUserRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const data = await api.getReviews(productId);
      setReviews(data.data || []);
      setAvg(data.averageRating || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const flash = (type, msg) => {
    if (type === 'success') setSuccess(msg); else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await api.createReview(productId, form);
    if (res.code >= 400) { flash('error', res.message); return; }
    flash('success', 'Yorum eklendi! ✅');
    setForm({ rating: 5, comment: '' });
    fetchReviews();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await api.updateReview(productId, editId, editForm);
    if (res.code >= 400) { flash('error', res.message); return; }
    setEditId(null);
    flash('success', 'Yorum güncellendi! ✅');
    fetchReviews();
  };

  const handleDelete = async (rid) => {
    if (!window.confirm('Yorumu sil?')) return;
    await api.deleteReview(productId, rid);
    flash('success', 'Yorum silindi.');
    fetchReviews();
  };

  const handleRate = async (r) => {
    setUserRating(r);
    await api.rateProduct(productId, r);
    flash('success', 'Puanınız kaydedildi! ✅');
    fetchReviews();
  };

  if (loading) return <div className="loading-screen">Yükleniyor...</div>;

  return (
    <div className="page-wrapper">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>← Geri</button>
      <h1 className="page-title">💬 Yorumlar</h1>

      {/* Özet */}
      <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 700, color: 'var(--accent)' }}>{avg.toFixed(1)}</div>
          <Stars value={Math.round(avg)} readOnly />
          <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginTop: '0.3rem' }}>{reviews.length} yorum</div>
        </div>
        <div>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>Ürünü puanlayın:</p>
          <Stars value={userRating} onChange={handleRate} />
        </div>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Yorum Ekle */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Yorum Ekle</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Puanınız</label>
            <Stars value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
          </div>
          <div className="form-group">
            <label>Yorumunuz</label>
            <textarea placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
              value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary">💬 Yorum Ekle</button>
        </form>
      </div>

      {/* Liste */}
      {reviews.length === 0 ? (
        <div className="empty-state"><div className="icon">💬</div><p>Henüz yorum yok.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(r => (
            <div key={r.id} className="card">
              {editId === r.id ? (
                <form onSubmit={handleEdit}>
                  <Stars value={editForm.rating} onChange={v => setEditForm(f => ({ ...f, rating: v }))} />
                  <textarea style={{ marginTop: '0.75rem' }} value={editForm.comment}
                    onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary btn-sm">Kaydet</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>İptal</button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{r.userName}</strong>
                      <div style={{ marginTop: '0.2rem' }}><Stars value={r.rating} readOnly /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
                      {(r.userId === user.id || isAdmin) && (
                        <>
                          <button className="icon-btn" onClick={() => { setEditId(r.id); setEditForm({ rating: r.rating, comment: r.comment || '' }); }}>✏️</button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(r.id)}>🗑️</button>
                        </>
                      )}
                    </div>
                  </div>
                  {r.comment && <p style={{ color: 'var(--text2)', marginTop: '0.75rem', lineHeight: 1.6, fontSize: '0.9rem' }}>{r.comment}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
