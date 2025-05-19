const express = require('express')
const router = express.Router()
const { verifyJWT } = require('../middlewares/auth')
const { payment, webhook } = require('../controllers/paystackController')
const { rawBodySaver } = require('../middlewares/paystack')

router.post('/initialize', verifyJWT, payment);

router.post('/webhook', express.json({ verify: rawBodySaver }), webhook);

module.exports = router;
