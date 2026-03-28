const Product = require('../models/Product');

// ────────────────────────────────────────────────────────
// #1 Nazile Alıç — Ürünleri Listele
// #9 Şadiye Berra Özelgül — Kategori Filtresi
// #10 Şadiye Berra Özelgül — Fiyat Aralığı Filtresi
// ────────────────────────────────────────────────────────
exports.listProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const data  = await Product.find(filter).skip(skip).limit(Number(limit));

    return res.json({
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #4 Nazile Alıç — Ürün Araması
// ────────────────────────────────────────────────────────
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ code: 400, message: 'query parametresi zorunludur.' });

    // Aramayı kullanıcının search history'sine kaydet
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      $push: { searchHistory: { query, searchedOn: new Date() } },
    });

    const products = await Product.find({
      $or: [
        { name:  { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    });

    if (!products.length)
      return res.status(404).json({ code: 404, message: 'Arama sonucunda ürün bulunamadı.' });

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #29 Bahar Balım — Ürün Detayı & İçerik Bilgileri
// ────────────────────────────────────────────────────────
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #26 Bahar Balım — Ürün Düzenle (Admin)
// ────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    if (req.user?.role !== 'admin')
      return res.status(403).json({ code: 403, message: 'Bu işlem için Admin yetkisi gereklidir.' });

    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true });
    if (!product)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #27 Bahar Balım — Ürün Sil (Admin)
// ────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    if (req.user?.role !== 'admin')
      return res.status(403).json({ code: 403, message: 'Bu işlem için Admin yetkisi gereklidir.' });

    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};