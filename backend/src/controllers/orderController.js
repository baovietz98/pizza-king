const Order = require('../models/Order');
const Store = require('../models/Store');
const User = require('../models/User');
const GuestOrder = require('../models/GuestOrder');
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

// Merge guest order với user order khi đăng nhập
exports.mergeGuestOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { guestOrderId } = req.body;
    
    if (!guestOrderId) {
      return res.status(400).json({ message: 'Thiếu ID đơn hàng guest' });
    }
    
    // Tìm guest order
    const guestOrder = await GuestOrder.findById(guestOrderId);
    if (!guestOrder) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng guest' });
    }
    
    // Kiểm tra xem đơn hàng đã được merge chưa
    if (guestOrder.userId) {
      return res.status(400).json({ message: 'Đơn hàng đã được merge trước đó' });
    }
    
    // Tạo order mới cho user với thông tin từ guest order
    const newOrder = new Order({
      userId,
      storeId: guestOrder.deliveryInfo.store,
      items: guestOrder.orderInfo.items,
      totalPrice: guestOrder.orderInfo.finalAmount,
      paymentMethod: guestOrder.paymentInfo.method,
      deliveryType: guestOrder.deliveryInfo.method,
      deliveryAddress: {
        street: guestOrder.customerInfo.address.street,
        city: guestOrder.customerInfo.address.city,
        district: guestOrder.customerInfo.address.district,
        ward: guestOrder.customerInfo.address.ward
      },
      deliveryDistance: 0, // Có thể tính toán lại nếu cần
      deliveryFee: guestOrder.orderInfo.deliveryFee,
      guestInfo: {
        name: guestOrder.customerInfo.name,
        phone: guestOrder.customerInfo.phone,
        address: guestOrder.customerInfo.address
      },
      note: guestOrder.deliveryInfo.note || '',
      status: guestOrder.status,
      voucher: guestOrder.orderInfo.voucher,
      plasticRequest: guestOrder.orderInfo.plasticRequest
    });
    
    await newOrder.save();
    
    // Cập nhật guest order để đánh dấu đã merge
    guestOrder.userId = userId;
    guestOrder.mergedOrderId = newOrder._id;
    guestOrder.updatedAt = new Date();
    await guestOrder.save();
    
    res.json({ 
      message: 'Merge đơn hàng thành công',
      originalOrder: guestOrder,
      newOrder: newOrder
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy tất cả đơn hàng (cả user và guest) cho admin
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type = 'all' } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type === 'user') query.userId = { $exists: true, $ne: null };
    if (type === 'guest') query.userId = { $exists: false };
    
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('storeId', 'name address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 