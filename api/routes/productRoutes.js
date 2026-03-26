const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  deleteProduct,
  getAlternatives,
  priceComparison
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.get("/:id/alternatives", getAlternatives);
router.get("/:id/price-comparison", priceComparison);

module.exports = router;