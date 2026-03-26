require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/pharmacies', require('./routes/pharmacies'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas bağlantısı başarılı");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Sunucu ${process.env.PORT || 3000} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.log("MongoDB bağlantı hatası:", err.message);
  });
