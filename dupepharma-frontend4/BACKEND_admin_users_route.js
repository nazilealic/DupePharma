// Bu satırları api/routes/admin.js dosyasına ekle

const User = require('../models/User');

// GET /admin/users - Tüm kullanıcıları listele
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
});

// DELETE /admin/users/:userId - Kullanıcı sil
router.delete('/users/:userId', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ code: 404, message: 'Kullanıcı bulunamadı.' });
    if (user.role === 'admin') return res.status(403).json({ code: 403, message: 'Admin kullanıcı silinemez.' });
    await user.deleteOne();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
});
