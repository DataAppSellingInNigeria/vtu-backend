const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed
})

const settingModel = mongoose.model('Setting', settingSchema)

module.exports = settingModel