const express = require('express')
const router = express.Router()
const { verifyJWT } = require('../middleware/auth')
const { getUserTransactions } = require('../controllers/transactionController')

router.get('/', verifyJWT, getUserTransactions)

module.exports = router
