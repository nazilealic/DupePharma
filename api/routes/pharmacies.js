

const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const tarih = Date.now();
    const uzanti = path.extname(file.originalname);
    cb(null, `nobetci-eczane-${tarih}${uzanti}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const izinliTipler = /jpeg|jpg|png|pdf/;
    const gecerli = izinliTipler.test(path.extname(file.originalname).toLowerCase());
    if (gecerli) {
      cb(null, true);
    } else {
      cb(new Error('Sadece jpeg, jpg, png veya pdf dosyası yüklenebilir.'));
    }
  }
});


router.get('/on-duty/image', async (req, res) => {
  try {
    
    const pharmacy = await Pharmacy.findOne().sort({ createdAt: -1 });

    if (!pharmacy) {
      return res.status(404).json({
        code: 404,
        message: 'Henüz nöbetçi eczane listesi yüklenmemiş.'
      });
    }

    res.status(200).json({
      imageUrl: pharmacy.imageUrl,
      updatedAt: pharmacy.updatedAt
    });

  } catch (error) {
    console.error('Nöbetçi eczane görüntüle hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});


router.put('/on-duty/image', authMiddleware, upload.single('pharmacyListImage'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: 'Bu işlem için Admin yetkisi gereklidir.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: 'Görsel dosyası zorunludur.'
      });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const pharmacy = await Pharmacy.create({
      imageUrl,
      updatedBy: req.user.id
    });

    res.status(200).json({
      message: 'Görsel başarıyla yüklendi.',
      imageUrl: pharmacy.imageUrl
    });

  } catch (error) {
    console.error('Nöbetçi eczane düzenle hatası:', error);
    res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
  }
});

module.exports = router;
