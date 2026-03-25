//yorum ekleme
const mongoose = require("mongoose"); // <- bunu en üstte yaz

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

module.exports = mongoose.model("Product", productSchema);
//

/*
const mongoose = require("mongoose");

const productSchema1 = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 }  // ← EKLENDİ
});
// models/Product.js içinde schema'ya ekle:


module.exports = mongoose.model("Product", productSchema1);






/*
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  averageRating: { type: Number, default: 0 }, // Puanlama için bu şart
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

// Eğer model zaten tanımlıysa onu kullan, değilse yeni oluştur
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);*/