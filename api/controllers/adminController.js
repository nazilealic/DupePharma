const Product = require('../models/Product');

// ────────────────────────────────────────────────────────
// #25 Bahar Balım — POST /admin/products
// ────────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, price } = req.body;
    if (!name || !brand || !category || !price)
      return res.status(400).json({ code: 400, message: 'name, brand, category ve price zorunludur.' });

    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #26 Bahar Balım — PUT /admin/products/:productId
// ────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId, req.body, { new: true, runValidators: true }
    );
    if (!product)
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #27 Bahar Balım — DELETE /admin/products/:productId
// ────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product)
      return res.status(404).json({ code: 404, message: 'Ürün bulunamadı.' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};
