const Cart = require('../models/Cart');

/**
 * Cleanup guest carts cũ và không được sử dụng
 * @param {number} daysOld - Số ngày cũ để xóa (mặc định 7 ngày)
 * @param {boolean} onlyEmpty - Chỉ xóa cart rỗng (mặc định false)
 */
async function cleanupGuestCarts(daysOld = 7, onlyEmpty = false) {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    let query = {
      user: { $exists: false }, // Chỉ guest carts
      createdAt: { $lt: cutoffDate }
    };
    
    // Nếu chỉ xóa cart rỗng
    if (onlyEmpty) {
      query.items = { $size: 0 };
    }
    
    const result = await Cart.deleteMany(query);
    
    console.log(`✅ Đã xóa ${result.deletedCount} guest carts cũ (${daysOld} ngày trước)`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Lỗi khi cleanup guest carts:', error);
    throw error;
  }
}

/**
 * Cleanup guest carts không hoạt động (không update trong 3 ngày)
 */
async function cleanupInactiveGuestCarts() {
  try {
    const cutoffDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    const result = await Cart.deleteMany({
      user: { $exists: false },
      updatedAt: { $lt: cutoffDate }
    });
    
    console.log(`✅ Đã xóa ${result.deletedCount} guest carts không hoạt động (3 ngày không update)`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Lỗi khi cleanup inactive guest carts:', error);
    throw error;
  }
}

/**
 * Thống kê guest carts
 */
async function getGuestCartStats() {
  try {
    const totalGuestCarts = await Cart.countDocuments({ user: { $exists: false } });
    const emptyGuestCarts = await Cart.countDocuments({ 
      user: { $exists: false }, 
      items: { $size: 0 } 
    });
    const oldGuestCarts = await Cart.countDocuments({
      user: { $exists: false },
      createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    return {
      total: totalGuestCarts,
      empty: emptyGuestCarts,
      old: oldGuestCarts
    };
  } catch (error) {
    console.error('❌ Lỗi khi lấy thống kê guest carts:', error);
    throw error;
  }
}

module.exports = {
  cleanupGuestCarts,
  cleanupInactiveGuestCarts,
  getGuestCartStats
}; 