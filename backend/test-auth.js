const jwt = require('jsonwebtoken');

// Test token
const testToken = 'YOUR_TOKEN_HERE'; // Thay bằng token thực tế

try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log('Decoded token:', decoded);
  console.log('userId:', decoded.userId);
  console.log('role:', decoded.role);
} catch (err) {
  console.error('Token error:', err.message);
} 