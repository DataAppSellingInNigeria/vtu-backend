const express = require('express')
const walletController = require('../controllers/walletController')
const { verifyJWT } = require('../middlewares/auth')

const router = express.Router()

router.get('/', verifyJWT, walletController.getWallet)
router.post('/debit', verifyJWT, walletController.debitWallet)
router.post('/credit', verifyJWT, walletController.creditWallet)

module.exports = router