const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
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

// ── DB & START ───────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Sunucu ${process.env.PORT || 3000} portunda çalışıyor`);
    });
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

module.exports = app;