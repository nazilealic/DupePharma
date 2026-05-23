const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  brand:    { type: String, required: true },
  category: { type: String, required: true },
  price:    { type: Number, required: true },
  description:       String,
  ingredients:       [String],
  usageInstructions: String,
  volume:            String,
  imageUrl:          String,
  alternatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  averageRating: { type: Number, default: 0 },
  totalRatings:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);