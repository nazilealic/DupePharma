const mongoose = require('mongoose');

const pharmacyMetaSchema = new mongoose.Schema({
  imageUrl:  String,
  updatedAt: { type: Date, default: Date.now },
});

const PharmacyMeta = mongoose.models.PharmacyMeta || mongoose.model('PharmacyMeta', pharmacyMetaSchema);

exports.getOnDutyImage = async (req, res) => {
  const meta = await PharmacyMeta.findOne().sort({ updatedAt: -1 });
  if (!meta)
    return res.status(404).json({ code: 404, message: 'Nöbetçi eczane listesi henüz yüklenmemiş.' });

  return res.json({
    imageUrl:  meta.imageUrl,
    updatedAt: meta.updatedAt,
  });
};

exports.updateOnDutyImage = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ code: 400, message: 'Görsel dosyası zorunludur.' });

  const imageUrl = req.file.path;

  await PharmacyMeta.deleteMany({});
  await PharmacyMeta.create({ imageUrl, updatedAt: new Date() });

  return res.json({
    message: 'Görsel başarıyla yüklendi.',
    imageUrl,
  });
};