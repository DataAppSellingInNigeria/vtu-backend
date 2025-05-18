const Withdrawal = require('../models/WithdrawalRequest')
const Wallet = require('../models/Wallet')

// User requests withdrawal
const requestWithdrawal = async (req, res) => {
    try {
        const { amount } = req.body
        const wallet = await Wallet.findOne({ userId: req.user.id })

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' })
        }

        // Freeze the amount
        await wallet.freeze(amount)

        const request = await Withdrawal.create({
            userId: req.user.id,
            amount
        })

        res.json({ message: 'Withdrawal request submitted', request })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Admin approves/rejects withdrawal
const processWithdrawal = async (req, res) => {
    try {
        const { status, adminNote } = req.body
        const request = await Withdrawal.findById(req.params.id)
        if (!request || request.status !== 'pending') {
            return res.status(400).json({ error: 'Invalid request or already processed' })
        }

        const wallet = await Wallet.findOne({ userId: request.userId })

        if (status === 'approved') {
            await wallet.unfreeze(request.amount) // unfreeze since it will be externally sent
            await wallet.debit(request.amount) // permanently remove from balance
        } else if (status === 'rejected') {
            await wallet.unfreeze(request.amount) // return funds to balance
        }

        request.status = status
        request.adminNote = adminNote
        await request.save()

        res.json({ message: `Withdrawal ${status}`, request })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Admin views all withdrawal requests
const getAllWithdrawals = async (req, res) => {
    const requests = await Withdrawal.find().populate('userId', 'name email').sort({ createdAt: -1 })
    res.json(requests)
}

// User views their own withdrawal history
const getMyWithdrawals = async (req, res) => {
    const requests = await Withdrawal.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(requests)
}


module.exports = {
    requestWithdrawal,
    processWithdrawal,
    getAllWithdrawals,
    getMyWithdrawals
}