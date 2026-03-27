const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const authMiddleware = require('../middleware/auth');

// GET /api/pharmacies — Tüm eczaneleri listele (şehir/ilçe filtresi)
router.get('/', async (req, res) => {
  try {
    const { city, district } = req.query;
    const filter = {};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (district) filter.district = { $regex: district, $options: 'i' };

    const pharmacies = await Pharmacy.find(filter);
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// GET /api/pharmacies/:pharmacyId — Eczane detayı
router.get('/:pharmacyId', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacyId);
    if (!pharmacy) return res.status(404).json({ message: 'Eczane bulunamadı' });
    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// POST /api/pharmacies — Eczane ekle (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz' });
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json({ message: 'Eczane eklendi', pharmacy });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
