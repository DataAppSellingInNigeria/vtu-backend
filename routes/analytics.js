const express = require('express')
const router = express.Router()
const {
    getDailyTransactions,
    revenuePerDay,
    topUsedServices,
    dailyUserRegistrations
} = require('../controllers/analyticsController')

// Protect with admin middleware if needed
router.get('/transactions/daily', getDailyTransactions)
router.get('/transactions/daily-revenue', revenuePerDay)
router.get('/services/top-used', topUsedServices)
router.get('/users/registrations/daily', dailyUserRegistrations)

module.exports = router