const mongoose = require('mongoose')

const withdrawalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNote: { type: String, default: '' }
}, { timestamps: { createdAt: true, updatedAt: false } })

const withdrawalModel = mongoose.model('WithdrawalRequest', withdrawalSchema)

module.exports = withdrawalModel