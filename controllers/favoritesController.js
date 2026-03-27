const User = require('../models/User');
const Product = require('../models/Product');

const isSelfOrAdmin = (req) =>
  req.user.id === req.params.userId || req.user.role === 'admin';

// ────────────────────────────────────────────────────────
// #13 Şadiye Berra Özelgül — Favorileri Listele
// ────────────────────────────────────────────────────────
exports.listFavorites = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const user = await User.findById(req.params.userId).populate('favorites');
    if (!user)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    return res.json(user.favorites);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #11 Şadiye Berra Özelgül — Favorilere Ekle
// ────────────────────────────────────────────────────────
exports.addFavorite = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ code: 400, message: 'productId zorunludur.' });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });

    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });

    if (user.favorites.includes(productId))
      return res.status(409).json({ code: 409, message: 'Ürün zaten favorilerde mevcut.' });

    user.favorites.push(productId);
    await user.save();
    return res.status(201).json({ message: 'Ürün favorilere eklendi.' });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #12 Şadiye Berra Özelgül — Favorilerden Çıkar
// ────────────────────────────────────────────────────────
exports.removeFavorite = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req))
      return res.status(403).json({ code: 403, message: 'Bu işlem için yetkiniz bulunmamaktadır.' });

    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });

    const before = user.favorites.length;
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.productId
    );

    if (user.favorites.length === before)
      return res.status(404).json({ code: 404, message: 'Ürün favorilerde bulunamadı.' });

    await user.save();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};
