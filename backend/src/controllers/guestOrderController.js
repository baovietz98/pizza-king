const GuestOrder = require('../models/GuestOrder');
const Cart = require('../models/Cart');
const Store = require('../models/Store');

// Tạo đơn hàng cho guest
exports.createGuestOrder = async (req, res) => {
  try {
    const { sessionId, customerInfo, deliveryInfo, paymentInfo } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Thiếu session ID' });
    }
    
    // Validate customer info
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ message: 'Thiếu thông tin khách hàng' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }
    
    // Validate phone format (Vietnam)
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
    }
    
    // Lấy cart từ session
    const cart = await Cart.findOne({ sessionId: sessionId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }
    
    // Tính toán tổng tiền
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.price * item.quantity;
    }
    
    // Tính phí giao hàng
    let deliveryFee = 0;
    if (deliveryInfo.method === 'delivery') {
      // Logic tính phí giao hàng dựa trên khoảng cách
      deliveryFee = 15000; // Mặc định 15k
      if (totalAmount >= 200000) {
        deliveryFee = 0; // Miễn phí giao hàng cho đơn từ 200k
      }
    }
    
    // Tính giảm giá (nếu có voucher)
    let discount = 0;
    if (cart.voucher) {
      // Logic xử lý voucher
      discount = Math.min(totalAmount * 0.1, 50000); // Giảm tối đa 10% hoặc 50k
    }
    
    const finalAmount = totalAmount + deliveryFee - discount;
    
    // Tạo đơn hàng
    const guestOrder = new GuestOrder({
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address
      },
      orderInfo: {
        items: cart.items,
        totalAmount,
        deliveryFee,
        discount,
        finalAmount,
        voucher: cart.voucher,
        plasticRequest: cart.plasticRequest
      },
      deliveryInfo,
      paymentInfo,
      sessionId
    });
    
    await guestOrder.save();
    
    // Xóa cart sau khi tạo đơn hàng thành công
    await Cart.deleteOne({ sessionId: sessionId });
    
    res.status(201).json({
      message: 'Đặt hàng thành công',
      order: guestOrder,
      orderId: guestOrder._id
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy thông tin đơn hàng theo ID
exports.getGuestOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, phone } = req.query;
    
    if (!email || !phone) {
      return res.status(400).json({ message: 'Cần cung cấp email và số điện thoại' });
    }
    
    const order = await GuestOrder.findOne({
      _id: orderId,
      'customerInfo.email': email,
      'customerInfo.phone': phone
    }).populate('deliveryInfo.store');
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    res.json({ order });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy danh sách đơn hàng theo email/phone
exports.getGuestOrders = async (req, res) => {
  try {
    const { email, phone } = req.query;
    
    if (!email && !phone) {
      return res.status(400).json({ message: 'Cần cung cấp email hoặc số điện thoại' });
    }
    
    const query = {};
    if (email) query['customerInfo.email'] = email;
    if (phone) query['customerInfo.phone'] = phone;
    
    const orders = await GuestOrder.find(query)
      .populate('deliveryInfo.store')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ orders });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Hủy đơn hàng (chỉ cho phép hủy đơn pending)
exports.cancelGuestOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, phone } = req.body;
    
    if (!email || !phone) {
      return res.status(400).json({ message: 'Cần cung cấp email và số điện thoại' });
    }
    
    const order = await GuestOrder.findOne({
      _id: orderId,
      'customerInfo.email': email,
      'customerInfo.phone': phone,
      status: 'pending'
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc không thể hủy' });
    }
    
    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();
    
    res.json({ message: 'Hủy đơn hàng thành công', order });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Validate thông tin khách hàng
exports.validateCustomerInfo = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const errors = [];
    
    // Validate name
    if (!name || name.trim().length < 2) {
      errors.push('Tên phải có ít nhất 2 ký tự');
    }
    
    // Validate email
    if (!email) {
      errors.push('Email là bắt buộc');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Email không hợp lệ');
      }
    }
    
    // Validate phone
    if (!phone) {
      errors.push('Số điện thoại là bắt buộc');
    } else {
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        errors.push('Số điện thoại không hợp lệ');
      }
    }
    
    // Validate address
    if (!address) {
      errors.push('Địa chỉ là bắt buộc');
    } else {
      if (!address.street || !address.city || !address.district || !address.ward) {
        errors.push('Địa chỉ không đầy đủ');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Thông tin không hợp lệ', 
        errors 
      });
    }
    
    res.json({ message: 'Thông tin hợp lệ' });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 