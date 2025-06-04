const axios = require('axios')

const sendAirtimeRequest = async ({ network, phone, amount }) => {
    const API_KEY = process.env.VTU_API_KEY;
    const VTU_URL = 'https://dorosub.com/api/airtime'

    console.log(process.env.VTU_API_KEY)

    try {
        const res = await axios.post(VTU_URL, {
            api_key: API_KEY,
            network,
            phone,
            amount
        })

        return res.data
    } catch (error) {
        return { status: 'failed', error: error.message }
    }
}

const sendDataPurchase = async ({ network, phone, planCode }) => {
    const API_KEY = process.env.VTU_API_KEY
    const VTU_URL = 'https://dorosub.com/api/data'

    try {
        const res = await axios.post(VTU_URL, {
            api_key: API_KEY,
            network,
            mobile_number: phone,
            plan: planCode
        })

        return res.data
    } catch (err) {
        return { status: 'failed', error: err.message }
    }
}

const fetchDataPlans = async (network) => {
    const VTU_URL = `https://dorosub.com/api/data/plans?network=${network}&api_key=${process.env.VTU_API_KEY}`

    const res = await axios.get(VTU_URL)
    return res.data.data || []
}

module.exports = {
    sendAirtimeRequest,
    sendDataPurchase,
    fetchDataPlans
}