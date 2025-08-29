// middleware/authMiddleware.js
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
        const decoded = jwt.verify(token, secret)
        // attach user basic info to request (no password)
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role }
        // si quieres recuperar desde DB (opcional):
        // req.userDoc = await User.findById(decoded.id).select('-password')
        next()
    } catch (err) {
        console.error('[authMiddleware] error', err)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}
