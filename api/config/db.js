require('dotenv').config(); // artık api/ içindeki .env okunacak
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI bulunamadı. .env dosyasını ve path'i kontrol et!");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Atlas bağlantısı başarılı");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err);
  }
};

module.exports = connectDB;