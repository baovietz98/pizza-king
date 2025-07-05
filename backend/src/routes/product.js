const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, role } = require('../middlewares/auth');
const upload = require('../config/multer');

// Tạo sản phẩm mới (admin)
router.post('/', auth, role(['admin']), upload.single('image'), productController.createProduct);
// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);
// Lấy chi tiết sản phẩm
router.get('/:id', productController.getProductById);
// Cập nhật sản phẩm (admin)
router.put('/:id', auth, role(['admin']), upload.single('image'), productController.updateProduct);
// Xóa sản phẩm (admin)
router.delete('/:id', auth, role(['admin']), productController.deleteProduct);

module.exports = router; 