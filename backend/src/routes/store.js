const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { auth, role } = require('../middlewares/auth');

// Chỉ admin mới được tạo store
router.post('/', auth, role(['admin']), storeController.createStore);
// Lấy tất cả cửa hàng (ai cũng xem được)
router.get('/', storeController.getAllStores);
// Tìm cửa hàng gần nhất theo tọa độ (ai cũng dùng được)
router.get('/nearest', storeController.findNearestStore);

module.exports = router; 