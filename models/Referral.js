const mongoose = require('mongoose')

const referralSchema = new mongoose.Schema({
    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refereeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bonusAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'rewarded'], default: 'pending' }
}, { timestamps: { createdAt: true, updatedAt: false } })

const referralModel = mongoose.model('Referral', referralSchema)

module.exports = referralModel