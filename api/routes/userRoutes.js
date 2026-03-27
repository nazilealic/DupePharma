const express = require("express");
const router = express.Router();
const {
  searchProducts,
  getSearchHistory,
  deleteSearchHistory,
  createOrUpdateSkinProfile,
  getSkinProfile
} = require("../controllers/userController");

// Arama
router.get("/search", searchProducts);

// Arama geçmişi
router.get("/:userId/search-history", getSearchHistory);
router.delete("/:userId/search-history", deleteSearchHistory);

// Cilt profili
router.post("/:userId/skin-profile", createOrUpdateSkinProfile);
router.put("/:userId/skin-profile", createOrUpdateSkinProfile);
router.get("/:userId/skin-profile", getSkinProfile);

module.exports = router;