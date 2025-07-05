const mongoose = require('mongoose');

// Schema cho từng bước chọn trong combo
const comboStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true }, // Bước 1, 2, 3...
  stepName: { type: String, required: true }, // "Chọn pizza", "Chọn món ăn kèm", "Chọn thức uống"
  required: { type: Boolean, default: true }, // Bước bắt buộc hay không
  maxSelections: { type: Number, default: 1 }, // Số lượng có thể chọn
  options: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, default: 'M' }, // Size mặc định cho sản phẩm này
    crusts: [String], // Các loại đế có thể chọn cho pizza này
    upgradePrice: { type: Number, default: 0 }, // Giá nâng cấp (ví dụ: nâng cấp pizza +30k)
    isDefault: { type: Boolean, default: false } // Có phải lựa chọn mặc định không
  }]
});

const comboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  originalPrice: { type: Number, required: true }, // Tổng giá gốc nếu mua riêng
  comboPrice: { type: Number, required: true }, // Giá combo (đã giảm)
  discount: { type: Number, default: 0 }, // Phần trăm giảm giá
  steps: [comboStepSchema], // Các bước chọn trong combo
  image: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index cho tìm kiếm
comboSchema.index({ name: 1 });
comboSchema.index({ discount: 1 });
comboSchema.index({ isActive: 1 });

module.exports = mongoose.model('Combo', comboSchema); 