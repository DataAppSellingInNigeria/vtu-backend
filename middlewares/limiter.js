const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Try again in a minute.',
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
    loginLimiter
}