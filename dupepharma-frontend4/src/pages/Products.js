import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Products() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage]             = useState(1);
  const [favorites, setFavorites]   = useState([]);
  const [favLoading, setFavLoading] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let params = `?page=${page}&limit=12`;
    if (category) params += `&category=${encodeURIComponent(category)}`;
    if (minPrice) params += `&minPrice=${minPrice}`;
    if (maxPrice) params += `&maxPrice=${maxPrice}`;
    try {
      const data = await api.getProducts(params);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    setLoading(false);
  }, [page, category, minPrice, maxPrice]);

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.getFavorites(user.id);
      if (Array.isArray(data)) setFavorites(data.map(f => f._id || f));
    } catch {}
  }, [user.id]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { setPage(1); return fetchProducts(); }
    setLoading(true);
    try {
      const data = await api.searchProducts(search);
      setProducts(Array.isArray(data) ? data : []);
      setPagination({});
    } catch {}
    setLoading(false);
  };

  const toggleFav = async (e, pid) => {
    e.stopPropagation();
    setFavLoading(f => ({ ...f, [pid]: true }));
    try {
      if (favorites.includes(pid)) {
        await api.removeFavorite(user.id, pid);
        setFavorites(f => f.filter(id => id !== pid));
      } else {
        await api.addFavorite(user.id, pid);
        setFavorites(f => [...f, pid]);
      }
    } catch {}
    setFavLoading(f => ({ ...f, [pid]: false }));
  };

  const renderStars = (r) => {
    const full = Math.round(r);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Ürünler</h1>

      {/* Arama */}
      <form onSubmit={handleSearch} className="search-row">
        <input type="text" placeholder="Ürün adı veya marka ara..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="btn btn-primary">🔍 Ara</button>
        {search && (
          <button type="button" className="btn btn-secondary"
            onClick={() => { setSearch(''); setPage(1); fetchProducts(); }}>✕ Temizle</button>
        )}
      </form>

      {/* Filtreler */}
      <div className="filter-row">
        <div className="filter-group">
          <label>Kategori</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">Tümü</option>
            <option value="nemlendirici">Nemlendirici</option>
            <option value="temizleyici">Temizleyici</option>
            <option value="güneş koruyucu">Güneş Koruyucu</option>
            <option value="serum">Serum</option>
            <option value="tonik">Tonik</option>
            <option value="takviye">Temizleyici</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Min Fiyat (₺)</label>
          <input type="number" placeholder="0" value={minPrice}
            onChange={e => { setMinPrice(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-group">
          <label>Max Fiyat (₺)</label>
          <input type="number" placeholder="9999" value={maxPrice}
            onChange={e => { setMaxPrice(e.target.value); setPage(1); }} />
        </div>
        <button className="btn btn-secondary" style={{ alignSelf: 'flex-end' }}
          onClick={() => { setCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1); }}>
          Sıfırla
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="product-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card">
              <div className="skeleton" style={{ height: 160 }} />
              <div className="product-card-body">
                <div className="skeleton" style={{ height: 10, width: '50%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '35%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <p>Ürün bulunamadı.</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map(p => (
              <div key={p._id} className="product-card" onClick={() => navigate(`/products/${p._id}`)}>
                <div className="product-card-img">
                 {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name}
                  style={{ width:'100%', height:'160px', objectFit:'contain', padding:'8px' }}
                  onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML='💊'; }} />
                   : '💊'
                     }
                </div>
                <div className="product-card-body">
                  <div className="product-card-brand">{p.brand}</div>
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-price">{p.price?.toFixed(2)} ₺</div>
                  <div className="product-card-category">{p.category}</div>
                  {p.averageRating > 0 && (
                    <div className="product-card-rating">
                      <span style={{ color: 'var(--accent)' }}>{renderStars(p.averageRating)}</span>
                      <span>({p.totalRatings})</span>
                    </div>
                  )}
                  <div className="product-card-actions">
                    <button className="btn btn-sm btn-secondary"
                      style={{ color: favorites.includes(p._id) ? 'var(--accent)' : undefined }}
                      onClick={e => toggleFav(e, p._id)} disabled={favLoading[p._id]}>
                      {favorites.includes(p._id) ? '♥ Favoride' : '♡ Favori'}
                    </button>
                    <button className="btn btn-sm btn-secondary"
                      onClick={e => { e.stopPropagation(); navigate(`/products/${p._id}/reviews`); }}>
                      💬
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Önceki</button>
              <span style={{ padding: '0.4rem 1rem', color: 'var(--text2)' }}>{page} / {pagination.totalPages}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.totalPages}>Sonraki →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
