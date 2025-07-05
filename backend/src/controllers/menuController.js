const Menu = require('../models/Menu');
const Product = require('../models/Product');
const Combo = require('../models/Combo');

exports.getAll = async (req, res) => {
  try {
    // Lấy cả menu (pizza, pasta, drink, side, combo)
    const products = await Product.find({ isActive: true });
    const combos = await Combo.find({ isActive: true }).populate('products.product');
    res.json({ products, combos });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      product = await Combo.findById(id).populate('products.product');
      if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 