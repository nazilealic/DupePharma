const Product = require("../models/Product");

// POST /products
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: `Ürün silindi: ${deleted.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /products/:id/alternatives
const getAlternatives = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const alternatives = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      ingredients: { $in: product.ingredients }
    });

    res.json(alternatives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /products/:id/price-comparison
const priceComparison = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const alternatives = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      ingredients: { $in: product.ingredients }
    });

    const comparison = [
      { name: product.name, brand: product.brand, price: product.price, isOriginal: true },
      ...alternatives.map(a => ({ name: a.name, brand: a.brand, price: a.price, isOriginal: false }))
    ];

    comparison.sort((a, b) => a.price - b.price);
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  getAlternatives,
  priceComparison
};