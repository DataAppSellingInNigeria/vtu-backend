const express = require('express')
const router = express.Router()
const { verifyJWT } = require('../middlewares/auth')
const { 
    purchaseAirtime,
    purchaseData,
    getDataPlans,
    payElectricityBill,
    verifyMeter
 } = require('../controllers/servicesController')

router.post('/airtime', verifyJWT, purchaseAirtime)
router.post('/data', verifyJWT, purchaseData)
router.get('/data/plans/:network', verifyJWT, getDataPlans) // dynamic plan fetch
router.post('/electricity', verifyJWT, payElectricityBill);
router.post('/electricity/verify/meter', verifyJWT, verifyMeter); // Optional

module.exports = router
