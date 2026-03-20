require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/v1/auth', require('./routes/auth'));


app.use('/v1/products', require('./routes/products'));
app.use('/v1/users', require('./routes/users'));

app.use('/v1/users', require('./routes/favorites'));
app.use('/v1/pharmacies', require('./routes/pharmacies'));

app.use('/v1/products', require('./routes/reviews'));

app.use('/v1/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: 'DupePharma API çalışıyor 🚀', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Endpoint bulunamadı.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Sunucu hatası.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));

module.exports = app;