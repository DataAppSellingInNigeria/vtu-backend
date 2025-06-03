const express = require('express')
const walletController = require('../controllers/walletController')
const { verifyJWT } = require('../middlewares/auth')

const router = express.Router()

router.get('/', verifyJWT, walletController.getWallet)
router.post('/debit', verifyJWT, walletController.debitWallet)
router.post('/credit', verifyJWT, walletController.creditWallet)
router.get('/freeze', verifyJWT, walletController.freezeWallet)
router.get('/unfreeze', verifyJWT, walletController.unfreezeWallet)

module.exports = router