const { initializePayment } = require('../utils/paystack')
const Wallet = require('../models/Wallet')

const payment = async (req, res) => {
    try {
        const { amount } = req.body
        const payment = await initializePayment(req.user.email, amount, { userId: req.user.id })
        res.json({ authorization_url: payment.data.authorization_url })
    } catch (err) {
        res.status(500).json({ error: 'Paystack error: ' + err.message })
    }
}

const webhook = async (req, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY
    const signature = req.headers['x-paystack-signature']
    const crypto = require('crypto')
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex')

    if (hash !== signature) return res.status(401).send('Unauthorized')

    const event = req.body;
    if (event.event === 'charge.success') {
        const { userId } = event.data.metadata
        const amount = event.data.amount / 100

        const wallet = await Wallet.findOne({ userId })
        await wallet.credit(amount)
    }

    res.sendStatus(200)
}

module.exports = {
    payment,
    webhook
}