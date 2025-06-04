const express = require('express')
const router = express.Router()
const { verifyJWT } = require('../middlewares/auth')
const { 
    purchaseAirtime,
    purchaseData,
    getDataPlans
 } = require('../controllers/servicesController')

router.post('/airtime', verifyJWT, purchaseAirtime)
router.post('/data', verifyJWT, purchaseData)
router.get('/data/plans/:network', verifyJWT, getDataPlans) // dynamic plan fetch

module.exports = router
