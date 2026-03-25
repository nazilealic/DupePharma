const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Giriş başarılı", token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// LOGOUT  ← module.exports'tan ÖNCE olmalı
router.post("/logout", (req, res) => {
  res.json({ message: "Çıkış başarılı" });
});

module.exports = router;