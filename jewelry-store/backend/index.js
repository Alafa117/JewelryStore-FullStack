// backend/index.js
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products') // rutas de productos (crea/editar/eliminar)
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares de seguridad y parsing
app.use(helmet())
app.use(express.json())

// CORS: permite origen desde env o cualquier origen en desarrollo
const corsOrigin = process.env.CORS_ORIGIN || '*'
app.use(cors({ origin: corsOrigin }))

// Logger HTTP
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Rate limiter básico (ajustable)
const limiter = rateLimit({
    windowMs: Number(process.env.RATE_WINDOW_MS || 60 * 1000), // 1 minuto por defecto
    max: Number(process.env.RATE_MAX || 80), // peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false
})
app.use(limiter)

// Rutas públicas / API
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes) // monta rutas de productos

// Healthcheck
app.get('/healthz', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

// Handler de errores al final
app.use(errorHandler)

// Start server after DB connection
connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`[index] Server running on port ${PORT} (env=${process.env.NODE_ENV || 'dev'})`)
        })

        // Graceful shutdown
        const shutdown = (signal) => {
            console.log(`[index] Received ${signal} — closing server`)
            server.close(() => {
                console.log('[index] HTTP server closed')
                // cerrar conexión mongoose
                const mongoose = require('mongoose')
                mongoose.connection.close(false, () => {
                    console.log('[index] MongoDB connection closed')
                    process.exit(0)
                })
            })

            // Force exit si tarda demasiado
            setTimeout(() => {
                console.error('[index] Forcing shutdown')
                process.exit(1)
            }, 10_000)
        }

        process.on('SIGINT', () => shutdown('SIGINT'))
        process.on('SIGTERM', () => shutdown('SIGTERM'))
    })
    .catch(err => {
        console.error('[index] Failed to start due DB connection error', err)
        process.exit(1)
    })
