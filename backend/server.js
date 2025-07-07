const app = require('./src/app');
const connectDB = require('./src/config/db');
const cron = require('node-cron');
const { cleanupGuestCarts, cleanupInactiveGuestCarts } = require('./src/utils/cartCleanup');

const PORT = process.env.PORT || 5000;

connectDB();

// Cron job để cleanup guest carts hàng ngày lúc 2:00 AM
cron.schedule('0 2 * * *', async () => {
  try {
    console.log('🕐 Bắt đầu cleanup guest carts tự động...');
    
    // Cleanup carts cũ (7 ngày)
    const deletedOld = await cleanupGuestCarts(7, false);
    
    // Cleanup carts không hoạt động (3 ngày không update)
    const deletedInactive = await cleanupInactiveGuestCarts();
    
    console.log(`✅ Cleanup hoàn thành: ${deletedOld + deletedInactive} carts đã được xóa`);
  } catch (error) {
    console.error('❌ Lỗi khi cleanup tự động:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh"
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🧹 Cron job cleanup guest carts đã được thiết lập (2:00 AM hàng ngày)');
});
