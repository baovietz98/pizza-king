require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/Admin');
const { getGuestCartStats, cleanupGuestCarts, cleanupInactiveGuestCarts } = require('./src/utils/cartCleanup');

// Kết nối database
mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  try {
    console.log('👤 Tạo admin user...\n');
    
    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await Admin.findOne({ email: 'admin@pizzahut.com' });
    if (existingAdmin) {
      console.log('✅ Admin đã tồn tại:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   ID: ${existingAdmin._id}\n`);
      return existingAdmin;
    }
    
    // Tạo admin mới
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      name: 'System Admin',
      email: 'admin@pizzahut.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('✅ Đã tạo admin thành công:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}\n`);
    
    return admin;
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
    throw error;
  }
}

async function testCleanupSystem() {
  try {
    console.log('🧪 Test hệ thống cleanup...\n');
    
    // Hiển thị thống kê hiện tại
    const stats = await getGuestCartStats();
    console.log('📊 Thống kê guest carts hiện tại:');
    console.log(`   - Tổng guest carts: ${stats.total}`);
    console.log(`   - Cart rỗng: ${stats.empty}`);
    console.log(`   - Cart cũ (>7 ngày): ${stats.old}\n`);
    
    if (stats.total > 0) {
      console.log('🧹 Chạy cleanup test...');
      
      // Cleanup carts cũ (7 ngày)
      const deletedOld = await cleanupGuestCarts(7, false);
      
      // Cleanup carts không hoạt động (3 ngày)
      const deletedInactive = await cleanupInactiveGuestCarts();
      
      console.log(`✅ Cleanup hoàn thành: ${deletedOld + deletedInactive} carts đã được xóa\n`);
      
      // Hiển thị thống kê sau cleanup
      const statsAfter = await getGuestCartStats();
      console.log('📊 Thống kê sau cleanup:');
      console.log(`   - Tổng guest carts: ${statsAfter.total}`);
      console.log(`   - Cart rỗng: ${statsAfter.empty}`);
      console.log(`   - Cart cũ (>7 ngày): ${statsAfter.old}`);
    } else {
      console.log('ℹ️ Không có guest carts để cleanup');
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi test cleanup:', error);
  }
}

async function runSetup() {
  try {
    await createAdmin();
    await testCleanupSystem();
    
    console.log('\n🎉 Setup hoàn thành!');
    console.log('\n📝 Hướng dẫn sử dụng:');
    console.log('1. Đăng nhập admin với email: admin@pizzahut.com, password: admin123');
    console.log('2. Test API cleanup: GET /api/cart/admin/stats');
    console.log('3. Chạy cleanup: POST /api/cart/admin/cleanup');
    console.log('4. Cron job sẽ tự động chạy hàng ngày lúc 2:00 AM');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Chạy setup
runSetup(); 