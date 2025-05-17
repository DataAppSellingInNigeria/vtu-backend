const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    frozen: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' }
}, { timestamps: true })

// Credit wallet
walletSchema.methods.credit = function (amount) {
    this.balance += amount
    return this.save()
}

// Debit wallet
walletSchema.methods.debit = function (amount) {
    if (this.balance < amount) throw new Error('Insufficient balance')
    this.balance -= amount
    return this.save()
}

// Freeze balance
walletSchema.methods.freeze = function (amount) {
    if (this.balance < amount) throw new Error('Insufficient balance to freeze')
    this.balance -= amount
    this.frozen += amount
    return this.save()
}

// Unfreeze balance
walletSchema.methods.unfreeze = function (amount) {
    if (this.frozen < amount) throw new Error('Insufficient frozen funds')
    this.frozen -= amount
    this.balance += amount
    return this.save()
}

const walletModel = mongoose.model('Wallet', walletSchema)

module.exports = walletModel