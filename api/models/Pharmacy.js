const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);