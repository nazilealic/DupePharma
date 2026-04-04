import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EMPTY = { name:'', brand:'', category:'', price:'', description:'', ingredients:'', volume:'', usageInstructions:'', imageUrl:'' };

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts]   = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  const [users, setUsers]         = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts('?limit=100');
      setProducts(data.data || []);
    } catch {}
    setProdLoading(false);
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {}
    setUserLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab]);

  const openCreate = () => {
    setForm(EMPTY); setEditItem(null); setError('');
    setImageFile(null); setImagePreview(null); setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({ ...p, price: p.price?.toString(), ingredients: (p.ingredients || []).join(', ') });
    setEditItem(p); setError('');
    setImageFile(null);
    setImagePreview(p.imageUrl || null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      let imageUrl = form.imageUrl || '';
      if (imageFile) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(imageFile);
        });
      }
      const payload = {
        ...form,
        price: parseFloat(form.price),
        imageUrl,
        ingredients: form.ingredients ? form.ingredients.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const res = editItem
        ? await api.updateProduct(editItem._id, payload)
        : await api.createProduct(payload);

      if (res.code >= 400) { setError(res.message); setSaving(false); return; }
      setSuccess(editItem ? 'Ürün güncellendi! ✅' : 'Ürün eklendi! ✅');
      setTimeout(() => setSuccess(''), 3000);
      setShowModal(false);
      fetchProducts();
    } catch { setError('Hata oluştu.'); }
    setSaving(false);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`"${name}" silinsin mi?`)) return;
    const status = await api.deleteProduct(id);
    if (status === 204) { setSuccess('Ürün silindi. ✅'); setTimeout(() => setSuccess(''), 3000); fetchProducts(); }
    else setError('Silinemedi.');
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`"${name}" kullanıcısı silinsin mi?`)) return;
    const status = await api.deleteUser(id);
    if (status === 204) { setSuccess('Kullanıcı silindi. ✅'); setTimeout(() => setSuccess(''), 3000); fetchUsers(); }
    else setError('Kullanıcı silinemedi.');
  };

  const handleResetPassword = async (u) => {
    const yeniSifre = prompt(`${u.fullName} için yeni şifre girin (min 8 karakter):`);
    if (!yeniSifre) return;
    if (yeniSifre.length < 8) { alert('Şifre en az 8 karakter olmalı!'); return; }
    try {
      const res = await api.updatePassword(u._id || u.id, { newPassword: yeniSifre });
      if (res.message && !res.code) {
        setSuccess(`${u.fullName} için şifre güncellendi! ✅`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.message || 'Şifre güncellenemedi.');
      }
    } catch { setError('Hata oluştu.'); }
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    (u.fullName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <h1 className="page-title">⚙️ Admin Paneli</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error" onClick={() => setError('')}>{error}</div>}

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          🛍️ Ürün Yönetimi
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          👥 Kullanıcı Yönetimi
        </button>
      </div>

      {/* ── ÜRÜN YÖNETİMİ ── */}
      {activeTab === 'products' && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <div className="search-row" style={{ margin: 0, flex: 1, marginRight: '1rem' }}>
              <input type="text" placeholder="Ürün veya marka ara..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openCreate}>+ Ürün Ekle</button>
          </div>

          {prodLoading ? <div className="loading-screen">Yükleniyor...</div> : (
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <table className="table">
                <thead>
                  <tr><th>Resim</th><th>Ürün Adı</th><th>Marka</th><th>Kategori</th><th>Fiyat</th><th>Puan</th><th>İşlemler</th></tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id}>
                      <td>
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name}
                              style={{ width:40, height:40, borderRadius:6, objectFit:'cover', border:'1px solid var(--border)' }}
                              onError={e => { e.target.style.display='none'; }} />
                          : <span style={{ fontSize:'1.5rem' }}>💊</span>}
                      </td>
                      <td style={{ fontWeight:500 }}>{p.name}</td>
                      <td style={{ color:'var(--accent)' }}>{p.brand}</td>
                      <td><span className="badge badge-gold">{p.category}</span></td>
                      <td style={{ fontWeight:600 }}>{p.price?.toFixed(2)} ₺</td>
                      <td style={{ color:'var(--text2)' }}>{p.averageRating?.toFixed(1)} ★</td>
                      <td>
                        <div style={{ display:'flex', gap:'0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Düzenle</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p._id, p.name)}>🗑️ Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text2)', padding:'2rem' }}>Ürün bulunamadı.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── KULLANICI YÖNETİMİ ── */}
      {activeTab === 'users' && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <input type="text" placeholder="İsim veya e-posta ara..."
              value={userSearch} onChange={e => setUserSearch(e.target.value)} />
          </div>

          {userLoading ? <div className="loading-screen">Yükleniyor...</div> : (
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <table className="table">
                <thead>
                  <tr><th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Kayıt Tarihi</th><th>İşlemler</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id || u.id}>
                      <td style={{ fontWeight:500 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--accent)', color:'#0c0c0e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:700 }}>
                            {u.fullName?.[0]?.toUpperCase()}
                          </div>
                          {u.fullName}
                        </div>
                      </td>
                      <td style={{ color:'var(--text2)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>
                          {u.role === 'admin' ? '⚙️ Admin' : '👤 Kullanıcı'}
                        </span>
                      </td>
                      <td style={{ color:'var(--text2)', fontSize:'0.85rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:'0.4rem' }}>
                          <button className="btn btn-secondary btn-sm"
                            disabled={u.role === 'admin'}
                            onClick={() => handleResetPassword(u)}>
                            🔑 Şifre
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(u._id || u.id, u.fullName)}
                            disabled={u.role === 'admin'}>
                            🗑️ Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text2)', padding:'2rem' }}>Kullanıcı bulunamadı.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── ÜRÜN MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? '✏️ Ürün Düzenle' : '+ Ürün Ekle'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Ürün Adı *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label>Marka *</label>
                  <input required value={form.brand} onChange={e => setForm(f => ({...f, brand:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label>Kategori *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({...f, category:e.target.value}))}>
                    <option value="">Seçin</option>
                    <option value="nemlendirici">Nemlendirici</option>
                    <option value="temizleyici">Temizleyici</option>
                    <option value="güneş koruyucu">Güneş Koruyucu</option>
                    <option value="serum">Serum</option>
                    <option value="tonik">Tonik</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fiyat (₺) *</label>
                  <input required type="number" step="0.01" value={form.price}
                    onChange={e => setForm(f => ({...f, price:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label>Hacim</label>
                  <input placeholder="100 ml" value={form.volume} onChange={e => setForm(f => ({...f, volume:e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label>Ürün Resmi</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Önizleme"
                    style={{ width:'100%', maxHeight:140, objectFit:'contain', borderRadius:8, marginTop:8, border:'1px solid var(--border)' }} />
                )}
                {!imageFile && (
                  <>
                    <p style={{ color:'var(--text2)', fontSize:'0.78rem', margin:'0.4rem 0 0.25rem' }}>veya URL girin:</p>
                    <input type="url" placeholder="https://..." value={form.imageUrl}
                      onChange={e => setForm(f => ({...f, imageUrl:e.target.value}))} />
                  </>
                )}
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))} />
              </div>
              <div className="form-group">
                <label>İçerikler (virgülle ayırın)</label>
                <input placeholder="Aqua, Glycerin, Niacinamide" value={form.ingredients}
                  onChange={e => setForm(f => ({...f, ingredients:e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Kullanım Talimatları</label>
                <textarea value={form.usageInstructions} onChange={e => setForm(f => ({...f, usageInstructions:e.target.value}))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Kaydediliyor...' : editItem ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}