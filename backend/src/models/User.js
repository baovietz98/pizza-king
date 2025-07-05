const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  district: String,
  ward: String,
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },
  addresses: [addressSchema],
  rewardPoints: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.index({ 'addresses.phone': 1 });
userSchema.index({ rewardPoints: 1 });

module.exports = mongoose.model('User', userSchema); 