import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getFavorites(user.id).then(data => {
      setFavorites(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user.id]);

  const handleRemove = async (e, pid) => {
    e.stopPropagation();
    await api.removeFavorite(user.id, pid);
    setFavorites(f => f.filter(p => p._id !== pid));
  };

  if (loading) return <div className="loading-screen">Yükleniyor...</div>;

  return (
    <div className="page-wrapper">
      <h1 className="page-title">♥ Favorilerim</h1>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="icon">♡</div>
          <p>Henüz favori ürün eklemediniz.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Ürünlere Git</button>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map(p => (
            <div key={p._id} className="product-card" onClick={() => navigate(`/products/${p._id}`)}>
              <div className="product-card-img">💊</div>
              <div className="product-card-body">
                <div className="product-card-brand">{p.brand}</div>
                <div className="product-card-name">{p.name}</div>
                <div className="product-card-price">{p.price?.toFixed(2)} ₺</div>
                <div className="product-card-category">{p.category}</div>
                <div className="product-card-actions">
                  <button className="btn btn-sm btn-danger" onClick={e => handleRemove(e, p._id)}>✕ Kaldır</button>
                  <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); navigate(`/products/${p._id}/reviews`); }}>💬</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
