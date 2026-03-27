const Review  = require('../models/Review');
const Product = require('../models/Product');

// Ürünün averageRating'ini yorumlardan yeniden hesapla
const recalcRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  if (!reviews.length) {
    await Product.findByIdAndUpdate(productId, { averageRating: 0, totalRatings: 0 });
    return;
  }
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, {
    averageRating: parseFloat(avg.toFixed(1)),
    totalRatings:  reviews.length,
  });
};

// ────────────────────────────────────────────────────────
// #18 Menekşe Nazik — Yorumları Listele
// ────────────────────────────────────────────────────────
exports.listReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = { product: req.params.productId };

    const product = await Product.findById(req.params.productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Review.countDocuments(filter);
    const data  = await Review.find(filter)
      .populate('user', 'fullName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const formatted = data.map(r => ({
      id:        r._id,
      productId: r.product,
      userId:    r.user._id,
      userName:  r.user.fullName,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return res.json({
      data: formatted,
      averageRating: product.averageRating,
      totalReviews:  total,
      pagination: {
        page: Number(page), limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #16 Menekşe Nazik — Yorum Ekle
// ────────────────────────────────────────────────────────
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating)
      return res.status(400).json({ code: 400, message: 'rating zorunludur.' });

    const product = await Product.findById(req.params.productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });

    const existing = await Review.findOne({ product: req.params.productId, user: req.user.id });
    if (existing)
      return res.status(409).json({ code: 409, message: 'Bu ürüne zaten yorum yaptınız.' });

    const review = await Review.create({
      product: req.params.productId,
      user:    req.user.id,
      rating,
      comment,
    });

    await recalcRating(req.params.productId);

    return res.status(201).json({
      id: review._id, productId: review.product, userId: review.user,
      rating: review.rating, comment: review.comment,
      createdAt: review.createdAt, updatedAt: review.updatedAt,
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ code: 409, message: 'Bu ürüne zaten yorum yaptınız.' });
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #19 Menekşe Nazik — Yorum Güncelle
// ────────────────────────────────────────────────────────
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review)
      return res.status(404).json({ code: 404, message: 'Yorum bulunamadı.' });

    // Sadece yorum sahibi güncelleyebilir
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    await recalcRating(req.params.productId);

    return res.json({
      id: review._id, productId: review.product, userId: review.user,
      rating: review.rating, comment: review.comment,
      createdAt: review.createdAt, updatedAt: review.updatedAt,
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #17 Menekşe Nazik — Yorum Sil
// ────────────────────────────────────────────────────────
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review)
      return res.status(404).json({ code: 404, message: 'Yorum bulunamadı.' });

    // Sahibi veya admin silebilir
    const isOwner = review.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    await review.deleteOne();
    await recalcRating(req.params.productId);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #20 Menekşe Nazik — Ürünü Puanla (yorum opsiyonel)
// ────────────────────────────────────────────────────────
exports.rateProduct = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ code: 400, message: 'rating 1-5 arasında olmalıdır.' });

    const product = await Product.findById(req.params.productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });

    // Mevcut yorum varsa güncelle, yoksa yeni oluştur
    await Review.findOneAndUpdate(
      { product: req.params.productId, user: req.user.id },
      { rating },
      { upsert: true, new: true }
    );

    await recalcRating(req.params.productId);
    const updated = await Product.findById(req.params.productId);

    return res.json({
      productId:       updated._id,
      userRating:      rating,
      newAverageRating: updated.averageRating,
      totalRatings:    updated.totalRatings,
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};
