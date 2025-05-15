const jwt = require('jsonwebtoken')

const generateToken = user => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

const sendToken = (user, res) => {
    const token = generateToken(user)

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ success: true, user })
}

module.exports = {
    generateToken,
    sendToken
}