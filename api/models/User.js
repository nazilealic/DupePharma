const mongoose = require("mongoose");

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
module.exports = User;