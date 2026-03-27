const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const productController = require('../controllers/productController');

// #1  Nazile — Ürünleri Listele | #9 Şadiye — Kategori Filtrele | #10 Şadiye — Fiyat Filtrele
router.get('/', protect, productController.listProducts);

// #4  Nazile — Ürün Araması
router.get('/search', protect, productController.searchProducts);

// #29 Bahar — GET /products/:productId/details
router.get('/:productId/details', protect, productController.getProductById);

// #26 Bahar — PUT /products/:productId  (products üzerinden de erişilebilir)
router.put('/:productId', protect, productController.updateProduct);

// #27 Bahar — DELETE /products/:productId
router.delete('/:productId', protect, productController.deleteProduct);

module.exports = router;
