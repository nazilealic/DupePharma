const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// POST /api/ai/product-analysis — Ürün analizi
router.post('/product-analysis', authMiddleware, async (req, res) => {
  try {
    const { productName, ingredients } = req.body;

    if (!productName || !ingredients) {
      return res.status(400).json({ message: 'productName ve ingredients zorunludur' });
    }

    // Basit analiz simülasyonu
    const analysis = {
      product: productName,
      ingredients: ingredients,
      effects: 'Nemlendirici ve onarıcı etki',
      suitableSkinTypes: ['Normal', 'Kuru', 'Karma'],
      sideEffects: 'Hassas ciltlerde tahriş olabilir',
      recommendation: 'Günlük kullanım uygundur'
    };

    res.json({ message: 'Analiz tamamlandı', analysis });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;