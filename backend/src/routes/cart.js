const express = require('express');
const router = express.Router();
const { requireAuth, guestAuth, guestSession } = require('../middlewares/auth');
const cartController = require('../controllers/cartController');

// Middleware cho tất cả cart routes
router.use(guestAuth, guestSession);

// Lấy giỏ hàng hiện tại (cả user và guest)
router.get('/', cartController.getCart);

// Thêm sản phẩm lẻ vào giỏ (cả user và guest)
router.post('/add-product', cartController.addProductToCart);

// Thêm combo vào giỏ (cả user và guest)
router.post('/add-combo', cartController.addComboToCart);

// Cập nhật số lượng, ghi chú (cả user và guest)
router.put('/update-item/:itemId', cartController.updateCartItem);

// Xóa item khỏi giỏ (cả user và guest)
router.delete('/remove-item/:itemId', cartController.removeCartItem);

// Clear cart (cả user và guest)
router.delete('/clear', cartController.clearCart);

// Merge guest cart với user cart khi đăng nhập (chỉ user đã đăng nhập)
router.post('/merge-guest-cart', requireAuth, cartController.mergeGuestCart);

module.exports = router; 