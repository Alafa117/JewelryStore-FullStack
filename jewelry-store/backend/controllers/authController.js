// backend/controllers/authController.js
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

        // Nota: validaciones principales ya se hicieron en routes via express-validator

        const existing = await User.findOne({ email: email.toLowerCase().trim() })
        if (existing) {
            return res.status(409).json({ message: 'Email ya registrado' })
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

        const payload = { id: user._id, email: user.email, role: user.role }
        const token = generateToken(payload)

        res.status(201).json({
            message: 'Usuario creado',
            user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
            token
        })
    } catch (err) {
        console.error('[auth.signup] error', err)
        // si error es de validación de mongoose, lo devolvemos con status 400 y detalles
        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(k => ({ param: k, msg: err.errors[k].message }))
            return res.status(400).json({ message: 'Validation failed', errors })
        }
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

        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' })

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

/**
 * GET /api/auth/test
 * Protected route - authMiddleware sets req.user
 */
exports.test = async (req, res, next) => {
    try {
        // authMiddleware ya puso req.user = { id, email, role }
        const basic = req.user || {}
        // opcional: recuperar el documento real (sin password)
        let userDoc = null
        try {
            userDoc = await User.findById(basic.id).select('-password -__v')
        } catch (e) {
            // si falla la búsqueda, devolvemos info básica del token
            console.warn('[auth.test] user lookup failed', e?.message)
        }

        return res.json({
            ok: true,
            message: 'Token válido',
            user: userDoc || basic
        })
    } catch (err) {
        console.error('[auth.test] error', err)
        next(err)
    }
}
