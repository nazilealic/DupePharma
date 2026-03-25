const mongoose = require("mongoose"); // Bu satır mutlaka olmalı!
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/auth");

// YORUM LİSTELE
router.get("/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email");

    res.json({ reviews });

  } catch (err) {
    console.log("Yorumlar listelenirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// YORUM EKLE
router.post("/:productId/reviews", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment } = req.body;

    console.log("Token decoded user:", req.user);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const review = new Review({
      user: req.user.id,
      product: productId,
      comment
    });

    await review.save();
    product.reviews.push(review._id);
    await product.save();

    res.json({ message: "Yorum eklendi", review });

  } catch (err) {
    console.log("Yorum eklerken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// YORUM SİL
router.delete("/:productId/reviews/:reviewId", authMiddleware, async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu yorumu silme yetkiniz yok" });
    }

    await Review.findByIdAndDelete(reviewId);

    await Product.findByIdAndUpdate(productId, {
      $pull: { reviews: reviewId }
    });

    res.json({ message: "Yorum silindi" });

  } catch (err) {
    console.log("Yorum silerken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


// YORUM GÜNCELLE
router.put("/:productId/reviews/:reviewId", authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    // Yorumu bul
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    // Sadece yorumu yazan veya admin güncelleyebilir
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu yorumu güncelleme yetkiniz yok" });
    }

    // Yorumu güncelle
    review.comment = comment;
    await review.save();

    res.json({ message: "Yorum güncellendi", review });

  } catch (err) {
    console.log("Yorum güncellerken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});




// ÖNCE: Rating için bir Schema tanımlayalım (Hata almamak için dosyanın üst kısımlarına da koyabilirsin)
const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

// Eğer Rating modeli daha önce tanımlanmadıysa oluştur
const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);

// --- 20. ÜRÜNE PUAN VERME (POST) ---
router.post("/:productId/ratings", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating } = req.body; // Postman'den gelecek (1-5 arası rakam)

    // 1. Geçerlilik Kontrolü
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Lütfen 1 ile 5 arasında bir puan veriniz." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    // 2. Mükerrer Kontrolü: Kullanıcı bu ürüne daha önce puan vermiş mi?
    const existingRating = await Rating.findOne({ user: req.user.id, product: productId });
    
    if (existingRating) {
      // Eğer daha önce puan verdiyse puanını güncelleyebiliriz veya hata döndürebiliriz. 
      // Şimdilik hata döndürelim:
      return res.status(400).json({ message: "Bu ürüne zaten puan verdiniz." });
    }

    // 3. Puanı Kaydet
    const newRating = new Rating({
      user: req.user.id,
      product: productId,
      rating
    });
    await newRating.save();

    // 4. Ortalama Hesapla
    // Ürüne ait tüm puanları buluyoruz
    const allRatings = await Rating.find({ product: productId });
    const totalRatingSum = allRatings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = (totalRatingSum / allRatings.length).toFixed(1); // 4.5 gibi tek basamaklı

    // 5. Ürün Modelindeki Ortalamayı Güncelle
    // (Product.js modelinde 'averageRating' alanı olduğunu varsayıyoruz)
    product.averageRating = averageRating;
    await product.save();

    res.json({ 
      message: "Puanınız başarıyla kaydedildi.", 
      yourRating: rating,
      newAverageRating: averageRating 
    });

  } catch (err) {
    console.error("Puan verme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});



module.exports = router;



