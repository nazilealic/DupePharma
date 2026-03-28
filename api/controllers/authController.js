const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ────────────────────────────────────────────────────────
// #23 Bahar Balım — Üye Ol
// ────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName)
      return res.status(400).json({ code: 400, message: 'email, password ve fullName zorunludur.' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ code: 409, message: 'E-posta adresi zaten kullanımda.' });

    const user = await User.create({ email, password, fullName });
    return res.status(201).json({
      id: user._id, email: user.email, fullName: user.fullName, createdAt: user.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #21 Menekşe Nazik — Kullanıcı Girişi
// ────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ code: 400, message: 'email ve password zorunludur.' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ code: 401, message: 'E-posta veya şifre hatalı.' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600 }
    );

    return res.json({
      token,
      expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #22 Menekşe Nazik — Kullanıcı Çıkışı
// (Stateless JWT — client token'ı siler; sunucu tarafı blacklist opsiyonel)
// ────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  // İleride Redis blacklist eklenebilir
  return res.status(204).send();
};

// ────────────────────────────────────────────────────────
// #24 Bahar Balım — Şifre Yenileme  PUT /users/:userId/password
// ────────────────────────────────────────────────────────
exports.passwordReset = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword)
      return res.status(400).json({ code: 400, message: 'newPassword zorunludur.' });

    // Sadece kendi şifresini veya admin başkasının şifresini değiştirebilir
    if (req.user.id !== req.params.userId && req.user.role !== 'admin')
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });

    user.password = newPassword;
    await user.save();
    return res.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};