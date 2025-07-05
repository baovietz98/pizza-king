const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  size: { type: String, enum: ['S', 'M', 'L'], required: true },
  quantity: { type: Number, required: true },
  toppings: [{ name: String, price: Number }],
  note: String,
});

const deliveryAddressSchema = new mongoose.Schema({
  street: String,
  district: String,
  city: String,
  ward: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  items: [orderItemSchema],
  totalPrice: Number,
  discountCode: String,
  discountAmount: Number,
  paymentMethod: String,
  paymentStatus: String,
  status: String,
  deliveryAddress: deliveryAddressSchema,
  estimatedDeliveryTime: Date,
  deliveryType: String,
  deliveryDistance: Number, // Khoảng cách giao hàng (km)
  deliveryFee: Number, // Phí giao hàng
  guestInfo: {
    name: String,
    phone: String,
    address: String
  },
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 