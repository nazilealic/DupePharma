const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// POST /api/admin/products — Ürün ekle
router.post('/products', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin yetkisi gerekli' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Ürün eklendi', product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// PUT /api/admin/products/:productId — Ürün güncelle
router.put('/products/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin yetkisi gerekli' });
    }
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json({ message: 'Ürün güncellendi', product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// DELETE /api/admin/products/:productId — Ürün sil
router.delete('/products/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin yetkisi gerekli' });
    }
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json({ message: 'Ürün silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;