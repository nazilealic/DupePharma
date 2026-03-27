const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

// GET /api/reviews?productId=xxx — Ürüne ait yorumları getir
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { product: productId } : {};
    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// POST /api/reviews — Yorum ekle (giriş gerekli)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: 'productId ve rating zorunludur' });
    }
    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ message: 'Yorum eklendi', review });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// DELETE /api/reviews/:reviewId — Yorum sil (kendi yorumu)
router.delete('/:reviewId', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Yorum bulunamadı' });

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkisiz' });
    }

    await review.deleteOne();
    res.json({ message: 'Yorum silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
