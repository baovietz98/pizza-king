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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, unique: true }, // null nếu chưa đăng nhập
  items: [cartItemSchema],
  voucher: { type: String, default: '' },
  plasticRequest: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema); 