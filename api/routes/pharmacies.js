const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const pharmacyController = require('../controllers/pharmacyController');

// Multer — yüklenen dosyaları uploads/ klasörüne kaydet
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `nobetci-eczane-${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// #15 Şadiye — GET /pharmacies/on-duty
router.get('/on-duty', pharmacyController.getOnDutyImage);

// #14 Şadiye — PUT /pharmacies/on-duty (admin only)
router.put('/on-duty', protect, adminOnly, upload.single('pharmacyListImage'), pharmacyController.updateOnDutyImage);

module.exports = router;