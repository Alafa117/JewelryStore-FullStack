// backend/config/db.js
const mongoose = require('mongoose')

/**
 * connectDB - conecta a MongoDB usando MONGODB_URI en .env
 * - Si defines MONGODB_DB en .env, se forzará ese dbName (útil para forzar "jewelry")
 * - No se pasan opciones deprecadas como useNewUrlParser/useUnifiedTopology
 */
module.exports = async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI
        if (!uri) throw new Error('MONGODB_URI not defined in env')

        const dbName = process.env.MONGODB_DB || undefined

        // imprimir URI parcialmente redacted para debug (no exponer credenciales)
        try {
            const redacted = uri.replace(/\/\/(.*)@/, '//<redacted>@')
            console.log(`[db] attempting connection to: ${redacted}${dbName ? ` (dbName=${dbName})` : ''}`)
        } catch (e) {
            console.log('[db] attempting connection (uri hidden)')
        }

        // Opciones: si se definió dbName lo añadimos a opts
        const opts = {}
        if (dbName) opts.dbName = dbName

        // conectar; mongoose usará sus opciones por defecto modernas
        await mongoose.connect(uri, opts)

        const active = mongoose.connection?.db?.databaseName || dbName || 'unknown'
        console.log(`[db] Connected to MongoDB — database: ${active}`)
    } catch (err) {
        console.error('[db] Connection error', err)
        // relanzamos para que index.js no arranque el servidor
        throw err
    }
}
