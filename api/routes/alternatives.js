const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const alternativeController = require('../controllers/alternativeController');

// #2 Nazile — Muadil Ürünleri Listele
router.get('/:productId/alternatives', protect, alternativeController.listAlternatives);

// #3 Nazile — Fiyat Karşılaştırması
router.get('/:productId/price-comparison', protect, alternativeController.priceComparison);

// #28 Bahar — Yapay Zeka Analizi
router.get('/:productId/ai-analysis', protect, alternativeController.aiAnalysis);

module.exports = router;
