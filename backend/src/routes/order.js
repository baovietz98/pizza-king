const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, role } = require('../middlewares/auth');

// Đặt hàng (có thể có auth hoặc không)
router.post('/', orderController.createOrder);

// Lịch sử đơn hàng (chỉ user đã đăng nhập)
router.get('/history', auth, orderController.getOrderHistory);

// Merge guest order với user order khi đăng nhập
router.post('/merge-guest-order', auth, orderController.mergeGuestOrder);

// Admin routes
router.get('/admin/all', auth, role(['admin', 'staff']), orderController.getAllOrders);

module.exports = router; 