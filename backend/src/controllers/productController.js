const Product = require('../models/Product');

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      sizes,
      availableCrusts, 
      vegetarian,
      spicy,
      isActive 
    } = req.body;
    
    let image = '';
    if (req.file && req.file.path) {
      image = req.file.path;
    }
    
    // Chuyển đổi boolean
    const vegetarianBool = vegetarian === 'true' || vegetarian === true;
    const spicyBool = spicy === 'true' || spicy === true;
    
    const product = new Product({
      name,
      description,
      category,
      sizes: sizes ? JSON.parse(sizes) : [],
      availableCrusts: availableCrusts ? JSON.parse(availableCrusts) : [],
      vegetarian: vegetarianBool,
      spicy: spicyBool,
      image,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const { category, vegetarian, spicy } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (vegetarian !== undefined) filter.vegetarian = vegetarian === 'true' || vegetarian === true;
    if (spicy !== undefined) filter.spicy = spicy === 'true' || spicy === true;
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy chi tiết sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      sizes,
      availableCrusts, 
      vegetarian,
      spicy,
      isActive 
    } = req.body;
    
    let updateData = {
      name,
      description,
      category,
      isActive
    };
    
    if (sizes) updateData.sizes = JSON.parse(sizes);
    if (availableCrusts) updateData.availableCrusts = JSON.parse(availableCrusts);
    if (vegetarian !== undefined) updateData.vegetarian = vegetarian === 'true' || vegetarian === true;
    if (spicy !== undefined) updateData.spicy = spicy === 'true' || spicy === true;
    
    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 