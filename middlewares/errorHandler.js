const Log = require('../models/Logs')

module.exports = async function errorHandler(err, req, res, next) {
    console.error(err.stack)

    // Log the error to DB
    await Log.create({
        level: 'error',
        message: err.message,
        context: {
            route: req.originalUrl,
            method: req.method,
            user: req.user ? req.user._id : null
        },
        stackTrace: err.stack
    })

    res.status(500).json({ error: 'An internal server error occurred.' })
}