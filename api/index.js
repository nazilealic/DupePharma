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


// Server başlat
// ------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});