require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const mongoose = require("mongoose");

// Veritabanı bağlantısı
connectDB();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROTAYI BURADAN TAKİP ET ---

// 1. Auth İşlemleri (Kayıt, Giriş)
app.use('/v1/auth', require('./routes/auth'));

// 2. Ürün ve Yorum İşlemleri
app.use('/v1/products', require('./routes/products'));
app.use('/v1/products', require('./routes/reviews'));

// 3. Kullanıcı ve Favori İşlemleri
app.use('/v1/users', require('./routes/users'));
app.use('/v1/users', require('./routes/favorites'));

// 4. Eczane İşlemleri
app.use('/v1/pharmacies', require('./routes/pharmacies'));

// 5. Admin İşlemleri
app.use('/v1/admin', require('./routes/admin'));

// 6. AI İşlemleri
app.use('/v1/ai', require('./routes/ai'));

// Ana sayfa kontrolü
app.get('/', (req, res) => {
  res.json({ message: 'DupePharma API çalışıyor 🚀', version: '1.0.0' });
});

// 404 Hata yakalayıcı
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Endpoint bulunamadı. Lütfen URL başında /v1 olduğundan emin olun.' });
});

// Genel hata yönetimi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));

module.exports = app;