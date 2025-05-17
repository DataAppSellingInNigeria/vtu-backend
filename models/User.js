const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    accountType: { type: String, enum: ['retail', 'reseller'], default: 'retail' },
    status: { type: Boolean, default: false },
    referrerCode: String,
    myReferralCode: String,
    totalReferralBonus: { type: Number, default: 0 },
    resellerEarnings: { type: Number, default: 0 }
}, { timestamps: true })

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Wallet.deleteOne({ userId: doc._id })
    }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel