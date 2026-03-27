const jwt = require('jsonwebtoken');

// Tüm ekip bu middleware'i kullanacak — kimse değiştirmesin
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'Kimlik doğrulama başarısız. Lütfen tekrar giriş yapın.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ code: 401, message: 'Token geçersiz veya süresi dolmuş.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ code: 403, message: 'Bu işlem için Admin yetkisi gereklidir.' });
  }
  next();
};

module.exports = { protect, adminOnly };
