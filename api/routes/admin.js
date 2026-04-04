const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const User = require('../models/User');

// #25 Bahar — POST /admin/products
router.post('/products', protect, adminOnly, adminController.createProduct);

// #26 Bahar — PUT /admin/products/:productId
router.put('/products/:productId', protect, adminOnly, adminController.updateProduct);

// #27 Bahar — DELETE /admin/products/:productId
router.delete('/products/:productId', protect, adminOnly, adminController.deleteProduct);

// Tüm kullanıcıları listele
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
});

// Kullanıcı sil
router.delete('/users/:userId', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });
    if (user.role === 'admin') return res.status(403).json({ code: 403, message: 'Admin kullanıcı silinemez.' });
    await user.deleteOne();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;