const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            code: 401, 
            message: 'Yetkilendirme reddedildi, token bulunamadı.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar');

        req.user = decoded;
        
        next(); 
    } catch (error) {
        res.status(401).json({ 
            code: 401, 
            message: 'Token geçersiz veya süresi dolmuş.' 
        });
    }
};

module.exports = authMiddleware;