const mongoose = require('mongoose');
 
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  ingredients: {
    type: [String],
    default: []
  },
  usageInstructions: {
    type: String
  },
  volume: {
    type: String
  },
  imageUrl: {
    type: String
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  alternatives: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, { timestamps: true });
 
module.exports = mongoose.model('Product', ProductSchema);