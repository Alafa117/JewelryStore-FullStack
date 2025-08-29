// backend/middleware/roleMiddleware.js
/**
 * requireRole(...roles) -> middleware
 * Uso: router.post('/', authMiddleware, requireRole('Seller','Admin'), controller.create)
 */
module.exports = function requireRole(...roles) {
    return (req, res, next) => {
        try {
            const user = req.user
            if (!user || !user.role) {
                return res.status(403).json({ message: 'Acceso denegado (sin rol)' })
            }
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Acceso denegado (rol insuficiente)' })
            }
            next()
        } catch (err) {
            console.error('[roleMiddleware] error', err)
            return res.status(500).json({ message: 'Server error en role check' })
        }
    }
}
