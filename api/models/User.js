/* const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  searchHistory: [String],

  skinProfile: {
    skinType: String,
    sensitivity: String,
    concerns: [String]
  }
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User; */
// models/User.js
// api/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  searchHistory: [String],
  skinProfile: {
    skinType: String,
    sensitivity: String,
    concerns: [String]
  }
});

module.exports = mongoose.model("User", userSchema);