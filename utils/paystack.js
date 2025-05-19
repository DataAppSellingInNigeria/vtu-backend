const axios = require('axios')

const initializePayment = async (email, amount, metadata = {}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    }

    const body = {
        email,
        amount: amount * 100, // Paystack accepts kobo
        metadata
    }

    const res = await axios.post(`${process.env.PAYSTACK_BASE_URL}/transaction/initialize`, body, config)
    return res.data
}

module.exports = {
    initializePayment
}