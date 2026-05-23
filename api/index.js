const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  "https://dupe-pharma-vkej.vercel.app",
  "http://localhost:3001",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// 1. Manuel CORS header middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 2. Tüm route'lara cors uygula
app.use(cors(corsOptions));

// 3. JSON parser
app.use(express.json());

// 4. Static dosyalar
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Redis bağlantısı
let redisClient;
async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://redis_kapsayici:6379'
    });
    redisClient.on('error', (err) => console.log('Redis Hatası:', err));
    await redisClient.connect();
    console.log('Redis bağlantısı başarılı');
  } catch (err) {
    console.error('Redis bağlantı hatası:', err);
  }
}
connectRedis();

// 6. RabbitMQ bağlantısı
let rabbitChannel;
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq_kapsayici');
    rabbitChannel = await connection.createChannel();
    await rabbitChannel.assertQueue('dupepharma_queue', { durable: true });
    console.log('RabbitMQ bağlantısı başarılı');
  } catch (err) {
    console.error('RabbitMQ bağlantı hatası:', err);
  }
}
connectRabbitMQ();

// Redis ve RabbitMQ'yu route'larda kullanmak için app'e ekle
app.use((req, res, next) => {
  req.redisClient = redisClient;
  req.rabbitChannel = rabbitChannel;
  next();
});

// 7. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 8. Route'lar
const authRoutes          = require('./routes/auth');
const productRoutes       = require('./routes/products');
const alternativeRoutes   = require('./routes/alternatives');
const searchHistoryRoutes = require('./routes/searchHistory');
const skinProfileRoutes   = require('./routes/skinProfile');
const favoritesRoutes     = require('./routes/favorites');
const pharmacyRoutes      = require('./routes/pharmacies');
const reviewRoutes        = require('./routes/reviews');
const adminRoutes         = require('./routes/admin');
const aiRoutes            = require('./routes/ai');

app.use('/auth',       authRoutes);
app.use('/products',   productRoutes);
app.use('/products',   alternativeRoutes);
app.use('/products',   reviewRoutes);
app.use('/users',      searchHistoryRoutes);
app.use('/users',      skinProfileRoutes);
app.use('/users',      favoritesRoutes);
app.use('/pharmacies', pharmacyRoutes);
app.use('/admin',      adminRoutes);
app.use('/ai',         aiRoutes);

// 9. MongoDB bağlantısı ve sunucu başlatma
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  })
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

module.exports = app;
