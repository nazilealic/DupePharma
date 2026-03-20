

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');


router.get('/:userId/favorites', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        code: 403,
        message: 'Başka bir kullanıcının favorilerine erişemezsiniz.'
      });
    }

    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });
    }

    res.status(200).json(user.favorites);

  } catch (error) {
    console.error('Favorileri listele hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});


router.post('/:userId/favorites', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({
        code: 403,
        message: 'Başka bir kullanıcının favorilerine ekleme yapamazsınız.'
      });
    }

    if (!productId) {
      return res.status(400).json({ code: 400, message: 'productId zorunludur.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });
    }

    if (user.favorites.includes(productId)) {
      return res.status(409).json({
        code: 409,
        message: 'Bu ürün zaten favorilerinizde mevcut.'
      });
    }

    user.favorites.push(productId);
    await user.save();

    res.status(201).json({ message: 'Ürün favorilere başarıyla eklendi.' });

  } catch (error) {
    console.error('Favorilere ekle hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});


router.delete('/:userId/favorites/:productId', authMiddleware, async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        code: 403,
        message: 'Başka bir kullanıcının favorilerini düzenleyemezsiniz.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });
    }

    if (!user.favorites.includes(productId)) {
      return res.status(404).json({
        code: 404,
        message: 'Bu ürün favorilerinizde bulunamadı.'
      });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    res.status(204).send();

  } catch (error) {
    console.error('Favorilerden çıkar hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

module.exports = router;
