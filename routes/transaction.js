const express = require('express')
const { verifyJWT, checkRole } = require('../middlewares/auth')
const { getUserTransactions, getFilteredTransactions, getAllUsers, getAllTransactions } = require('../controllers/transactionController')

const router = express.Router()

router.get('/', verifyJWT, getUserTransactions)
router.get('/admin/users', verifyJWT, checkRole('admin'), getAllUsers)
router.get('/admin/transactions/all', verifyJWT, checkRole('admin'), getAllTransactions)
router.get('/admin/transactions', verifyJWT, checkRole('admin'), getFilteredTransactions)

module.exports = router
