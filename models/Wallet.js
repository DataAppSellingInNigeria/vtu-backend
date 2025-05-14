const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    balance: { type: Number, default: 0 },
    frozen: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' }
}, { timestamps: true })

const walletModel = mongoose.model('Wallet', walletSchema)

module.exports = walletModel