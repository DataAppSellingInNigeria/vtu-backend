const express = require('express')
const router = express.Router()
const { verifyJWT } = require('../middlewares/auth')
const { purchaseAirtime } = require('../controllers/servicesController')

router.post('/airtime', verifyJWT, purchaseAirtime)

module.exports = router
