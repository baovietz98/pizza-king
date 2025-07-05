const Store = require('../models/Store');

exports.createStore = async (req, res) => {
  try {
    const { name, address, location, phone } = req.body;
    
    // Validation
    if (!name || !address || !location || !phone) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập đầy đủ thông tin: name, address, location, phone' 
      });
    }

    // Kiểm tra tọa độ
    if (!location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ 
        message: 'Tọa độ phải có 2 giá trị: [longitude, latitude]' 
      });
    }

    const store = new Store({
      name,
      address,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      phone
    });
    
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy tất cả cửa hàng
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Tìm cửa hàng gần nhất theo tọa độ
exports.findNearestStore = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance tính bằng mét
    
    if (!longitude || !latitude) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp tọa độ: longitude, latitude' 
      });
    }

    const stores = await Store.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).limit(5);

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 