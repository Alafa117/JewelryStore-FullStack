// backend/index.js
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products') // <- nuevo
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 80 })
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes) // <- montar productos

app.get('/healthz', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

app.use(errorHandler)

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`[index] Server running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error('[index] Failed to start due DB connection error', err)
        process.exit(1)
    })
