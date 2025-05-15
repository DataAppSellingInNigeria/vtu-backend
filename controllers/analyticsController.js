const Transaction = require('../models/Transaction')
const User = require('../models/User')

const getDailyTransactions = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { status: 'success' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ])

        res.json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Analytics failed' });
    }
}

const revenuePerDay = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { status: 'success' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ])

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Analytics failed' })
    }
}

const topUsedServices = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: "$type", total: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ])

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Analytics failed' })
    }
}

const dailyUserRegistrations = async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Analytics failed' })
    }
}

module.exports = {
    getDailyTransactions,
    revenuePerDay,
    topUsedServices,
    dailyUserRegistrations
}