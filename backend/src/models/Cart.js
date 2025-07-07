const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['product', 'combo'], required: true },
  // Nếu là sản phẩm lẻ
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  size: String,
  crust: String,
  // Nếu là combo
  comboId: { type: mongoose.Schema.Types.ObjectId, ref: 'Combo' },
  selections: mongoose.Schema.Types.Mixed, // { step1: {product, name, size, crust}, ... }
  // Chung
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  note: String
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Chỉ set khi user đã đăng nhập
  sessionId: { type: String, required: false }, // Session ID cho guest cart
  items: [cartItemSchema],
  voucher: { type: String, default: '' },
  plasticRequest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo cart
  updatedAt: { type: Date, default: Date.now }
});

// Middleware để đảm bảo không lưu user: null
cartSchema.pre('save', function(next) {
  if (this.user === null || this.user === undefined) {
    delete this.user;
  }
  // Cập nhật updatedAt mỗi khi save
  this.updatedAt = new Date();
  next();
});

// Unique index với sparse để đảm bảo mỗi user chỉ có 1 cart và mỗi session chỉ có 1 cart
// sparse: true sẽ bỏ qua các document có giá trị null/undefined
cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

// TTL index để tự động xóa guest carts sau 7 ngày (604800 giây)
// Chỉ áp dụng cho guest carts (không có user field)
cartSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 604800, // 7 ngày
    partialFilterExpression: { user: { $exists: false } } // Chỉ áp dụng cho guest carts
  }
);

module.exports = mongoose.model('Cart', cartSchema); 