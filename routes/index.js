const router = require('express').Router()
const userModel = require('../models/User')

router.get('/', (req, res) => {
    res.json({ message: 'VTU API Ready' })
});

module.exports = router
