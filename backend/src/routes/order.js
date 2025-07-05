const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middlewares/auth');

// Đặt hàng (có thể có auth hoặc không)
router.post('/', orderController.createOrder);

// Lịch sử đơn hàng (chỉ user đã đăng nhập)
router.get('/history', auth, orderController.getOrderHistory);

module.exports = router; 