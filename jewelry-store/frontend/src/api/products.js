// frontend/src/api/products.js
import { logDebug, logError } from '../utils/logger'
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export async function createProduct(payload, token) {
    try {
        const res = await fetch(`${BASE}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.message || `Request failed ${res.status}`)
        logDebug('[api.createProduct] success', data)
        return data
    } catch (err) {
        logError('[api.createProduct] error', { error: err?.message })
        throw err
    }
}
