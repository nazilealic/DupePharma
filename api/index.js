const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── ROUTES ──────────────────────────────────────────
const authRoutes          = require('./routes/auth');
const productRoutes       = require('./routes/products');
const alternativeRoutes   = require('./routes/alternatives');
const searchHistoryRoutes = require('./routes/searchHistory');
const skinProfileRoutes   = require('./routes/skinProfile');
const favoritesRoutes     = require('./routes/favorites');
const pharmacyRoutes      = require('./routes/pharmacies');
const reviewRoutes        = require('./routes/reviews');
const adminRoutes         = require('./routes/admin');
const aiRoutes            = require('./routes/ai');

// ── MOUNT ────────────────────────────────────────────
app.use('/auth',       authRoutes);
app.use('/products',   productRoutes);
app.use('/products',   alternativeRoutes);
app.use('/products',   reviewRoutes);
app.use('/users',      searchHistoryRoutes);
app.use('/users',      skinProfileRoutes);
app.use('/users',      favoritesRoutes);
app.use('/pharmacies', pharmacyRoutes);
app.use('/admin',      adminRoutes);
app.use('/ai',         aiRoutes);

// ── DB ───────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

module.exports = app;