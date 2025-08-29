// controllers/authController.js
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

/**
 * POST /api/auth/signup
 * Body: { firstName, lastName, email, password, role }
 */
exports.signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body
        console.debug('[auth.signup] payload', { email, role })

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)

        const user = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
            role: role || 'User'
        })

        await user.save()
        console.log('[auth.signup] user created', user._id)

        // No devolver password
        const payload = { id: user._id, email: user.email, role: user.role }
        const token = generateToken(payload)

        res.status(201).json({
            message: 'User created',
            user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
            token
        })
    } catch (err) {
        console.error('[auth.signup] error', err)
        next(err)
    }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        console.debug('[auth.login] payload', { email })

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' })
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

        const payload = { id: user._id, email: user.email, role: user.role }
        const token = generateToken(payload)

        console.log('[auth.login] success', user._id)
        res.json({
            message: 'Login success',
            token,
            user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }
        })
    } catch (err) {
        console.error('[auth.login] error', err)
        next(err)
    }
}
