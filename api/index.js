// Gerekli modüller
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");
const Product = require("./models/Product"); // Product modelini import et

dotenv.config(); // .env dosyasını yükle

// Express app oluştur
const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json()); // JSON body parse

// MongoDB Atlas bağlantısı
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas bağlantısı başarılı"))
  .catch(err => console.error("MongoDB bağlantı hatası:", err));

// ------------------------
// ÜRÜN ENDPOINTLERİ
// ------------------------

// POST /products → test için ürün ekleme
app.post("/products", async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug için
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /products → tüm ürünleri listele
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /products/:id → ürün silme
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: `Ürün silindi: ${deleted.name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id/alternatives → muadil ürünleri listele
app.get("/products/:id/alternatives", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const alternatives = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      ingredients: { $in: product.ingredients }
    });

    res.json(alternatives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id/price-comparison → fiyat karşılaştırma
app.get("/products/:id/price-comparison", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const alternatives = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      ingredients: { $in: product.ingredients }
    });

    const comparison = [
      { name: product.name, brand: product.brand, price: product.price, isOriginal: true },
      ...alternatives.map(a => ({ name: a.name, brand: a.brand, price: a.price, isOriginal: false }))
    ];

    comparison.sort((a, b) => a.price - b.price);
    res.json(comparison);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ARAMA & GEÇMİŞ İŞLEMLERİ

// Arama ve history kaydetme
app.get("/products/search", async (req, res) => {
  try {
    const { query, userId } = req.query;
    if (!query) return res.status(400).json({ message: "Arama kelimesi boş olamaz" });

    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } }
      ]
    });

    if (userId) {
      try {
        let user = await User.findById(userId);
        if (!user) user = await User.findOne({ _id: userId });
        if (user) {
          user.searchHistory.push(query);
          await user.save();
        }
      } catch (err) {
        console.warn("User history kaydedilemedi:", err.message);
      }
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Arama geçmişi görüntüleme
app.get("/users/:userId/search-history", async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findById(userId);
    if (!user) user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    res.json(user.searchHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Arama geçmişi silme
app.delete("/users/:userId/search-history", async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findById(userId);
    if (!user) user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.searchHistory = [];
    await user.save();
    res.json({ message: "Arama geçmişi silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


//CİLT PROFİLİ İŞLEMLERİ

// Cilt Profili Oluşturma
app.post("/users/:userId/skin-profile", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skinType, sensitivity, concerns } = req.body;

    let user = await User.findById(userId);
    if (!user) user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.skinProfile = { skinType, sensitivity, concerns };
    await user.save();

    res.json({ message: "Cilt profili oluşturuldu", skinProfile: user.skinProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cilt Profili Güncelleme
app.put("/users/:userId/skin-profile", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skinType, sensitivity, concerns } = req.body;

    let user = await User.findById(userId);
    if (!user) user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.skinProfile = { skinType, sensitivity, concerns };
    await user.save();

    res.json({ message: "Cilt profili güncellendi", skinProfile: user.skinProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cilt Profili Görüntüleme
app.get("/users/:userId/skin-profile", async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findById(userId);
    if (!user) user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    if (!user.skinProfile) return res.status(404).json({ message: "Cilt profili bulunamadı" });

    res.json(user.skinProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Server başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});