const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: Number,
  comment: String
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Review', reviewSchema); 