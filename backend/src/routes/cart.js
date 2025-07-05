const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const cartController = require('../controllers/cartController');

// Lấy giỏ hàng hiện tại
router.get('/', requireAuth, cartController.getCart);

// Thêm sản phẩm lẻ vào giỏ
router.post('/add-product', requireAuth, cartController.addProductToCart);

// Thêm combo vào giỏ
router.post('/add-combo', requireAuth, cartController.addComboToCart);

// Cập nhật số lượng, ghi chú
router.put('/update-item/:itemId', requireAuth, cartController.updateCartItem);

// Xóa item khỏi giỏ
router.delete('/remove-item/:itemId', requireAuth, cartController.removeCartItem);

module.exports = router; 