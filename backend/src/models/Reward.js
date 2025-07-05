const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pointsRequired: Number,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema); 