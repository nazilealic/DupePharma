require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');

// MongoDB bağlantı fonksiyonu
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas bağlantısı başarılı");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;