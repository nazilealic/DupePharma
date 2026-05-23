const User = require('../models/User');

// Yardımcı: İstek sahibi = hedef kullanıcı veya admin mi?
const isSelfOrAdmin = (req) =>
  req.user.id === req.params.userId || req.user.role === 'admin';

// ────────────────────────────────────────────────────────
// #5 Nazile Alıç — Arama Geçmişini Görüntüle
// ────────────────────────────────────────────────────────
exports.getSearchHistory = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const user = await User.findById(req.params.userId).select('searchHistory');
    if (!user)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    return res.json(user.searchHistory);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #6 Nazile Alıç — Arama Geçmişini Sil
// ────────────────────────────────────────────────────────
exports.deleteSearchHistory = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    user.searchHistory = [];
    await user.save();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};