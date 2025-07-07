require('dotenv').config();
const mongoose = require('mongoose');
const Cart = require('./src/models/Cart');
const { cleanupGuestCarts, cleanupInactiveGuestCarts, getGuestCartStats } = require('./src/utils/cartCleanup');

// Kết nối database
mongoose.connect(process.env.MONGO_URI);

async function createTestGuestCarts() {
  try {
    console.log('🧪 Tạo test guest carts...\n');
    
    // Tạo cart cũ (10 ngày trước)
    const oldCart = new Cart({
      sessionId: 'test_old_session',
      items: [],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });
    await oldCart.save();
    
    // Tạo cart không hoạt động (5 ngày không update)
    const inactiveCart = new Cart({
      sessionId: 'test_inactive_session',
      items: [{ type: 'product', name: 'Test Pizza', price: 100, quantity: 1 }],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });
    await inactiveCart.save();
    
    // Tạo cart mới (1 ngày trước)
    const newCart = new Cart({
      sessionId: 'test_new_session',
      items: [{ type: 'product', name: 'Fresh Pizza', price: 150, quantity: 2 }],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });
    await newCart.save();
    
    console.log('✅ Đã tạo 3 test guest carts:');
    console.log('   - Cart cũ (10 ngày): test_old_session');
    console.log('   - Cart không hoạt động (5 ngày không update): test_inactive_session');
    console.log('   - Cart mới (1 ngày): test_new_session\n');
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo test carts:', error);
  }
}

async function testCleanup() {
  try {
    console.log('🧹 Bắt đầu test cleanup...\n');
    
    // Hiển thị thống kê trước
    const statsBefore = await getGuestCartStats();
    console.log('📊 Thống kê trước cleanup:');
    console.log(`   - Tổng guest carts: ${statsBefore.total}`);
    console.log(`   - Cart rỗng: ${statsBefore.empty}`);
    console.log(`   - Cart cũ (>7 ngày): ${statsBefore.old}\n`);
    
    // Test cleanup carts cũ (7 ngày)
    console.log('🧪 Test cleanup carts cũ (7 ngày)...');
    const deletedOld = await cleanupGuestCarts(7, false);
    console.log(`   - Đã xóa: ${deletedOld} carts\n`);
    
    // Test cleanup carts không hoạt động (3 ngày)
    console.log('🧪 Test cleanup carts không hoạt động (3 ngày)...');
    const deletedInactive = await cleanupInactiveGuestCarts();
    console.log(`   - Đã xóa: ${deletedInactive} carts\n`);
    
    // Hiển thị thống kê sau
    const statsAfter = await getGuestCartStats();
    console.log('📊 Thống kê sau cleanup:');
    console.log(`   - Tổng guest carts: ${statsAfter.total}`);
    console.log(`   - Cart rỗng: ${statsAfter.empty}`);
    console.log(`   - Cart cũ (>7 ngày): ${statsAfter.old}`);
    
    console.log(`\n✅ Test hoàn thành! Đã xóa ${deletedOld + deletedInactive} carts`);
    
  } catch (error) {
    console.error('❌ Lỗi khi test cleanup:', error);
  }
}

async function runTest() {
  try {
    await createTestGuestCarts();
    await testCleanup();
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Chạy test
runTest(); 