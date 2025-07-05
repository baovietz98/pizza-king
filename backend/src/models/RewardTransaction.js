const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
  pointsUsed: Number
}, { timestamps: { createdAt: true, updatedAt: false } });

rewardTransactionSchema.index({ userId: 1 });
rewardTransactionSchema.index({ rewardId: 1 });
rewardTransactionSchema.index({ pointsUsed: 1 });

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema); 