const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  district: String,
  city: String,
  ward: String
});

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: addressSchema,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  phone: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index cho tìm kiếm theo vị trí
storeSchema.index({ location: '2dsphere' });
storeSchema.index({ name: 1 });
storeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Store', storeSchema); 