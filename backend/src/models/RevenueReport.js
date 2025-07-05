const mongoose = require('mongoose');

const revenueReportSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  startDate: Date,
  endDate: Date,
  totalRevenue: Number,
  breakdown: Object
}, { timestamps: true });

revenueReportSchema.index({ adminId: 1 });
revenueReportSchema.index({ storeId: 1 });
revenueReportSchema.index({ startDate: 1 });
revenueReportSchema.index({ endDate: 1 });

module.exports = mongoose.model('RevenueReport', revenueReportSchema); 