const mongoose = require('mongoose')

const adminLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    targetId: mongoose.Schema.Types.ObjectId,
    notes: String
}, { timestamps: { createdAt: true, updatedAt: false } })

const adminLogModel = mongoose.model('AdminLog', adminLogSchema)

module.exports = adminLogModel
