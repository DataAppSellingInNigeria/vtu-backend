const express = require('express')
const router = express.Router()
const { verifyJWT, checkRole } = require('../middleware/auth')
const { getUserTransactions } = require('../controllers/transactionController')

router.get('/', verifyJWT, getUserTransactions)
router.get('/admin/transactions', checkRole('admin'), getFilteredTransactions)

module.exports = router
