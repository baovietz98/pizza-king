const express = require('express');
const router = express.Router();
const { requireAuth, guestAuth, guestSession } = require('../middlewares/auth');
const cartController = require('../controllers/cartController');
const { getGuestCartStats, cleanupGuestCarts, cleanupInactiveGuestCarts } = require('../utils/cartCleanup');

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

// Admin routes (cần auth)
router.get('/admin/stats', requireAuth, async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    
    const stats = await getGuestCartStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

router.post('/admin/cleanup', requireAuth, async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    
    const { daysOld = 7, onlyEmpty = false } = req.body;
    
    const deletedOld = await cleanupGuestCarts(daysOld, onlyEmpty);
    const deletedInactive = await cleanupInactiveGuestCarts();
    
    res.json({
      message: 'Cleanup hoàn thành',
      deletedOld,
      deletedInactive,
      totalDeleted: deletedOld + deletedInactive
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router; 