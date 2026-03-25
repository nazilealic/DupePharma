/* const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  price: Number,
  ingredients: [String]
});

module.exports = mongoose.model("Product", productSchema); */
// models/Product.js
// api/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  ingredients: [String],
  price: Number
});

module.exports = mongoose.model("Product", productSchema);