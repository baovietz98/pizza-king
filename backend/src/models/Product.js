const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: { type: String, enum: ['S', 'M', 'L', '330ml', '500ml', '1.5L'], required: true },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String, // Mô tả chi tiết các thành phần
  category: String, // pizza, drink, side, dessert
  sizes: [sizeSchema], // Array of sizes với giá riêng
  availableCrusts: [String], // Các loại đế có sẵn cho pizza này
  vegetarian: { type: Boolean, default: false }, // true nếu là pizza chay
  spicy: { type: Boolean, default: false }, // true nếu là pizza cay
  image: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ vegetarian: 1 });
productSchema.index({ spicy: 1 });

module.exports = mongoose.model('Product', productSchema); 