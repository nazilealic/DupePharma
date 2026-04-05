const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: "https://dupe-pharma-vkej.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// 1. Manuel CORS header middleware (en güvenli yöntem)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dupe-pharma-vkej.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 2. OPTIONS preflight için cors middleware
app.options("*", cors(corsOptions));

// 3. Tüm route'lara cors uygula
app.use(cors(corsOptions));

// 4. JSON parser
app.use(express.json());

// 5. Static dosyalar
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. UptimeRobot için health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 7. Route'lar
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

// 8. MongoDB bağlantısı ve sunucu başlatma
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