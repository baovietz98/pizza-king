const Combo = require('../models/Combo');
const Product = require('../models/Product');

// Tạo combo mới
exports.createCombo = async (req, res) => {
  try {
    const { name, description, steps, originalPrice, comboPrice, discount, isActive } = req.body;
    
    // Validation
    if (!name || !steps || !originalPrice || !comboPrice) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập đầy đủ thông tin: name, steps, originalPrice, comboPrice' 
      });
    }

    // Kiểm tra steps có hợp lệ không
    const parsedSteps = JSON.parse(steps);
    for (const step of parsedSteps) {
      for (const option of step.options) {
        const product = await Product.findById(option.product);
        if (!product) {
          return res.status(400).json({ 
            message: `Sản phẩm ${option.product} không tồn tại trong bước ${step.stepNumber}` 
          });
        }
      }
    }

    let image = '';
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    const combo = new Combo({
      name,
      description,
      steps: parsedSteps,
      originalPrice,
      comboPrice,
      discount: discount || 0,
      image,
      isActive: isActive !== undefined ? isActive : true
    });

    await combo.save();
    
    // Populate products để trả về thông tin đầy đủ
    await combo.populate('steps.options.product');
    res.status(201).json(combo);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy tất cả combo
exports.getAllCombos = async (req, res) => {
  try {
    const combos = await Combo.find({ isActive: true }).populate('steps.options.product');
    res.json(combos);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy chi tiết combo
exports.getComboById = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('steps.options.product');
    if (!combo) return res.status(404).json({ message: 'Không tìm thấy combo' });
    res.json(combo);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật combo
exports.updateCombo = async (req, res) => {
  try {
    const { name, description, steps, originalPrice, comboPrice, discount, isActive } = req.body;
    
    let updateData = {
      name,
      description,
      originalPrice,
      comboPrice,
      discount,
      isActive
    };
    
    if (steps) {
      const parsedSteps = JSON.parse(steps);
      // Kiểm tra products có tồn tại không
      for (const step of parsedSteps) {
        for (const option of step.options) {
          const product = await Product.findById(option.product);
          if (!product) {
            return res.status(400).json({ 
              message: `Sản phẩm ${option.product} không tồn tại trong bước ${step.stepNumber}` 
            });
          }
        }
      }
      updateData.steps = parsedSteps;
    }
    
    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }
    
    const combo = await Combo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!combo) return res.status(404).json({ message: 'Không tìm thấy combo' });
    
    await combo.populate('steps.options.product');
    res.json(combo);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa combo
exports.deleteCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo) return res.status(404).json({ message: 'Không tìm thấy combo' });
    res.json({ message: 'Đã xóa combo' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy combo theo discount (khuyến mãi)
exports.getCombosByDiscount = async (req, res) => {
  try {
    const { minDiscount = 0 } = req.query;
    const combos = await Combo.find({ 
      isActive: true, 
      discount: { $gte: parseInt(minDiscount) } 
    }).populate('steps.options.product');
    res.json(combos);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy thông tin combo theo từng bước
exports.getComboSteps = async (req, res) => {
  try {
    const { comboId } = req.params;
    const combo = await Combo.findById(comboId).populate('steps.options.product');
    
    if (!combo) {
      return res.status(404).json({ message: 'Không tìm thấy combo' });
    }
    
    // Trả về thông tin từng bước
    const stepsInfo = combo.steps.map(step => ({
      stepNumber: step.stepNumber,
      stepName: step.stepName,
      required: step.required,
      maxSelections: step.maxSelections,
      options: step.options.map(option => ({
        productId: option.product._id,
        productName: option.product.name,
        productDescription: option.product.description,
        size: option.size,
        upgradePrice: option.upgradePrice,
        isDefault: option.isDefault,
        productImage: option.product.image
      }))
    }));
    
    res.json({
      comboId: combo._id,
      comboName: combo.name,
      comboDescription: combo.description,
      originalPrice: combo.originalPrice,
      comboPrice: combo.comboPrice,
      discount: combo.discount,
      steps: stepsInfo
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Validate combo selection (kiểm tra xem đã chọn đủ chưa)
exports.validateComboSelection = async (req, res) => {
  try {
    const { comboId } = req.params;
    const { selections } = req.body; // { step1: [productId], step2: [productId], step3: [productId] }
    
    const combo = await Combo.findById(comboId);
    if (!combo) {
      return res.status(404).json({ message: 'Không tìm thấy combo' });
    }
    
    // Kiểm tra từng bước
    const validation = {
      isValid: true,
      errors: [],
      totalPrice: combo.comboPrice,
      selections: {}
    };
    
    for (const step of combo.steps) {
      const stepKey = `step${step.stepNumber}`;
      const selectedProducts = selections[stepKey] || [];
      
      // Kiểm tra bước bắt buộc
      if (step.required && selectedProducts.length === 0) {
        validation.isValid = false;
        validation.errors.push(`Bước ${step.stepNumber} (${step.stepName}) là bắt buộc`);
      }
      
      // Kiểm tra số lượng chọn
      if (selectedProducts.length > step.maxSelections) {
        validation.isValid = false;
        validation.errors.push(`Bước ${step.stepNumber} chỉ được chọn tối đa ${step.maxSelections} món`);
      }
      
      // Kiểm tra id sản phẩm có thuộc options không
      for (const productId of selectedProducts) {
        const isValidOption = step.options.some(opt => opt.product.toString() === productId);
        if (!isValidOption) {
          validation.isValid = false;
          validation.errors.push(`Sản phẩm ${productId} không hợp lệ ở bước ${step.stepNumber}`);
        }
      }
      
      // Tính giá nâng cấp
      let stepUpgradePrice = 0;
      for (const productId of selectedProducts) {
        const option = step.options.find(opt => opt.product.toString() === productId);
        if (option) {
          stepUpgradePrice += option.upgradePrice;
        }
      }
      
      validation.totalPrice += stepUpgradePrice;
      validation.selections[stepKey] = {
        selectedProducts,
        upgradePrice: stepUpgradePrice
      };
    }
    
    res.json(validation);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 