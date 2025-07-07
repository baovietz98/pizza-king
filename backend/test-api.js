const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test admin login
async function loginAdmin() {
  try {
    console.log('🔐 Đăng nhập admin...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@pizzahut.com',
      password: 'admin123'
    });
    
    const token = response.data.token;
    console.log('✅ Đăng nhập thành công\n');
    
    return token;
  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error.response?.data || error.message);
    throw error;
  }
}

// Test get cart stats
async function getCartStats(token) {
  try {
    console.log('📊 Lấy thống kê guest carts...');
    
    const response = await axios.get(`${BASE_URL}/cart/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const stats = response.data;
    console.log('✅ Thống kê:');
    console.log(`   - Tổng guest carts: ${stats.total}`);
    console.log(`   - Cart rỗng: ${stats.empty}`);
    console.log(`   - Cart cũ (>7 ngày): ${stats.old}\n`);
    
    return stats;
  } catch (error) {
    console.error('❌ Lỗi lấy thống kê:', error.response?.data || error.message);
    throw error;
  }
}

// Test cleanup
async function runCleanup(token) {
  try {
    console.log('🧹 Chạy cleanup...');
    
    const response = await axios.post(`${BASE_URL}/cart/admin/cleanup`, {
      daysOld: 7,
      onlyEmpty: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const result = response.data;
    console.log('✅ Cleanup hoàn thành:');
    console.log(`   - Carts cũ đã xóa: ${result.deletedOld}`);
    console.log(`   - Carts không hoạt động đã xóa: ${result.deletedInactive}`);
    console.log(`   - Tổng đã xóa: ${result.totalDeleted}\n`);
    
    return result;
  } catch (error) {
    console.error('❌ Lỗi cleanup:', error.response?.data || error.message);
    throw error;
  }
}

// Test toàn bộ hệ thống
async function testSystem() {
  try {
    console.log('🧪 Test hệ thống cleanup API...\n');
    
    // Đăng nhập
    const token = await loginAdmin();
    
    // Lấy thống kê trước
    const statsBefore = await getCartStats(token);
    
    // Chạy cleanup
    const cleanupResult = await runCleanup(token);
    
    // Lấy thống kê sau
    const statsAfter = await getCartStats(token);
    
    console.log('📈 So sánh trước và sau cleanup:');
    console.log(`   - Tổng carts: ${statsBefore.total} → ${statsAfter.total}`);
    console.log(`   - Cart rỗng: ${statsBefore.empty} → ${statsAfter.empty}`);
    console.log(`   - Cart cũ: ${statsBefore.old} → ${statsAfter.old}`);
    
    console.log('\n🎉 Test API hoàn thành thành công!');
    
  } catch (error) {
    console.error('❌ Test thất bại:', error.message);
  }
}

// Chạy test
testSystem(); 