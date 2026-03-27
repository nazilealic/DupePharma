const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// #18 Menekşe — Yorumları Listele (public erişimli)
router.get('/:productId/reviews', reviewController.listReviews);

// #16 Menekşe — Yorum Ekle
router.post('/:productId/reviews', protect, reviewController.createReview);

// #19 Menekşe — Yorum Güncelle
router.put('/:productId/reviews/:reviewId', protect, reviewController.updateReview);

// #17 Menekşe — Yorum Sil
router.delete('/:productId/reviews/:reviewId', protect, reviewController.deleteReview);

// #20 Menekşe — Ürünü Puanla
router.post('/:productId/ratings', protect, reviewController.rateProduct);

module.exports = router;
