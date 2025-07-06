# Logic Merge Giỏ Hàng - Pizza Hut System

## Tổng quan
Hệ thống hỗ trợ merge giỏ hàng tự động khi guest user đăng nhập, đảm bảo không mất sản phẩm đã thêm vào giỏ hàng.

## Các trường hợp xử lý

### Trường hợp 1: Guest tạo giỏ hàng → Đăng nhập
```
1. Guest thêm sản phẩm vào giỏ hàng (sessionId)
2. Guest đăng nhập với sessionId
3. Backend tự động merge guest cart vào user cart
4. Guest cart bị xóa
5. User cart chứa tất cả sản phẩm
```

### Trường hợp 2: User đã có giỏ hàng → Guest thêm sản phẩm → Đăng nhập
```
1. User đã có giỏ hàng với sản phẩm A
2. Guest thêm sản phẩm B vào giỏ hàng (sessionId)
3. Guest đăng nhập với sessionId
4. Backend merge: sản phẩm B được thêm vào user cart
5. Guest cart bị xóa
6. User cart chứa cả sản phẩm A và B
```

### Trường hợp 3: User đã có giỏ hàng → Guest thêm sản phẩm trùng → Đăng nhập
```
1. User có sản phẩm A (size L, quantity 1)
2. Guest thêm sản phẩm A (size L, quantity 2)
3. Guest đăng nhập
4. Backend merge: quantity = 1 + 2 = 3
5. User cart có sản phẩm A với quantity = 3
```

## Logic Merge Chi tiết

### Backend (authController.js)
```javascript
// Khi đăng nhập
exports.login = async (req, res) => {
  const { email, password, sessionId } = req.body;
  
  // Xác thực user
  // ...
  
  // Tự động merge nếu có sessionId
  if (role === 'user' && sessionId) {
    await mergeGuestCart(account._id, sessionId);
    cartMerged = true;
  }
  
  res.json({ token, user, cartMerged });
}
```

### Logic Merge (cartController.js)
```javascript
async function mergeGuestCart(userId, sessionId) {
  const userCart = await Cart.findOne({ user: userId });
  const guestCart = await Cart.findOne({ sessionId: sessionId });
  
  if (!guestCart || guestCart.items.length === 0) return;
  
  if (!userCart) {
    // Tạo cart mới cho user
    const newUserCart = new Cart({
      user: userId,
      items: guestCart.items,
      voucher: guestCart.voucher,
      plasticRequest: guestCart.plasticRequest
    });
    await newUserCart.save();
  } else {
    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(item => 
        // So sánh theo type, product, size, crust, note
      );
      
      if (existingItemIndex >= 0) {
        // Cộng quantity nếu trùng
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Thêm item mới
        userCart.items.push(guestItem);
      }
    }
    await userCart.save();
  }
  
  // Xóa guest cart
  await Cart.deleteOne({ sessionId: sessionId });
}
```

### Frontend (authApi.ts)
```typescript
export async function login(payload: LoginPayload) {
  const sessionId = getSessionId(); // Lấy từ localStorage
  
  const loginData = {
    ...payload,
    ...(sessionId && { sessionId }) // Gửi sessionId nếu có
  };

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData)
  });

  const data = await response.json();
  
  // Xóa sessionId nếu đã merge thành công
  if (data.cartMerged && sessionId) {
    localStorage.removeItem('cart_session_id');
  }
  
  return data;
}
```

## Các tính năng bảo mật

1. **Chỉ merge cho user**: Admin và Staff không được merge cart
2. **Validation**: Kiểm tra sessionId hợp lệ trước khi merge
3. **Error handling**: Login không fail nếu merge cart lỗi
4. **Cleanup**: Tự động xóa guest cart sau khi merge

## Test Cases

### Test 1: Guest → Login
```bash
# 1. Guest thêm sản phẩm
POST /api/cart/add-product
Headers: X-Session-ID: guest-session-123
Body: { productId: "123", size: "M", quantity: 2 }

# 2. Guest đăng nhập
POST /api/auth/login
Body: { email: "user@example.com", password: "pass", sessionId: "guest-session-123" }

# 3. Kiểm tra user cart
GET /api/cart
Headers: Authorization: Bearer <token>
```

### Test 2: User + Guest → Login
```bash
# 1. User đăng nhập và thêm sản phẩm A
# 2. Guest thêm sản phẩm B
# 3. Guest đăng nhập với sessionId
# 4. Kiểm tra user cart có cả A và B
```

## Lưu ý quan trọng

1. **SessionId management**: Frontend tự động quản lý sessionId trong localStorage
2. **Cart refresh**: Sau khi login, frontend tự động refresh cart để lấy dữ liệu mới
3. **User feedback**: Hiển thị thông báo khi merge cart thành công
4. **Database indexes**: Đảm bảo indexes cho user và sessionId fields

## Troubleshooting

### Lỗi thường gặp
1. **Duplicate key error**: Kiểm tra database indexes
2. **Cart not merged**: Kiểm tra sessionId có được gửi đúng không
3. **Items missing**: Kiểm tra logic merge có đúng không

### Debug
```javascript
// Kiểm tra cart trong database
db.carts.find({ user: ObjectId("user_id") })
db.carts.find({ sessionId: "session_id" })

// Kiểm tra logs
console.log('Merge cart:', { userId, sessionId, cartMerged });
``` 