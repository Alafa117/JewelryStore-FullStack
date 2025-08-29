// backend/config/db.js
const mongoose = require('mongoose')

/**
 * connectDB - conecta a MongoDB Atlas usando MONGODB_URI en .env
 * Usa la opción dbName si está presente en env (por ejemplo 'jewelry')
 */
module.exports = async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI
        if (!uri) throw new Error('MONGODB_URI not defined in env')

        const dbName = process.env.MONGODB_DB || undefined

        try {
            const redacted = uri.replace(/\/\/(.*)@/, '//<redacted>@')
            console.log(`[db] attempting connection to: ${redacted}${dbName ? ` (dbName=${dbName})` : ''}`)
        } catch (e) {
            console.log('[db] attempting connection (uri hidden)')
        }

        // conecta; dbName es la forma segura de forzar la DB al usar una URI genérica
        const opts = {}
        if (dbName) opts.dbName = dbName

        await mongoose.connect(uri, opts)

        // imprime la bd activa
        const active = mongoose.connection?.db?.databaseName || dbName || 'unknown'
        console.log(`[db] Connected to MongoDB — database: ${active}`)
    } catch (err) {
        console.error('[db] Connection error', err)
        throw err
    }
}
