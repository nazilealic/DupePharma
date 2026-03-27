const path = require('path');
const fs   = require('fs');

// Basit dosya tabanlı kayıt — DB'ye gerek yok
const META_FILE = path.join(__dirname, '../uploads/pharmacy-meta.json');

const readMeta = () => {
  if (!fs.existsSync(META_FILE)) return null;
  return JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
};

const writeMeta = (data) => {
  fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2));
};

// ────────────────────────────────────────────────────────
// #15 Şadiye Berra Özelgül — Nöbetçi Eczane Listesini Görüntüle
// ────────────────────────────────────────────────────────
exports.getOnDutyImage = (req, res) => {
  const meta = readMeta();
  if (!meta)
    return res.status(404).json({ code: 404, message: 'Nöbetçi eczane listesi henüz yüklenmemiş.' });

  return res.json({
    imageUrl:  `${req.protocol}://${req.get('host')}/uploads/${meta.filename}`,
    updatedAt: meta.updatedAt,
  });
};

// ────────────────────────────────────────────────────────
// #14 Şadiye Berra Özelgül — Nöbetçi Eczane Listesini Düzenle (Admin)
// ────────────────────────────────────────────────────────
exports.updateOnDutyImage = (req, res) => {
  if (!req.file)
    return res.status(400).json({ code: 400, message: 'Görsel dosyası zorunludur.' });

  const meta = { filename: req.file.filename, updatedAt: new Date().toISOString() };
  writeMeta(meta);

  return res.json({
    message:  'Görsel başarıyla yüklendi.',
    imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
  });
};
