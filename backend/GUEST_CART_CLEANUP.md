# Hệ thống Cleanup Guest Carts

## Vấn đề

Khi guest users thêm sản phẩm vào giỏ hàng rồi rời đi mà không đăng nhập hay đặt hàng, các cart này sẽ tồn tại vĩnh viễn trong database, gây ra:

1. **Tích lũy dữ liệu rác**: Database chứa hàng nghìn cart không được sử dụng
2. **Không thể tái sử dụng**: Session ID mới sẽ không thể truy cập cart cũ
3. **Tốn tài nguyên**: Làm chậm queries và tốn storage

## Giải pháp đã triển khai

### 1. TTL Index (Time To Live) - Tự động hoàn toàn
```javascript
// Tự động xóa guest carts sau 7 ngày
cartSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 604800, // 7 ngày
    partialFilterExpression: { user: { $exists: false } } // Chỉ áp dụng cho guest carts
  }
);
```

**Đặc điểm:**
- MongoDB tự động xóa documents sau thời gian chỉ định
- Chỉ áp dụng cho guest carts (không có field `user`)
- Không ảnh hưởng đến user carts
- Hoạt động 24/7, không cần server chạy

### 2. Cron Job tự động - Bổ sung
```javascript
// Chạy hàng ngày lúc 2:00 AM
cron.schedule('0 2 * * *', async () => {
  // Cleanup carts cũ (7 ngày)
  const deletedOld = await cleanupGuestCarts(7, false);
  
  // Cleanup carts không hoạt động (3 ngày không update)
  const deletedInactive = await cleanupInactiveGuestCarts();
  
  console.log(`✅ Cleanup hoàn thành: ${deletedOld + deletedInactive} carts đã được xóa`);
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh"
});
```

**Đặc điểm:**
- Xóa thêm carts không hoạt động (3 ngày không update)
- Có thể tùy chỉnh logic phức tạp
- Log kết quả để theo dõi
- Cần server chạy liên tục

### 3. Manual Cleanup - Admin control
```bash
# Chạy cleanup thủ công
node cleanup-guest-carts.js

# Test hệ thống cleanup
node test-cleanup.js
```

### 4. Admin API - Monitoring & Control
```javascript
// Xem thống kê guest carts
GET /api/cart/admin/stats

// Chạy cleanup thủ công
POST /api/cart/admin/cleanup
{
  "daysOld": 7,
  "onlyEmpty": false
}
```

## Phân biệt Guest Carts vs User Carts

### Guest Carts (Bị xóa tự động)
```javascript
{
  sessionId: "guest_123456",
  items: [...],
  createdAt: "2025-01-01",
  // KHÔNG có field user
}
```

### User Carts (Được bảo vệ)
```javascript
{
  user: "user_id_123",  // Có field user
  items: [...],
  createdAt: "2025-01-01"
}
```

**Lý do thiết kế:**
- **Guest**: Không đăng nhập → Không thể truy cập lại → Xóa để tiết kiệm storage
- **User**: Đã đăng nhập → Có thể quay lại → Giữ cart để tiện lợi

## Cách hoạt động

### TTL Index
- MongoDB tự động xóa documents sau 7 ngày
- Chỉ áp dụng cho guest carts (không có field `user`)
- Không ảnh hưởng đến user carts
- Hoạt động liên tục, không cần can thiệp

### Cron Job
- Chạy hàng ngày lúc 2:00 AM (giờ Việt Nam)
- Xóa carts cũ hơn 7 ngày
- Xóa carts không update trong 3 ngày
- Log kết quả để theo dõi

### Manual Cleanup
- Cho phép admin chạy cleanup bất cứ lúc nào
- Có thể tùy chỉnh thời gian và điều kiện
- Hiển thị thống kê trước và sau cleanup

## So sánh với Pizza Hut thực tế

### Pizza Hut thực tế:
- **Session timeout**: 30 phút - 2 giờ
- **Cart expiration**: 24 giờ - 7 ngày
- **Cleanup jobs**: Hàng ngày
- **Storage optimization**: Nén dữ liệu cũ

### Hệ thống của chúng ta:
- **TTL Index**: 7 ngày (tương đương)
- **Cron job**: Hàng ngày
- **Manual cleanup**: Linh hoạt
- **Admin monitoring**: Thống kê real-time
- **User cart protection**: Bảo vệ hoàn toàn

## Lợi ích

1. **Tự động hóa**: Không cần can thiệp thủ công
2. **Hiệu suất**: Database nhẹ hơn, queries nhanh hơn
3. **Monitoring**: Admin có thể theo dõi và kiểm soát
4. **Linh hoạt**: Có thể điều chỉnh thời gian và điều kiện
5. **An toàn**: Chỉ xóa guest carts, không ảnh hưởng user data
6. **Bảo vệ user**: User carts được giữ nguyên vĩnh viễn

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install node-cron
```

### 2. Khởi động server
```bash
npm start
# Cron job sẽ tự động chạy
```

### 3. Kiểm tra thống kê
```bash
# API call
curl -H "Authorization: Bearer <admin_token>" http://localhost:5000/api/cart/admin/stats
```

### 4. Chạy cleanup thủ công
```bash
# Script
node cleanup-guest-carts.js

# API call
curl -X POST -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"daysOld": 7, "onlyEmpty": false}' \
  http://localhost:5000/api/cart/admin/cleanup
```

## Monitoring

### Logs
- Server logs hiển thị kết quả cron job
- Manual cleanup logs chi tiết
- Error handling và reporting

### Metrics
- Tổng số guest carts
- Số cart rỗng
- Số cart cũ (>7 ngày)
- Số cart đã xóa

### Alerts
- Có thể thêm alert khi số cart quá nhiều
- Monitor performance impact
- Track cleanup effectiveness

## Tùy chọn triển khai

### Chỉ dùng TTL Index (Đơn giản)
```javascript
// Chỉ cần TTL, không cần cron job
cartSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 604800,
    partialFilterExpression: { user: { $exists: false } }
  }
);
```

### Chỉ dùng Cron Job (Linh hoạt)
```javascript
// Chỉ cần cron job, không cần TTL
cron.schedule('0 2 * * *', async () => {
  await cleanupGuestCarts(7, false);
  await cleanupInactiveGuestCarts();
});
```

### Dùng cả hai (Hiện tại - Tối ưu)
- **TTL**: Xóa tự động theo thời gian tạo
- **Cron Job**: Xóa thêm carts không hoạt động
- **Kết quả**: Database sạch nhất, hiệu suất tốt nhất

## Kết luận

Hệ thống cleanup guest carts đã được thiết kế để:
- **Tự động hoàn toàn** với TTL Index
- **Bổ sung thông minh** với Cron Job
- **Bảo vệ user carts** hoàn toàn
- **Tương đương** với các best practices của Pizza Hut thực tế

**=> "Set and forget" - Thiết lập một lần và để hệ thống tự chạy!** 🚀 