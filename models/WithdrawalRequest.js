const mongoose = require('mongoose')

const withdrawalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNote: String
}, { timestamps: { createdAt: true, updatedAt: false } })

const withdrawalModel = mongoose.model('WithdrawalRequest', withdrawalSchema)

module.exports = withdrawalModel