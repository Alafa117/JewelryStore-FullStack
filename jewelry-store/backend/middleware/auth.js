// backend/middleware/auth.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

async function verifyToken(req, res, next) {
    try {
        const auth = req.headers.authorization
        if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' })
        const token = auth.split(' ')[1]
        const payload = jwt.verify(token, JWT_SECRET)
        // attach minimal user info
        req.user = { id: payload.id, role: payload.role, email: payload.email }
        // optional: hydrate user from DB if you need more fields
        // req.userDoc = await User.findById(payload.id).select('-password')
        next()
    } catch (err) {
        console.error('[auth.verifyToken] error', err.message)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

/**
 * Comprobar que quien haga la acción sea el OWNER del recurso o admin.
 * - product: la entidad a comprobar (debe haberse cargado previamente)
 * - usa req.user.id y req.user.role
 */
function isOwnerOrAdmin(req, res, next) {
    const product = req.product // controller debe setear req.product con el documento
    if (!product) return res.status(500).json({ message: 'Internal: product not loaded for ownership check' })

    const ownerId = (product.seller && product.seller.toString && product.seller.toString()) || product.seller
    const requesterId = req.user && req.user.id

    if (req.user.role === 'Admin' || ownerId === requesterId) {
        return next()
    }
    return res.status(403).json({ message: 'Forbidden: not owner or admin' })
}

module.exports = { verifyToken, isOwnerOrAdmin }
