const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Üye Olma
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        code: 409,
        message: 'Bu email zaten kayıtlı.'
      });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: 'Kullanıcı oluşturuldu'
    });

  } catch (error) {
    console.error('Register hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;