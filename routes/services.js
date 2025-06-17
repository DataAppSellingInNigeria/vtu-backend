const express = require('express')
const router = express.Router()
const { verifyJWT } = require('../middlewares/auth')
const { 
    purchaseAirtime,
    purchaseData,
    getPlans,
    payElectricityBill,
    verifyMeter,
    cablePlans,
    rechargeCable,
    purchaseExamPin,
    getPurchasedPins,
    checkTransaction
 } = require('../controllers/servicesController')

 router.get('/plans/:network', verifyJWT, getPlans) // take only 1 b/w getDataPlans and cablePlans, It can also work for Exams Pin
router.post('/airtime', verifyJWT, purchaseAirtime)
router.post('/data', verifyJWT, purchaseData)
router.post('/electricity', verifyJWT, payElectricityBill)
router.post('/electricity/verify/meter', verifyJWT, verifyMeter)
router.post('/transaction/status', verifyJWT, checkTransaction) // check transaction for airtime, data, electricity and cables 
router.post('/cable', verifyJWT, rechargeCable)
router.post('/purchase-pin', verifyJWT, purchaseExamPin)
router.get('/purchased-pins', verifyJWT, getPurchasedPins)

module.exports = router
