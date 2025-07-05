const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/products';
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Thay bằng token admin thực tế

const products = [
  // Pizzas
  {
    name: "Pizza Pepperoni",
    description: "Pepperoni, phô mai mozzarella, xốt sốt cà chua",
    category: "pizza",
    sizes: [
      {"name": "S", "price": 180000},
      {"name": "M", "price": 240000},
      {"name": "L", "price": 300000}
    ],
    availableCrusts: ["Mỏng", "Dày", "Viền phô mai"]
  },
  {
    name: "Pizza Gà Nướng BBQ",
    description: "Gà nướng, hành tây, phô mai mozzarella, xốt BBQ",
    category: "pizza",
    sizes: [
      {"name": "S", "price": 200000},
      {"name": "M", "price": 260000},
      {"name": "L", "price": 320000}
    ],
    availableCrusts: ["Mỏng", "Dày"]
  },
  {
    name: "Pizza Rau Củ",
    description: "Nấm, ớt chuông, hành tây, cà chua, phô mai mozzarella",
    category: "pizza",
    sizes: [
      {"name": "S", "price": 160000},
      {"name": "M", "price": 220000},
      {"name": "L", "price": 280000}
    ],
    availableCrusts: ["Mỏng", "Dày"]
  },
  
  // Drinks
  {
    name: "Pepsi",
    description: "Nước ngọt có ga Pepsi",
    category: "drink",
    sizes: [
      {"name": "330ml", "price": 25000},
      {"name": "500ml", "price": 35000},
      {"name": "1.5L", "price": 55000}
    ],
    availableCrusts: []
  },
  {
    name: "Coca Cola",
    description: "Nước ngọt có ga Coca Cola",
    category: "drink",
    sizes: [
      {"name": "330ml", "price": 25000},
      {"name": "500ml", "price": 35000},
      {"name": "1.5L", "price": 55000}
    ],
    availableCrusts: []
  },
  {
    name: "Sprite",
    description: "Nước ngọt có ga Sprite",
    category: "drink",
    sizes: [
      {"name": "330ml", "price": 25000},
      {"name": "500ml", "price": 35000},
      {"name": "1.5L", "price": 55000}
    ],
    availableCrusts: []
  },
  
  // Sides
  {
    name: "Gà Rán",
    description: "Gà rán giòn, thơm ngon",
    category: "side",
    sizes: [
      {"name": "S", "price": 45000},
      {"name": "M", "price": 65000},
      {"name": "L", "price": 85000}
    ],
    availableCrusts: []
  },
  {
    name: "Khoai Tây Chiên",
    description: "Khoai tây chiên giòn, vàng ươm",
    category: "side",
    sizes: [
      {"name": "S", "price": 35000},
      {"name": "M", "price": 50000},
      {"name": "L", "price": 65000}
    ],
    availableCrusts: []
  },
  
  // Desserts
  {
    name: "Kem Vani",
    description: "Kem vani mát lạnh",
    category: "dessert",
    sizes: [
      {"name": "S", "price": 25000},
      {"name": "M", "price": 35000}
    ],
    availableCrusts: []
  }
];

async function createProducts() {
  console.log('Bắt đầu tạo sản phẩm...');
  
  for (const product of products) {
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('sizes', JSON.stringify(product.sizes));
      formData.append('availableCrusts', JSON.stringify(product.availableCrusts));
      
      const response = await axios.post(API_BASE, formData, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(`✅ Đã tạo: ${product.name}`);
    } catch (error) {
      console.error(`❌ Lỗi tạo ${product.name}:`, error.response?.data || error.message);
    }
  }
  
  console.log('Hoàn thành!');
}

// Chạy script
createProducts(); 