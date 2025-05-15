const express = require('express')
const router = express.Router()
const {
    register,
    login,
    profile,
    updateUser
} = require('../controllers/authController')
const { verifyJWT } = require('../middlewares/auth')
const { loginLimiter } = require('../middlewares/limiter')
const multer = require('multer')

const upload = multer() // Multer for form-data without files

router.post('/register', upload.none(), register)
router.post('/login', loginLimiter, login)
router.get('/profile', verifyJWT, profile)
router.put('/users/:id', verifyJWT, updateUser)

module.exports = router;
