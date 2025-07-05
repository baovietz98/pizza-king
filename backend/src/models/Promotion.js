const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  code: { type: String, unique: true },
  description: String,
  discountType: String,
  discountValue: Number,
  minOrderValue: Number,
  validFrom: Date,
  validUntil: Date,
  maxUses: Number,
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema); 