const Transaction = require('../models/Transaction')

const getUserTransactions = async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ timestamp: -1 })
    res.json(transactions)
}

module.exports = getUserTransactions