const axios = require('axios')

exports.sendAirtimeRequest = async ({ network, phone, amount }) => {
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