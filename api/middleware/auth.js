const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token yok' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = authMiddleware;