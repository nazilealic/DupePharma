const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/auth');
const pharmacyController = require('../controllers/pharmacyController');

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — dosyaları doğrudan Cloudinary'e yükle
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'dupepharma/pharmacies',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: () => `nobetci-eczane-${Date.now()}`,
  },
});
const upload = multer({ storage });

// #15 Şadiye — GET /pharmacies/on-duty
router.get('/on-duty', pharmacyController.getOnDutyImage);

// #14 Şadiye — PUT /pharmacies/on-duty (admin only)
router.put('/on-duty', protect, adminOnly, upload.single('pharmacyListImage'), pharmacyController.updateOnDutyImage);

module.exports = router;