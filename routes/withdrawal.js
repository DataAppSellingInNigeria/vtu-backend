const express = require('express')
const router = express.Router()
const {
    requestWithdrawal,
    processWithdrawal,
    getAllWithdrawals,
    getMyWithdrawals
} = require('../controllers/withdrawalController')
const { verifyJWT, checkRole } = require('../middlewares/auth')

// User routes
router.post('/', verifyJWT, requestWithdrawal)
router.get('/me', verifyJWT, getMyWithdrawals)

// Admin routes
router.get('/', verifyJWT, checkRole('admin'), getAllWithdrawals)
router.put('/:id', verifyJWT, checkRole('admin'), processWithdrawal)

module.exports = router