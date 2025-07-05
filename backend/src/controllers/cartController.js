const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Combo = require('../models/Combo');

// Helper: Lấy cart theo userId (tạo mới nếu chưa có)
async function getOrCreateCart(userId) {
  if (!userId) throw new Error('Không xác định được user');
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
}

// Helper: Lấy userId từ req.user với nhiều format khác nhau
function getUserId(req) {
  return req.user?.userId || req.user?._id || req.user?.id;
}

// Thêm sản phẩm lẻ vào giỏ
exports.addProductToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Không xác định được user' });
    const { productId, size, crust, quantity = 1, note = '' } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const sizeObj = product.sizes.find(s => s.name === size);
    if (!sizeObj) return res.status(400).json({ message: 'Size không hợp lệ' });
    if (crust && !product.availableCrusts.includes(crust)) return res.status(400).json({ message: 'Đế không hợp lệ' });
    const price = sizeObj.price;

    let cart = await getOrCreateCart(userId);
    // Kiểm tra đã có item giống chưa
    const existIdx = cart.items.findIndex(item =>
      item.type === 'product' &&
      item.product.toString() === productId &&
      item.size === size &&
      item.crust === crust &&
      item.note === note
    );
    if (existIdx >= 0) {
      cart.items[existIdx].quantity += quantity;
    } else {
      cart.items.push({
        type: 'product',
        product: product._id,
        name: product.name,
        size,
        crust,
        quantity,
        price,
        note
      });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Thêm combo vào giỏ
exports.addComboToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Không xác định được user' });
    const { comboId, selections, quantity = 1, note = '' } = req.body;
    const combo = await Combo.findById(comboId);
    if (!combo) return res.status(404).json({ message: 'Không tìm thấy combo' });
    // Validate selections (có thể gọi lại hàm validateComboSelection nếu muốn)
    // Ở đây chỉ kiểm tra đơn giản
    let totalPrice = combo.comboPrice;
    for (const step of combo.steps) {
      const stepKey = `step${step.stepNumber}`;
      const selected = selections[stepKey];
      if (!selected || selected.length === 0) {
        return res.status(400).json({ message: `Thiếu lựa chọn ở bước ${step.stepNumber}` });
      }
      // Tính giá nâng cấp nếu có
      for (const productObj of selected) {
        // productObj: { product, size, crust }
        const option = step.options.find(opt =>
          opt.product.toString() === productObj.product &&
          opt.size === productObj.size &&
          (!opt.crusts || !productObj.crust || opt.crusts.includes(productObj.crust))
        );
        if (!option) {
          return res.status(400).json({ message: `Lựa chọn không hợp lệ ở bước ${step.stepNumber}` });
        }
        totalPrice += option.upgradePrice || 0;
      }
    }
    let cart = await getOrCreateCart(userId);
    // Kiểm tra đã có item giống chưa
    const existIdx = cart.items.findIndex(item =>
      item.type === 'combo' &&
      item.comboId.toString() === comboId &&
      JSON.stringify(item.selections) === JSON.stringify(selections) &&
      item.note === note
    );
    if (existIdx >= 0) {
      cart.items[existIdx].quantity += quantity;
    } else {
      cart.items.push({
        type: 'combo',
        comboId: combo._id,
        name: combo.name,
        selections,
        quantity,
        price: totalPrice,
        note
      });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy giỏ hàng hiện tại
exports.getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Không xác định được user' });
    let cart = await Cart.findOne({ user: userId }).populate('user');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật số lượng, ghi chú
exports.updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Không xác định được user' });
    const { quantity, note } = req.body;
    const { itemId } = req.params;
    let cart = await getOrCreateCart(userId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy item' });
    if (quantity !== undefined) item.quantity = quantity;
    if (note !== undefined) item.note = note;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa item khỏi giỏ
exports.removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Không xác định được user' });
    const { itemId } = req.params;
    let cart = await getOrCreateCart(userId);
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 