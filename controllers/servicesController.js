const Wallet = require('../models/Wallet')
const Pin = require('../models/Pin')
const { logTransaction } = require('../utils/transaction')
const {
    sendAirtimeRequest,
    sendDataPurchase,
    fetchDataPlans,
    verifyMeterWithProvider,
    payBillToProvider,
    sendCableRecharge,
    fetchExamPin
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

const verifyMeter = async (req, res) => {
    const { disco, meter_number, meter_type } = req.body

    try {
        const result = await verifyMeterWithProvider({ disco, meter_number, meter_type })
        res.status(200).json({ success: true, data: result })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Verification failed', error: err.message })
    }
}

const payElectricityBill = async (req, res) => {
    const { disco, meter_number, meter_type, amount } = req.body
    const userId = req.user.id

    if (!disco || !meter_number || !meter_type || !amount) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        const wallet = await Wallet.findOne({ userId })

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' })
        }

        const vtuResponse = await payBillToProvider({ disco, meter_number, meter_type, amount })

        if (vtuResponse.status !== 'success') {
            return res.status(502).json({ message: 'VTU provider failed', error: vtuResponse })
        }

        wallet.balance -= amount;
        await wallet.save();

        await logTransaction({
            userId,
            refId: vtuResponse.ref || vtuResponse.reference || 'N/A',
            type: 'electricity',
            service: disco,
            amount,
            status: 'success',
            response: vtuResponse
        })

        res.status(200).json({ message: 'Electricity bill paid successfully', data: vtuResponse })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const rechargeCable = async (req, res) => {
    const { provider, smartcard, bouquet, amount } = req.body
    const userId = req.user.id

    if (!provider || !smartcard || !bouquet || !amount) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        const wallet = await Wallet.findOne({ userId })

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' })
        }

        const response = await sendCableRecharge({ provider, smartcard, bouquet, amount })

        if (response.status !== 'success') {
            return res.status(502).json({ message: 'Recharge failed', error: response })
        }

        wallet.balance -= amount
        await wallet.save()

        await logTransaction({
            userId,
            refId: response.ref || response.reference || 'N/A',
            type: 'cable',
            service: provider,
            amount,
            status: 'success',
            response
        })

        res.status(200).json({ message: 'Cable subscription successful', data: response })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const purchaseExamPin = async (req, res) => {
    const { service, amount } = req.body
    const userId = req.user.id

    try {
        const wallet = await Wallet.findOne({ userId })
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' })
        }

        const response = await fetchExamPin({ service })

        if (!response.success || !response.pin) {
            return res.status(502).json({ message: 'PIN purchase failed', error: response })
        }

        wallet.balance -= amount
        await wallet.save()

        await Pin.create({
            userId,
            service,
            code: response.pin,
            refId: response.ref,
            status: 'delivered'
        })

        await logTransaction({
            userId,
            refId: response.ref,
            type: 'pin',
            service,
            amount,
            status: 'success',
            response
        })

        res.status(200).json({
            message: 'PIN purchased successfully',
            pin: response.pin
        })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getPurchasedPins = async (req, res) => {
    const pins = await Pin.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json({ pins })
}

module.exports = {
    purchaseAirtime,
    purchaseData,
    getDataPlans,
    payElectricityBill,
    verifyMeter,
    rechargeCable,
    purchaseExamPin,
    getPurchasedPins
}