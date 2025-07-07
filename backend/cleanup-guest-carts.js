require('dotenv').config();
const mongoose = require('mongoose');
const { cleanupGuestCarts, cleanupInactiveGuestCarts, getGuestCartStats } = require('./src/utils/cartCleanup');

// Kết nối database
mongoose.connect(process.env.MONGO_URI);

async function runCleanup() {
  try {
    console.log('🧹 Bắt đầu cleanup guest carts...\n');
    
    // Hiển thị thống kê trước khi cleanup
    const statsBefore = await getGuestCartStats();
    console.log('📊 Thống kê trước cleanup:');
    console.log(`   - Tổng guest carts: ${statsBefore.total}`);
    console.log(`   - Cart rỗng: ${statsBefore.empty}`);
    console.log(`   - Cart cũ (>7 ngày): ${statsBefore.old}\n`);
    
    // Cleanup carts cũ (7 ngày)
    const deletedOld = await cleanupGuestCarts(7, false);
    
    // Cleanup carts không hoạt động (3 ngày không update)
    const deletedInactive = await cleanupInactiveGuestCarts();
    
    // Hiển thị thống kê sau khi cleanup
    const statsAfter = await getGuestCartStats();
    console.log('\n📊 Thống kê sau cleanup:');
    console.log(`   - Tổng guest carts: ${statsAfter.total}`);
    console.log(`   - Cart rỗng: ${statsAfter.empty}`);
    console.log(`   - Cart cũ (>7 ngày): ${statsAfter.old}`);
    
    console.log(`\n✅ Hoàn thành! Đã xóa ${deletedOld + deletedInactive} guest carts`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Chạy cleanup
runCleanup(); 