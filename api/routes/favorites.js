const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET /api/favorites — Kullanıcının favorilerini getir
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// POST /api/favorites/:productId — Favoriye ekle
router.post('/:productId', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: req.params.productId } }
    );
    res.json({ message: 'Favorilere eklendi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// DELETE /api/favorites/:productId — Favoriden çıkar
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: req.params.productId } }
    );
    res.json({ message: 'Favorilerden çıkarıldı' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
