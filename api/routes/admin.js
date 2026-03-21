const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Ürün ekleme
router.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Güncelleme
router.put('/products/:productId', async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    { new: true }
  );
  res.json(product);
});

// Silme
router.delete('/products/:productId', async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.status(204).send();
});

module.exports = router;