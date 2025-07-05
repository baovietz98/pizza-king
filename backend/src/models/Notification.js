const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  message: String
}, { timestamps: { createdAt: true, updatedAt: false } });

notificationSchema.index({ orderId: 1 });
notificationSchema.index({ storeId: 1 });
notificationSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema); 