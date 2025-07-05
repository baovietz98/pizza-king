const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Combo = require('../models/Combo');

// Helper: Lấy cart theo userId hoặc sessionId
async function getOrCreateCart(userId, sessionId) {
  let cart;
  
  if (userId) {
    // User đã đăng nhập
    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
  } else if (sessionId) {
    // Guest user
    cart = await Cart.findOne({ sessionId: sessionId });
    if (!cart) {
      // Tạo cart mới cho guest, không set field user
      const cartData = { sessionId: sessionId, items: [] };
      cart = new Cart(cartData);
      await cart.save();
    }
  } else {
    throw new Error('Không xác định được user hoặc session');
  }
  
  return cart;
}

// Helper: Lấy userId từ req.user với nhiều format khác nhau
function getUserId(req) {
  return req.user?.userId || req.user?._id || req.user?.id;
}

// Helper: Merge guest cart vào user cart
async function mergeGuestCart(userId, sessionId) {
  if (!userId || !sessionId) return;
  
  const userCart = await Cart.findOne({ user: userId });
  const guestCart = await Cart.findOne({ sessionId: sessionId });
  
  if (!guestCart || guestCart.items.length === 0) return;
  
  if (!userCart) {
    // Tạo cart mới cho user và copy items từ guest cart
    const newUserCart = new Cart({
      user: userId,
      items: guestCart.items,
      voucher: guestCart.voucher,
      plasticRequest: guestCart.plasticRequest
    });
    await newUserCart.save();
  } else {
    // Merge items từ guest cart vào user cart
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(item => {
        if (item.type !== guestItem.type) return false;
        
        if (item.type === 'product') {
          return item.product.toString() === guestItem.product.toString() &&
                 item.size === guestItem.size &&
                 item.crust === guestItem.crust &&
                 item.note === guestItem.note;
        } else if (item.type === 'combo') {
          return item.comboId.toString() === guestItem.comboId.toString() &&
                 JSON.stringify(item.selections) === JSON.stringify(guestItem.selections) &&
                 item.note === guestItem.note;
        }
        return false;
      });
      
      if (existingItemIndex >= 0) {
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }
    
    // Copy voucher và plastic request nếu user cart chưa có
    if (!userCart.voucher && guestCart.voucher) {
      userCart.voucher = guestCart.voucher;
    }
    if (!userCart.plasticRequest && guestCart.plasticRequest) {
      userCart.plasticRequest = guestCart.plasticRequest;
    }
    
    await userCart.save();
  }
  
  // Xóa guest cart sau khi merge
  await Cart.deleteOne({ sessionId: sessionId });
}

// Thêm sản phẩm lẻ vào giỏ
exports.addProductToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionId = req.guestSessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được user hoặc session' });
    }
    
    const { productId, size, crust, quantity = 1, note = '' } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    
    const sizeObj = product.sizes.find(s => s.name === size);
    if (!sizeObj) return res.status(400).json({ message: 'Size không hợp lệ' });
    if (crust && !product.availableCrusts.includes(crust)) return res.status(400).json({ message: 'Đế không hợp lệ' });
    
    const price = sizeObj.price;
    let cart = await getOrCreateCart(userId, sessionId);
    
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
    
    // Trả về sessionId nếu là guest để frontend lưu
    const response = { cart };
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Thêm combo vào giỏ
exports.addComboToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionId = req.guestSessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được user hoặc session' });
    }
    
    const { comboId, selections, quantity = 1, note = '' } = req.body;
    const combo = await Combo.findById(comboId);
    if (!combo) return res.status(404).json({ message: 'Không tìm thấy combo' });
    
    // Validate selections
    let totalPrice = combo.comboPrice;
    for (const step of combo.steps) {
      const stepKey = `step${step.stepNumber}`;
      const selected = selections[stepKey];
      if (!selected || selected.length === 0) {
        return res.status(400).json({ message: `Thiếu lựa chọn ở bước ${step.stepNumber}` });
      }
      
      // Tính giá nâng cấp nếu có
      for (const productObj of selected) {
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
    
    let cart = await getOrCreateCart(userId, sessionId);
    
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
    
    // Trả về sessionId nếu là guest để frontend lưu
    const response = { cart };
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy giỏ hàng hiện tại
exports.getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionId = req.guestSessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được user hoặc session' });
    }
    
    let cart = await getOrCreateCart(userId, sessionId);
    
    // Populate user và product information
    if (userId) {
      cart = await Cart.findOne({ user: userId })
        .populate('user')
        .populate('items.product', 'name image description');
    } else {
      // For guest carts, populate product information
      cart = await Cart.findOne({ sessionId: sessionId })
        .populate('items.product', 'name image description');
    }
    
    // Trả về sessionId nếu là guest để frontend lưu
    const response = { cart };
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật số lượng, ghi chú
exports.updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionId = req.guestSessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được user hoặc session' });
    }
    
    const { quantity, note } = req.body;
    const { itemId } = req.params;
    
    let cart = await getOrCreateCart(userId, sessionId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy item' });
    
    if (quantity !== undefined) item.quantity = quantity;
    if (note !== undefined) item.note = note;
    
    await cart.save();
    
    // Trả về sessionId nếu là guest để frontend lưu
    const response = { cart };
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa item khỏi giỏ
exports.removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionId = req.guestSessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được user hoặc session' });
    }
    
    const { itemId } = req.params;
    let cart = await getOrCreateCart(userId, sessionId);
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    // Trả về sessionId nếu là guest để frontend lưu
    const response = { cart };
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Merge guest cart với user cart khi đăng nhập
exports.mergeGuestCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { sessionId } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Yêu cầu đăng nhập' });
    }
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Thiếu session ID' });
    }
    
    await mergeGuestCart(userId, sessionId);
    
    // Trả về cart mới sau khi merge
    const cart = await Cart.findOne({ user: userId }).populate('user');
    res.json({ cart, message: 'Đã merge giỏ hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionId = req.guestSessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'Không xác định được user hoặc session' });
    }
    
    let cart = await getOrCreateCart(userId, sessionId);
    cart.items = [];
    cart.voucher = '';
    cart.plasticRequest = false;
    await cart.save();
    
    // Trả về sessionId nếu là guest để frontend lưu
    const response = { cart };
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 