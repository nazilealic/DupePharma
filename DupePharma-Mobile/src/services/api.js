import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://dupepharma.onrender.com';

const getToken = async () => {
  try { return await AsyncStorage.getItem('token'); } catch { return null; }
};

const authHeaders = async () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${await getToken()}`,
});

const api = {
  // ── AUTH ──────────────────────────────────────────
  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  logout: async () => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });
    return res.status;
  },

  updatePassword: async (userId, data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── PRODUCTS ──────────────────────────────────────
  getProducts: async (params = '') => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products${params}`, { headers });
    return res.json();
  },

  searchProducts: async (query) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/search?query=${encodeURIComponent(query)}`, { headers });
    return res.json();
  },

  getProductDetails: async (id) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${id}/details`, { headers });
    return res.json();
  },

  getAlternatives: async (id) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${id}/alternatives`, { headers });
    return res.json();
  },

  getPriceComparison: async (id) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${id}/price-comparison`, { headers });
    return res.json();
  },

  // ── AI ─────────────────────────────────────────────
  aiAnalysis: async (productId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/ai/product-analysis`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId }),
    });
    return res.json();
  },

  // ── FAVORITES ──────────────────────────────────────
  getFavorites: async (userId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/favorites`, { headers });
    return res.json();
  },

  addFavorite: async (userId, productId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId }),
    });
    return res.json();
  },

  removeFavorite: async (userId, productId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/favorites/${productId}`, {
      method: 'DELETE',
      headers,
    });
    return res.status;
  },

  // ── SKIN PROFILE ───────────────────────────────────
  getSkinProfile: async (userId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/skin-profile`, { headers });
    return res.json();
  },

  createSkinProfile: async (userId, data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/skin-profile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateSkinProfile: async (userId, data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/skin-profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── SEARCH HISTORY ─────────────────────────────────
  getSearchHistory: async (userId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/search-history`, { headers });
    return res.json();
  },

  deleteSearchHistory: async (userId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/search-history`, {
      method: 'DELETE',
      headers,
    });
    return res.status;
  },

  // ── REVIEWS ────────────────────────────────────────
  getReviews: async (productId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, { headers });
    return res.json();
  },

  createReview: async (productId, data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...data,
        comment: data.body || data.comment,
      }),
    });
    const result = await res.json();
    console.log('createReview response:', JSON.stringify(result));
    return result;
  },

  updateReview: async (productId, reviewId, data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews/${reviewId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteReview: async (productId, reviewId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers,
    });
    return res.status;
  },

  rateProduct: async (productId, rating) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/products/${productId}/ratings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ rating }),
    });
    return res.json();
  },

  // ── PHARMACIES ─────────────────────────────────────
  getOnDutyPharmacy: async () => {
    const res = await fetch(`${BASE_URL}/pharmacies/on-duty`);
    return res.json();
  },

  updateOnDutyPharmacy: async (formData) => {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/pharmacies/on-duty`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  // ── ADMIN ──────────────────────────────────────────
  getUsers: async () => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/admin/users`, { headers });
    return res.json();
  },

  deleteUser: async (userId) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, { method: 'DELETE', headers });
    return res.status;
  },

  createProduct: async (data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateProduct: async (id, data) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteProduct: async (id) => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers,
    });
    return res.status;
  },
};

export default api;
