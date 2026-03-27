const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /v1/auth/register — Gereksinim #23: Üye Olma
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: 'fullName, email ve password zorunludur.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        code: 409,
        message: 'Bu e-posta adresi zaten kullanımda.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu.',
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// POST /v1/auth/login — Gereksinim #21: Giriş Yapma
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: 'email ve password zorunludur.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ code: 401, message: 'Hatalı e-posta veya şifre.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: 'Hatalı e-posta veya şifre.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'gizli_anahtar',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

// POST /v1/auth/logout — Gereksinim #22: Çıkış Yapma
router.post('/logout', (req, res) => {
  res.status(204).send();
});

module.exports = router;