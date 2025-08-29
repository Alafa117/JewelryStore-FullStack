// index.js
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(helmet())
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*' // en producción fijar dominio
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Rate limiter (protege endpoints públicos)
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 60, // límite por IP
    message: { message: 'Too many requests, please try again later.' }
})
app.use(limiter)

// Rutas
app.use('/api/auth', authRoutes)

// Healthcheck
app.get('/healthz', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

// Error middleware (final)
app.use(errorHandler)

// Start server after DB connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`[index] Server running on port ${PORT} (env=${process.env.NODE_ENV || 'dev'})`)
        })
    })
    .catch(err => {
        console.error('[index] Failed to start due DB connection error', err)
        process.exit(1)
    })
