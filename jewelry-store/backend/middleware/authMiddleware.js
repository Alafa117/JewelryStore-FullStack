// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing' })
        }
        const token = authHeader.split(' ')[1]
        const secret = process.env.JWT_SECRET || 'dev-secret'

        let decoded
        try {
            decoded = jwt.verify(token, secret)
        } catch (err) {
            console.error('[authMiddleware] token verify failed', err?.message)
            return res.status(401).json({ message: 'Token inválido o expirado' })
        }

        // attach minimal info
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role }

        // opcional: puedes también recuperar el user doc (sin password)
        // const userDoc = await User.findById(decoded.id).select('-password')
        // req.userDoc = userDoc

        next()
    } catch (err) {
        console.error('[authMiddleware] error', err)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}
