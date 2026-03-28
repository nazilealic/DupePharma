const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const alternativeController = require('../controllers/alternativeController');

// #28 Bahar — POST /ai/product-analysis
// Body: { productId: "..." }
router.post('/product-analysis', protect, alternativeController.aiAnalysisPost);

module.exports = router;