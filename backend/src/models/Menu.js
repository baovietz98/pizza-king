const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: { type: String, enum: ['S', 'M', 'L'], required: true },
  price: { type: Number, required: true },
});

const toppingSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['pizza', 'pasta', 'drink', 'side', 'combo'], required: true },
  description: String,
  sizes: [sizeSchema],
  toppings: [toppingSchema],
  comboItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  discount: { type: Number, default: 0 }, // %
  image: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Menu', menuSchema); 