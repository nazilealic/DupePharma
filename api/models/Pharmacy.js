const mongoose = require('mongoose');
 
const PharmacySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });
 
module.exports = mongoose.model('Pharmacy', PharmacySchema);