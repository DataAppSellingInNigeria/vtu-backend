const express = require('express')
const { verifyJWT, checkRole } = require('../middlewares/auth')
const { getUserTransactions, getFilteredTransactions } = require('../controllers/transactionController')

const router = express.Router()

router.get('/', verifyJWT, getUserTransactions)
router.get('/admin/transactions', verifyJWT, checkRole('admin'), getFilteredTransactions)

module.exports = router
