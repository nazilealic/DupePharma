const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// #25 Bahar — POST /admin/products
router.post('/products', protect, adminOnly, adminController.createProduct);

// #26 Bahar — PUT /admin/products/:productId
router.put('/products/:productId', protect, adminOnly, adminController.updateProduct);

// #27 Bahar — DELETE /admin/products/:productId
router.delete('/products/:productId', protect, adminOnly, adminController.deleteProduct);

module.exports = router;