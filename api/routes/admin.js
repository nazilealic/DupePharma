const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
 
// POST /v1/admin/products — Gereksinim #25: Admin Ürün Ekle
router.post('/products', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: 'Bu işlem için Admin yetkisi gereklidir.'
      });
    }
 
    const { name, brand, category, price, description, ingredients, usageInstructions, volume, imageUrl } = req.body;
 
    if (!name || !brand || !category || !price) {
      return res.status(400).json({
        code: 400,
        message: 'name, brand, category ve price zorunludur.'
      });
    }
 
    const product = await Product.create({
      name,
      brand,
      category: category.toLowerCase(),
      price,
      description,
      ingredients,
      usageInstructions,
      volume,
      imageUrl
    });
 
    res.status(201).json(product);
 
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});
 
// PUT /v1/products/:productId — Gereksinim #26: Admin Ürün Düzenle
router.put('/products/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: 'Bu işlem için Admin yetkisi gereklidir.'
      });
    }
 
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
 
    if (!product) {
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });
    }
 
    res.status(200).json(product);
 
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});
 
// DELETE /v1/products/:productId — Gereksinim #27: Admin Ürün Sil
router.delete('/products/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: 'Bu işlem için Admin yetkisi gereklidir.'
      });
    }
 
    const product = await Product.findByIdAndDelete(req.params.productId);
 
    if (!product) {
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });
    }
 
    res.status(204).send();
 
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});
 
module.exports = router;