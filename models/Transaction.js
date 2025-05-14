const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refId: String,
    type: { type: String, enum: ['funding', 'airtime', 'data', 'tv', 'electricity', 'pin', 'withdrawal'] },
    serviceProvider: String,
    status: { type: String, enum: ['pending', 'success', 'failed'] },
    amount: Number,
    details: Object,
    response: Object,
    commission: Number
}, { timestamps: true })

const transactionModel = mongoose.model('Transaction', transactionSchema)

module.exports = transactionModel