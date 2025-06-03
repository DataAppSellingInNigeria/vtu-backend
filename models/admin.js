const express = require('express')
const router = express.Router()
const { verifyAdmin } = require('../middlewares/authMiddleware')
const { getFilteredTransactions } = require('../controllers/adminController')

router.get('/transactions', verifyAdmin, getFilteredTransactions)

module.exports = router