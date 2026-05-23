const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const searchHistoryController = require('../controllers/searchHistoryController');

// #5 Nazile — Arama Geçmişini Görüntüle
router.get('/:userId/search-history',    protect, searchHistoryController.getSearchHistory);

// #6 Nazile — Arama Geçmişini Sil
router.delete('/:userId/search-history', protect, searchHistoryController.deleteSearchHistory);

module.exports = router;