# Guest Cart API Documentation

## Tổng quan

Hệ thống cart mới hỗ trợ cả user đã đăng nhập và guest users (khách vãng lai). Guest users có thể thêm sản phẩm vào giỏ hàng mà không cần đăng nhập, và khi checkout sẽ được yêu cầu nhập thông tin cá nhân.

## Các tính năng chính

1. **Guest Cart**: Khách vãng lai có thể thêm sản phẩm vào giỏ hàng
2. **Session-based Cart**: Sử dụng session ID để theo dõi giỏ hàng của guest
3. **Guest Order**: Tạo đơn hàng cho khách vãng lai với thông tin cá nhân
4. **Cart Merge**: Khi guest đăng nhập, giỏ hàng sẽ được merge với user cart
5. **Order Merge**: Guest order có thể được merge với user order

## API Endpoints

### Cart API

#### 1. Lấy giỏ hàng
```http
GET /api/cart
```

**Headers:**
- `Authorization: Bearer <token>` (cho user đã đăng nhập)
- `X-Session-ID: <sessionId>` (cho guest)

**Response:**
```json
{
  "cart": {
    "_id": "cart_id",
    "user": "user_id", // null cho guest
    "sessionId": "session_id", // chỉ có cho guest
    "items": [...],
    "voucher": "",
    "plasticRequest": false
  },
  "sessionId": "session_id" // chỉ trả về cho guest
}
```

#### 2. Thêm sản phẩm vào giỏ
```http
POST /api/cart/add-product
```

**Body:**
```json
{
  "productId": "product_id",
  "size": "Medium",
  "crust": "Thin",
  "quantity": 2,
  "note": "Extra cheese"
}
```

#### 3. Thêm combo vào giỏ
```http
POST /api/cart/add-combo
```

**Body:**
```json
{
  "comboId": "combo_id",
  "selections": {
    "step1": [
      {
        "product": "product_id",
        "size": "Medium",
        "crust": "Thin"
      }
    ]
  },
  "quantity": 1,
  "note": "Extra sauce"
}
```

#### 4. Cập nhật item trong giỏ
```http
PUT /api/cart/update-item/:itemId
```

**Body:**
```json
{
  "quantity": 3,
  "note": "Updated note"
}
```

#### 5. Xóa item khỏi giỏ
```http
DELETE /api/cart/remove-item/:itemId
```

#### 6. Xóa toàn bộ giỏ hàng
```http
DELETE /api/cart/clear
```

#### 7. Merge guest cart với user cart
```http
POST /api/cart/merge-guest-cart
```

**Headers:**
- `Authorization: Bearer <token>` (bắt buộc)

**Body:**
```json
{
  "sessionId": "guest_session_id"
}
```

### Guest Order API

#### 1. Tạo đơn hàng cho guest
```http
POST /api/guest-orders/create
```

**Body:**
```json
{
  "sessionId": "session_id",
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "address": {
      "street": "123 Đường ABC",
      "city": "Hà Nội",
      "district": "Ba Đình",
      "ward": "Phúc Xá"
    }
  },
  "deliveryInfo": {
    "method": "delivery",
    "store": "store_id",
    "estimatedTime": "30-45 phút",
    "note": "Giao hàng giờ hành chính"
  },
  "paymentInfo": {
    "method": "cash",
    "status": "pending"
  }
}
```

#### 2. Lấy thông tin đơn hàng
```http
GET /api/guest-orders/:orderId?email=email&phone=phone
```

#### 3. Lấy danh sách đơn hàng
```http
GET /api/guest-orders?email=email&phone=phone
```

#### 4. Hủy đơn hàng
```http
PUT /api/guest-orders/:orderId/cancel
```

**Body:**
```json
{
  "email": "nguyenvana@example.com",
  "phone": "0123456789"
}
```

#### 5. Validate thông tin khách hàng
```http
POST /api/guest-orders/validate-customer-info
```

**Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "address": {
    "street": "123 Đường ABC",
    "city": "Hà Nội",
    "district": "Ba Đình",
    "ward": "Phúc Xá"
  }
}
```

### Order API (Mở rộng)

#### 1. Merge guest order với user order
```http
POST /api/orders/merge-guest-order
```

**Headers:**
- `Authorization: Bearer <token>` (bắt buộc)

**Body:**
```json
{
  "guestOrderId": "guest_order_id"
}
```

## Luồng hoạt động

### 1. Guest User Flow
1. Guest truy cập website
2. Thêm sản phẩm vào giỏ hàng (tự động tạo session ID)
3. Xem giỏ hàng và chỉnh sửa
4. Checkout và nhập thông tin cá nhân
5. Tạo đơn hàng guest
6. Nhận email/SMS xác nhận

### 2. User Login Flow
1. User đăng nhập
2. Hệ thống kiểm tra có guest cart không
3. Nếu có, merge guest cart với user cart
4. User tiếp tục mua hàng với cart đã merge

### 3. Guest to User Conversion
1. Guest có đơn hàng chưa hoàn thành
2. Guest đăng ký tài khoản
3. Merge guest order với user account
4. User có thể theo dõi đơn hàng trong lịch sử

## Validation Rules

### Email
- Format: `user@domain.com`
- Bắt buộc cho guest order

### Phone (Vietnam)
- Format: `0123456789`, `+84123456789`, `84123456789`
- Bắt buộc cho guest order
- Validate số điện thoại Việt Nam

### Address
- Street: Bắt buộc
- City: Bắt buộc
- District: Bắt buộc
- Ward: Bắt buộc

## Error Handling

### Common Error Codes
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy resource
- `500`: Internal Server Error - Lỗi server

### Error Response Format
```json
{
  "message": "Mô tả lỗi",
  "errors": ["Chi tiết lỗi 1", "Chi tiết lỗi 2"]
}
```

## Testing

Chạy file test để kiểm tra API:
```bash
node test-guest-cart.js
```

## Security Considerations

1. **Session Management**: Session ID được tạo ngẫu nhiên và an toàn
2. **Input Validation**: Tất cả input đều được validate
3. **Rate Limiting**: Nên implement rate limiting cho API
4. **Data Privacy**: Thông tin guest được mã hóa và bảo vệ
5. **Order Verification**: Guest order cần email/phone để verify

## Database Schema

### Cart Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId, // null cho guest
  sessionId: String, // chỉ có cho guest
  items: [{
    type: String, // 'product' | 'combo'
    product: ObjectId,
    comboId: ObjectId,
    name: String,
    size: String,
    crust: String,
    selections: Mixed,
    quantity: Number,
    price: Number,
    note: String
  }],
  voucher: String,
  plasticRequest: Boolean,
  updatedAt: Date
}
```

### GuestOrder Collection
```javascript
{
  _id: ObjectId,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      district: String,
      ward: String
    }
  },
  orderInfo: {
    items: Array,
    totalAmount: Number,
    deliveryFee: Number,
    discount: Number,
    finalAmount: Number,
    voucher: String,
    plasticRequest: Boolean
  },
  deliveryInfo: {
    method: String, // 'delivery' | 'pickup'
    store: ObjectId,
    estimatedTime: String,
    note: String
  },
  paymentInfo: {
    method: String, // 'cash' | 'card' | 'momo' | 'vnpay'
    status: String, // 'pending' | 'paid' | 'failed'
    transactionId: String
  },
  status: String, // 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  sessionId: String,
  userId: ObjectId, // khi merge với user
  mergedOrderId: ObjectId, // khi merge với order
  createdAt: Date,
  updatedAt: Date
}
``` 