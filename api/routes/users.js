router.put('/:userId/password', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Yetkisiz işlem' });
    }

    const user = await User.findById(userId);
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Şifre güncellendi' });

  } catch (error) {
    res.status(500).json({ message: 'Hata' });
  }
});