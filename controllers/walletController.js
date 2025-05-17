const Wallet = require('../models/Wallet')

const getWallet = async (req, res) => {
    const wallet = await Wallet.findOne({ userId: req.user.id })
    res.json(wallet)
}

const debitWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id })
        await wallet.debit(req.body.amount)
        res.json({ message: 'Wallet debited', balance: wallet.balance })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const creditWallet = async (req, res) => {
    const wallet = await Wallet.findOne({ userId: req.user.id })
    await wallet.credit(req.body.amount)
    res.json({ message: 'Wallet credited', balance: wallet.balance })
}


module.exports = {
    getWallet,
    debitWallet,
    creditWallet
}