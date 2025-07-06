const User = require('../models/User');
const Staff = require('../models/Staff');
const Admin = require('../models/Admin');
const Cart = require('../models/Cart');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// Đăng ký chỉ cho user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng nhập cho user, staff, admin
exports.login = async (req, res) => {
  try {
    const { email, password, sessionId } = req.body; // Thêm sessionId từ request body
    
    // Ưu tiên tìm admin, rồi staff, rồi user
    let account = await Admin.findOne({ email });
    let role = 'admin';
    if (!account) {
      account = await Staff.findOne({ email });
      role = 'staff';
    }
    if (!account) {
      account = await User.findOne({ email });
      role = 'user';
    }
    if (!account) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    
    const token = jwt.sign({ userId: account._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Chỉ merge cart cho user (không phải admin/staff)
    let cartMerged = false;
    if (role === 'user' && sessionId) {
      try {
        await mergeGuestCart(account._id, sessionId);
        cartMerged = true;
      } catch (mergeError) {
        console.error('Lỗi merge cart:', mergeError);
        // Không fail login nếu merge cart lỗi
      }
    }
    
    const response = { 
      token, 
      user: { id: account._id, name: account.name, email: account.email, role },
      cartMerged // Thông báo cho frontend biết đã merge cart
    };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Không xác định được user' });
    }

    // Tìm user trong các collection
    let user = await User.findById(userId);
    let role = 'user';
    
    if (!user) {
      user = await Staff.findById(userId);
      role = 'staff';
    }
    
    if (!user) {
      user = await Admin.findById(userId);
      role = 'admin';
    }

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: role
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng ký admin (tạm thời để test)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Email đã tồn tại' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Đăng ký admin thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 