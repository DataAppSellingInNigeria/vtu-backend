const Wallet = require('../models/Wallet')
const { logTransaction } = require('../utils/transaction')
const { sendAirtimeRequest } = require('../utils/vtuService')

const purchaseAirtime = async (req, res) => {
    const { network, phone, amount } = req.body
    const userId = req.user.id

    if (!network || !phone || !amount) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        const wallet = await Wallet.findOne({ userId })

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' })
        }

        // 1. Call VTU API provider
        const vtuResponse = await sendAirtimeRequest({ network, phone, amount })

        if (vtuResponse.status !== 'success') {
            return res.status(500).json({ message: 'VTU provider failed', error: vtuResponse })
        }

        // 2. Debit wallet
        wallet.balance -= amount
        await wallet.save()

        // 3. Log transaction
        await logTransaction({
            userId,
            refId: vtuResponse.ref || vtuResponse.reference || 'N/A',
            type: 'airtime',
            service: network,
            amount,
            status: 'success',
            response: vtuResponse
        })

        res.status(200).json({ message: 'Airtime sent successfully', data: vtuResponse })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

module.exports = {
    purchaseAirtime,
}