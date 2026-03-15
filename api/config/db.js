require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas bağlantısı başarılı"))
  .catch(err => console.error("MongoDB bağlantı hatası:", err));