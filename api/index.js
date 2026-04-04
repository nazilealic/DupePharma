const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

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

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(process.env.PORT || 3000, () => {
        console.log(`Sunucu ${process.env.PORT || 3000} portunda çalışıyor`);
      });
    }
  })
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

module.exports = app;