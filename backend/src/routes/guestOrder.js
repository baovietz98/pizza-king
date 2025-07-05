const express = require('express');
const router = express.Router();
const guestOrderController = require('../controllers/guestOrderController');

// Tạo đơn hàng cho guest
router.post('/create', guestOrderController.createGuestOrder);

// Lấy thông tin đơn hàng theo ID
router.get('/:orderId', guestOrderController.getGuestOrder);

// Lấy danh sách đơn hàng theo email/phone
router.get('/', guestOrderController.getGuestOrders);

// Hủy đơn hàng
router.put('/:orderId/cancel', guestOrderController.cancelGuestOrder);

// Validate thông tin khách hàng
router.post('/validate-customer-info', guestOrderController.validateCustomerInfo);

module.exports = router; 