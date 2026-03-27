const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// GET /v1/products — Tüm ürünleri listele (kategori + fiyat filtresi + pagination)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = {};

    // Arama filtresi (isim bazlı)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Kategori filtresi
    if (category) {
      filter.category = category.toLowerCase();
    }

    // Fiyat aralığı filtresi
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalItems = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .select('name brand category price volume averageRating');

    if (products.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'Belirtilen kriterlere uygun ürün bulunamadı.'
      });
    }

    res.status(200).json({
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / Number(limit))
      }
    });

  } catch (error) {
    console.error('Ürün listeleme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// GET /v1/products/search — İsim veya marka ile arama
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ code: 400, message: 'Arama sorgusu zorunludur.' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } }
      ]
    }).select('name brand category price volume averageRating');

    if (products.length === 0) {
      return res.status(404).json({ code: 404, message: 'Arama sonucunda ürün bulunamadı.' });
    }

    res.status(200).json(products);

  } catch (error) {
    console.error('Ürün arama hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// GET /v1/products/:productId — Ürün detayı
router.get('/:productId', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });
    }

    res.status(200).json(product);

  } catch (error) {
    console.error('Ürün detay hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// POST /v1/products — Ürün ekle (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: 'Sadece admin ürün ekleyebilir.' });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Ürün eklendi.', product });

  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// PUT /v1/products/:productId — Ürün güncelle (admin)
router.put('/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: 'Sadece admin güncelleyebilir.' });
    }

    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!product) return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });

    res.status(200).json({ message: 'Ürün güncellendi.', product });

  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// DELETE /v1/products/:productId — Ürün sil (admin)
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: 'Sadece admin silebilir.' });
    }

    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });

    res.status(200).json({ message: 'Ürün silindi.' });

  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

module.exports = router;