const mongoose = require('mongoose');

const guestOrderSchema = new mongoose.Schema({
  // Thông tin khách hàng
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true }
    }
  },
  
  // Thông tin đơn hàng
  orderInfo: {
    items: [{
      type: { type: String, enum: ['product', 'combo'], required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      comboId: { type: mongoose.Schema.Types.ObjectId, ref: 'Combo' },
      name: String,
      size: String,
      crust: String,
      selections: mongoose.Schema.Types.Mixed,
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      note: String
    }],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    voucher: String,
    plasticRequest: { type: Boolean, default: false }
  },
  
  // Thông tin giao hàng
  deliveryInfo: {
    method: { type: String, enum: ['delivery', 'pickup'], required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    estimatedTime: String,
    note: String
  },
  
  // Thông tin thanh toán
  paymentInfo: {
    method: { type: String, enum: ['cash', 'card', 'momo', 'vnpay'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: String
  },
  
  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Session ID của guest cart
  sessionId: { type: String, required: true },
  
  // Thông tin merge với user order (khi guest đăng nhập)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mergedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index để tối ưu query
guestOrderSchema.index({ 'customerInfo.email': 1 });
guestOrderSchema.index({ 'customerInfo.phone': 1 });
guestOrderSchema.index({ sessionId: 1 });
guestOrderSchema.index({ status: 1 });
guestOrderSchema.index({ createdAt: -1 });
guestOrderSchema.index({ userId: 1 });
guestOrderSchema.index({ mergedOrderId: 1 });

module.exports = mongoose.model('GuestOrder', guestOrderSchema); 