const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
    message: { type: String, required: true },
    context: { type: Object }, // can store user ID, request path, etc.
    stackTrace: { type: String },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Log', logSchema)