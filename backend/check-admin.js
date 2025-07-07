require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');

async function checkAdmin() {
  try {
    console.log('🔍 Kiểm tra admin trong database...\n');
    
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công\n');
    
    // Kiểm tra kết nối
    console.log('📡 Trạng thái kết nối MongoDB:');
    console.log(`   - Ready state: ${mongoose.connection.readyState}`);
    console.log(`   - Database: ${mongoose.connection.name}`);
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Port: ${mongoose.connection.port}\n`);
    
    // Đếm tổng số admin
    const totalAdmins = await Admin.countDocuments();
    console.log(`📊 Tổng số admin trong collection: ${totalAdmins}\n`);
    
    // Tìm admin cụ thể
    const admin = await Admin.findOne({ email: 'admin@pizzahut.com' });
    if (admin) {
      console.log('✅ Tìm thấy admin:');
      console.log(`   - ID: ${admin._id}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Name: ${admin.name}`);
      console.log(`   - Role: ${admin.role}`);
      console.log(`   - Created: ${admin.createdAt}`);
      console.log(`   - Updated: ${admin.updatedAt}`);
    } else {
      console.log('❌ Không tìm thấy admin với email: admin@pizzahut.com');
    }
    
    // Liệt kê tất cả admin
    const allAdmins = await Admin.find({});
    if (allAdmins.length > 0) {
      console.log('\n📋 Danh sách tất cả admin:');
      allAdmins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.email} (${admin.name}) - ${admin.role}`);
      });
    } else {
      console.log('\n📋 Không có admin nào trong database');
    }
    
    // Kiểm tra collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Các collections trong database:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Đã đóng kết nối MongoDB');
    }
  }
}

// Chạy kiểm tra
checkAdmin(); 