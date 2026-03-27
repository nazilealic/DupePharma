const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

// ─────────────────────────────────────────────
// ÜRÜN ENDPOINTLERİ — Nazile Alıç
// ─────────────────────────────────────────────

// GET /v1/products — Tüm ürünleri listele (kategori + fiyat filtresi + pagination)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

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
      return res.status(404).json({ code: 404, message: 'Belirtilen kriterlere uygun ürün bulunamadı.' });
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

// ─────────────────────────────────────────────
// YORUM & PUANLAMA ENDPOINTLERİ — Menekşe Nazik
// ─────────────────────────────────────────────

// GET /v1/products/:productId/reviews — Yorumları listele
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email');

    res.json({ reviews });

  } catch (err) {
    console.log('Yorumlar listelenirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// POST /v1/products/:productId/reviews — Yorum ekle
router.post('/:productId/reviews', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    const review = new Review({
      user: req.user.id,
      product: productId,
      comment
    });

    await review.save();

    res.json({ message: 'Yorum eklendi', review });

  } catch (err) {
    console.log('Yorum eklerken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// DELETE /v1/products/:productId/reviews/:reviewId — Yorum sil
router.delete('/:productId/reviews/:reviewId', authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Yorum silindi' });

  } catch (err) {
    console.log('Yorum silerken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// PUT /v1/products/:productId/reviews/:reviewId — Yorum güncelle
router.put('/:productId/reviews/:reviewId', authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu yorumu güncelleme yetkiniz yok' });
    }

    review.comment = comment;
    await review.save();

    res.json({ message: 'Yorum güncellendi', review });

  } catch (err) {
    console.log('Yorum güncellerken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// POST /v1/products/:productId/ratings — Ürüne puan ver
const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);

router.post('/:productId/ratings', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Lütfen 1 ile 5 arasında bir puan veriniz.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    const existingRating = await Rating.findOne({ user: req.user.id, product: productId });
    if (existingRating) {
      return res.status(400).json({ message: 'Bu ürüne zaten puan verdiniz.' });
    }

    const newRating = new Rating({ user: req.user.id, product: productId, rating });
    await newRating.save();

    const allRatings = await Rating.find({ product: productId });
    const averageRating = (allRatings.reduce((sum, item) => sum + item.rating, 0) / allRatings.length).toFixed(1);

    product.averageRating = averageRating;
    await product.save();

    res.json({
      message: 'Puanınız başarıyla kaydedildi.',
      yourRating: rating,
      newAverageRating: averageRating
    });

  } catch (err) {
    console.error('Puan verme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;