const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  fullName: { type: String, required: true, minlength: 3 },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  searchHistory: [{ query: String, searchedOn: { type: Date, default: Date.now } }],
  skinProfile: {
    skinType:     { type: String, enum: ['yağlı', 'kuru', 'karma', 'normal', 'hassas'] },
    sensitivity:  Boolean,
    skinProblems: [String],
  },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);