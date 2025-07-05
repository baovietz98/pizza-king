const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  email: 'user@example.com',
  password: 'password123'
};

async function testCartAPI() {
  try {
    console.log('=== Testing Cart API ===');
    
    // 1. Login để lấy token
    console.log('\n1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    const token = loginResponse.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');
    
    // 2. Test debug user endpoint
    console.log('\n2. Testing debug user endpoint...');
    const debugResponse = await axios.get(`${BASE_URL}/cart/debug-user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Debug user response:', debugResponse.data);
    
    // 3. Test get cart
    console.log('\n3. Testing get cart...');
    const cartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Cart response:', cartResponse.data);
    
    // 4. Test add product to cart
    console.log('\n4. Testing add product to cart...');
    const addProductData = {
      productId: '507f1f77bcf86cd799439011', // Thay bằng ID thực tế
      size: 'Medium',
      quantity: 1,
      note: 'Test note'
    };
    
    try {
      const addProductResponse = await axios.post(`${BASE_URL}/cart/add-product`, addProductData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Add product response:', addProductResponse.data);
    } catch (error) {
      console.log('Add product error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testCartAPI(); 