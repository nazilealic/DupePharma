const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

// #23 Bahar Balım — Üye Ol
router.post('/register', authController.register);

// #21 Menekşe Nazik — Giriş
router.post('/login', authController.login);

// #22 Menekşe Nazik — Çıkış
router.post('/logout', protect, authController.logout);

module.exports = router;
