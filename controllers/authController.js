const User = require('../models/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { sendToken } = require('../utils/authUtils')

const register = async (req, res) => {
    const { name, email, phone, password, referrerCode } = req.body

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    try {
        const myReferralCode = await generateUniqueReferralCode()

        const phoneExists = await checkPhone(phone)
        if (phoneExists) {
            return res.status(409).json({ message: "Phone number already in use" })
        }

        const emailExists = await checkEmail(email)
        if (emailExists) {
            return res.status(409).json({ message: "Email number already in use" })
        }

        const hashed = await bcrypt.hash(password, 12)
        // const myReferralCode = phone
        const user = await User.create({ name, email, phone, password: hashed, referrerCode, myReferralCode })
        sendToken(user, res)
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ message: 'Invalid credentials' })

        sendToken(user, res)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

const profile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
}

const checkPhone = async (phone) => {
    if (!phone) return false

    const existingUserPhone = await User.findOne({ phone })
    return !!existingUserPhone
}

const checkEmail = async (email) => {
    if (!email) return false

    const existingUserEmail = await User.findOne({ email })
    if (existingUserEmail) {
        return !!existingUserEmail
    }
}

const generateUniqueReferralCode = async () => {
    let code
    let isUnique = false

    while (!isUnique) {
        code = crypto.randomBytes(4).toString('hex') // e.g., 'a9f1d3c2'
        const existing = await User.findOne({ myReferralCode: code })
        if (!existing) isUnique = true
    }

    return code
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params

        // Only allow if logged-in user matches the ID in the param
        if (req.user.id !== id) {
            return res.status(403).json({ message: "Unauthorized to update this user." })
        }

        const { name, phone, email } = req.body

        if (!name || !phone || !email) {
            return res.status(400).json({ message: "All fields are required." })
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phone, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." })
        }

        sendToken(updatedUser, res)
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message })
    }
}



module.exports = {
    register,
    login,
    profile,
    updateUser
}