// src/api/products.js
import { logDebug, logError } from '../utils/logger'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

/**
 * GET /api/products
 * Optional query: ?category=Anillos&material=Plata&q=texto
 */
export async function getProducts(params = {}) {
    try {
        const qs = new URLSearchParams()
        Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null) return
            if (Array.isArray(v)) qs.set(k, v.join(','))
            else qs.set(k, String(v))
        })
        const url = `${BASE}/api/products${qs.toString() ? `?${qs.toString()}` : ''}`
        logDebug('[api.getProducts] fetching', { url })
        const res = await fetch(url)
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
            const msg = data.message || `GET /api/products failed: ${res.status}`
            throw new Error(msg)
        }
        // If your backend returns { products: [...] } or { ok, products }, handle both
        const products = data.products ?? data
        logDebug('[api.getProducts] got', { count: Array.isArray(products) ? products.length : 'unknown' })
        return products
    } catch (err) {
        logError('[api.getProducts] error', { error: err?.message })
        throw err
    }
}

/**
 * POST /api/products
 * Creates a product (used by Seller panel). token optional if endpoint requires auth.
 */
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
        if (!res.ok) throw new Error(data.message || `POST /api/products failed: ${res.status}`)
        logDebug('[api.createProduct] success', data)
        return data
    } catch (err) {
        logError('[api.createProduct] error', { error: err?.message })
        throw err
    }
}
