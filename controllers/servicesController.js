const Wallet = require('../models/Wallet')
const { logTransaction } = require('../utils/transaction')
const { 
    sendAirtimeRequest,
    sendDataPurchase,
    fetchDataPlans
 } = require('../utils/vtuService')

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

const purchaseData = async (req, res) => {
    const { network, phone, planCode, amount } = req.body
    const userId = req.user.id

    if (!network || !phone || !planCode || !amount) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        const wallet = await Wallet.findOne({ userId })

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' })
        }

        // VTU API call
        const vtuResponse = await sendDataPurchase({ network, phone, planCode })

        if (vtuResponse.status !== 'success') {
            return res.status(502).json({ message: 'VTU provider failed', error: vtuResponse })
        }

        wallet.balance -= amount;
        await wallet.save();

        await logTransaction({
            userId,
            refId: vtuResponse.ref || vtuResponse.reference || 'N/A',
            type: 'data',
            service: network,
            amount,
            status: 'success',
            response: vtuResponse
        })

        res.status(200).json({ message: 'Data purchase successful', data: vtuResponse })
    } catch (err) {
        console.error('Data purchase error:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getDataPlans = async (req, res) => {
    const { network } = req.params

    try {
        const plans = await fetchDataPlans(network)
        res.status(200).json({ success: true, plans })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching plans', error: err.message })
    }
}

module.exports = {
    purchaseAirtime,
    purchaseData,
    getDataPlans
}