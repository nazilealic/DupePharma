const User = require('../models/User');

const isSelfOrAdmin = (req) =>
  req.user.id === req.params.userId || req.user.role === 'admin';

// ────────────────────────────────────────────────────────
// #7 Nazile Alıç — Cilt Profili Oluştur
// ────────────────────────────────────────────────────────
exports.createSkinProfile = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const { skinType, sensitivity, skinProblems } = req.body;
    if (!skinType)
      return res.status(400).json({ code: 400, message: 'skinType zorunludur.' });

    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    if (user.skinProfile?.skinType)
      return res.status(409).json({ code: 409, message: 'Cilt profili zaten mevcut. Güncellemek için PUT kullanın.' });

    user.skinProfile = { skinType, sensitivity, skinProblems };
    await user.save();

    return res.status(201).json({ userId: user._id, ...user.skinProfile.toObject() });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #8 Nazile Alıç — Cilt Profili Güncelle
// ────────────────────────────────────────────────────────
exports.updateSkinProfile = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const { skinType, sensitivity, skinProblems } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    user.skinProfile = { skinType, sensitivity, skinProblems };
    await user.save();
    return res.json({ userId: user._id, ...user.skinProfile.toObject() });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};