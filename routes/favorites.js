const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const favoritesController = require('../controllers/favoritesController');

// #13 Şadiye — Favorileri Listele
router.get('/:userId/favorites', protect, favoritesController.listFavorites);

// #11 Şadiye — Favorilere Ekle
router.post('/:userId/favorites', protect, favoritesController.addFavorite);

// #12 Şadiye — Favorilerden Çıkar
router.delete('/:userId/favorites/:productId', protect, favoritesController.removeFavorite);

module.exports = router;
