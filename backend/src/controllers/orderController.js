const Order = require('../models/Order');
const Store = require('../models/Store');
const User = require('../models/User');
const { checkDeliveryRange, calculateDeliveryFee, findNearestStore } = require('../utils/distance');

// Tạo đơn hàng cho cả khách vãng lai và user đã đăng nhập
exports.createOrder = async (req, res) => {
  try {
    let userId = null;
    let guestInfo = null;
    
    // Kiểm tra xem có user đã đăng nhập không
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Token không hợp lệ, xử lý như khách vãng lai
      }
    }
    
    // Nếu không có userId (không đăng nhập hoặc token không hợp lệ)
    if (!userId) {
      const { guestName, guestPhone, guestAddress } = req.body;
      if (!guestName || !guestPhone || !guestAddress) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin khách hàng' });
      }
      guestInfo = { name: guestName, phone: guestPhone, address: guestAddress };
    }

    const { 
      storeId, 
      items, 
      totalPrice, 
      paymentMethod, 
      deliveryType, 
      deliveryAddress,
      note 
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Đơn hàng phải có ít nhất 1 sản phẩm' });
    }

    // Kiểm tra phạm vi giao hàng nếu là delivery
    let deliveryFee = 0;
    let deliveryDistance = 0;
    let finalStoreId = storeId;

    if (deliveryType === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.location) {
        return res.status(400).json({ message: 'Vui lòng cung cấp địa chỉ giao hàng với tọa độ' });
      }

      // Lấy thông tin cửa hàng
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(400).json({ message: 'Không tìm thấy cửa hàng' });
      }

      // Kiểm tra phạm vi giao hàng
      const rangeCheck = checkDeliveryRange(store.location, deliveryAddress.location, 15);
      
      if (!rangeCheck.isInRange) {
        // Tìm cửa hàng gần nhất trong phạm vi
        const allStores = await Store.find({ isActive: true });
        const nearestStore = findNearestStore(allStores, deliveryAddress.location, 15);
        
        if (!nearestStore) {
          return res.status(400).json({ 
            message: `Rất tiếc, chúng tôi chưa giao hàng đến địa chỉ này. Phạm vi giao hàng giới hạn trong 15km từ cửa hàng gần nhất.` 
          });
        }
        
        finalStoreId = nearestStore._id;
        deliveryDistance = nearestStore.distance;
        deliveryFee = calculateDeliveryFee(nearestStore.distance);
      } else {
        deliveryDistance = rangeCheck.distance;
        deliveryFee = calculateDeliveryFee(rangeCheck.distance);
      }
    }

    const order = new Order({
      userId,
      storeId: finalStoreId,
      items,
      totalPrice: totalPrice + deliveryFee,
      paymentMethod,
      deliveryType,
      deliveryAddress,
      deliveryDistance,
      deliveryFee,
      guestInfo,
      note
    });

    await order.save();
    
    res.status(201).json({ 
      message: 'Đặt hàng thành công', 
      orderId: order._id,
      deliveryFee,
      deliveryDistance,
      totalPrice: order.totalPrice
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lịch sử đơn hàng cho user đã đăng nhập
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 