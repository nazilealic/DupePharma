const User = require("../models/User");
const Product = require("../models/Product");

// Arama ve geçmiş kaydetme
const searchProducts = async (req, res) => {
  try {
    const { query, userId } = req.query;
    if (!query) return res.status(400).json({ message: "Arama kelimesi boş olamaz" });

    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } }
      ]
    });

    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.searchHistory.push(query);
          await user.save();
        }
      } catch (err) {
        console.warn("User history kaydedilemedi:", err.message);
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Arama geçmişi
const getSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    res.json(user.searchHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.searchHistory = [];
    await user.save();
    res.json({ message: "Arama geçmişi silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cilt profili CRUD
const createOrUpdateSkinProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skinType, sensitivity, concerns } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.skinProfile = { skinType, sensitivity, concerns };
    await user.save();

    res.json({ message: "Cilt profili kaydedildi/güncellendi", skinProfile: user.skinProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSkinProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    if (!user.skinProfile) return res.status(404).json({ message: "Cilt profili bulunamadı" });
    res.json(user.skinProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  searchProducts,
  getSearchHistory,
  deleteSearchHistory,
  createOrUpdateSkinProfile,
  getSkinProfile
};