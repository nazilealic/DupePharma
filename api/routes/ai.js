const express = require('express');
const router = express.Router();

router.post('/product-analysis', (req, res) => {
  res.json({ message: 'AI analiz sonucu' });
});

module.exports = router;