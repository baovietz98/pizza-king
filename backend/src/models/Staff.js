const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'staff' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
}, { timestamps: true });

staffSchema.index({ storeId: 1 });
staffSchema.index({ role: 1 });

module.exports = mongoose.model('Staff', staffSchema); 