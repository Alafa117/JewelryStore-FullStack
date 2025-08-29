// middleware/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
    console.error('[errorHandler]', err)
    const status = err.status || 500
    res.status(status).json({ message: err.message || 'Internal server error' })
}
