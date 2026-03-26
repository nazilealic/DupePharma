const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

// --- ÜYE OLMA (Bahar Balım - Gereksinim #23) ---
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // E-posta kontrolü
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ code: 409, message: 'Bu e-posta adresi zaten kullanımda.' });
        }

        // Yeni kullanıcı oluşturma
        user = new User({ fullName, email, password });
        await user.save();

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu.',
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
    }
});

// --- GİRİŞ YAPMA (Menekşe Nazik - Gereksinim #21) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) { 
            return res.status(401).json({ code: 401, message: 'Hatalı e-posta veya şifre.' });
        }

        // JWT Token Üretme
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
    }
});

module.exports = router;