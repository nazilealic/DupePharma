const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const api = {
  // ── AUTH ──────────────────────────────────────────
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  logout: () =>
    fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(r => r.status),

  updatePassword: (userId, data) =>
    fetch(`${BASE_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // ── PRODUCTS ──────────────────────────────────────
  getProducts: (params = '') =>
    fetch(`${BASE_URL}/products${params}`, { headers: authHeaders() }).then(r => r.json()),

  searchProducts: (query) =>
    fetch(`${BASE_URL}/products/search?query=${encodeURIComponent(query)}`, {
      headers: authHeaders(),
    }).then(r => r.json()),

  getProductDetails: (id) =>
    fetch(`${BASE_URL}/products/${id}/details`, { headers: authHeaders() }).then(r => r.json()),

  getAlternatives: (id) =>
    fetch(`${BASE_URL}/products/${id}/alternatives`, { headers: authHeaders() }).then(r => r.json()),

  getPriceComparison: (id) =>
    fetch(`${BASE_URL}/products/${id}/price-comparison`, { headers: authHeaders() }).then(r => r.json()),

  // ── ADMIN ──────────────────────────────────────────
  createProduct: (data) =>
    fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  updateProduct: (id, data) =>
    fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deleteProduct: (id) =>
    fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(r => r.status),

  // ── AI ─────────────────────────────────────────────
  aiAnalysis: (productId) =>
    fetch(`${BASE_URL}/ai/product-analysis`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ productId }),
    }).then(r => r.json()),

  // ── FAVORITES ──────────────────────────────────────
  getFavorites: (userId) =>
    fetch(`${BASE_URL}/users/${userId}/favorites`, { headers: authHeaders() }).then(r => r.json()),

  addFavorite: (userId, productId) =>
    fetch(`${BASE_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ productId }),
    }).then(r => r.json()),

  removeFavorite: (userId, productId) =>
    fetch(`${BASE_URL}/users/${userId}/favorites/${productId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(r => r.status),

  // ── SKIN PROFILE ───────────────────────────────────
  createSkinProfile: (userId, data) =>
    fetch(`${BASE_URL}/users/${userId}/skin-profile`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  updateSkinProfile: (userId, data) =>
    fetch(`${BASE_URL}/users/${userId}/skin-profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // ── SEARCH HISTORY ─────────────────────────────────
  getSearchHistory: (userId) =>
    fetch(`${BASE_URL}/users/${userId}/search-history`, { headers: authHeaders() }).then(r => r.json()),

  deleteSearchHistory: (userId) =>
    fetch(`${BASE_URL}/users/${userId}/search-history`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(r => r.status),

  // ── REVIEWS ────────────────────────────────────────
  getReviews: (productId) =>
    fetch(`${BASE_URL}/products/${productId}/reviews`, { headers: authHeaders() }).then(r => r.json()),

  createReview: (productId, data) =>
    fetch(`${BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  updateReview: (productId, reviewId, data) =>
    fetch(`${BASE_URL}/products/${productId}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deleteReview: (productId, reviewId) =>
    fetch(`${BASE_URL}/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(r => r.status),

  rateProduct: (productId, rating) =>
    fetch(`${BASE_URL}/products/${productId}/ratings`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ rating }),
    }).then(r => r.json()),

  getSkinProfile: (userId) =>
    fetch(`${BASE_URL}/users/${userId}/skin-profile`, { headers: authHeaders() }).then(r => r.json()),

  // ── ADMIN USERS ────────────────────────────────────
  getUsers: () =>
    fetch(`${BASE_URL}/admin/users`, { headers: authHeaders() }).then(r => r.json()),
  deleteUser: (userId) =>
    fetch(`${BASE_URL}/admin/users/${userId}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.status),

  // ── PHARMACIES ─────────────────────────────────────
  getOnDutyPharmacy: () =>
    fetch(`${BASE_URL}/pharmacies/on-duty`).then(r => r.json()),

  updateOnDutyPharmacy: (formData) =>
    fetch(`${BASE_URL}/pharmacies/on-duty`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),
};

export default api;