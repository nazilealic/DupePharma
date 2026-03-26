const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// GET /api/products — Tüm ürünleri listele (arama + kategori filtresi)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// GET /api/products/:productId/details — Ürün detayı
router.get('/:productId/details', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// POST /api/products — Ürün ekle (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sadece admin ürün ekleyebilir' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Ürün eklendi', product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// PUT /api/products/:productId — Ürün güncelle (admin)
router.put('/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sadece admin güncelleyebilir' });
    }
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json({ message: 'Ürün güncellendi', product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// DELETE /api/products/:productId — Ürün sil (admin)
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sadece admin silebilir' });
    }
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json({ message: 'Ürün silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
