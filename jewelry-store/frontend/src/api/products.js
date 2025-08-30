// frontend/src/api/products.js
import { logDebug, logError } from '../utils/logger'
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

async function request(path, options = {}) {
    try {
        logDebug('[API.products] request', { url: BASE + path, method: options.method })
        const res = await fetch(BASE + path, options)
        const text = await res.text().catch(() => '')
        const data = text ? JSON.parse(text) : {}
        if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`)
        return data
    } catch (err) {
        logError('[API.products] request error', { path, error: err?.message })
        throw err
    }
}

/* Public: obtener productos (todo) */
export async function getProducts() {
    return request('/api/products', { method: 'GET' })
}

/* Obtener productos del seller actual:
   - se asume endpoint /api/products/mine (proteger con token) o fallback a query sellerId
*/
export async function getSellerProducts(token, sellerId) {
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    // preferimos endpoint protegido
    try {
        return await request('/api/products/mine', { method: 'GET', headers })
    } catch (err) {
        // fallback: intentar query por sellerId
        if (sellerId) {
            return request(`/api/products?sellerId=${encodeURIComponent(sellerId)}`, { method: 'GET' })
        }
        throw err
    }
}

/* Crear producto (ya existente en tu proyecto) */
export async function createProduct(payload, token) {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return request('/api/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
}

/* Actualizar producto */
export async function updateProduct(productId, payload, token) {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return request(`/api/products/${encodeURIComponent(productId)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
    })
}

/* Eliminar producto */
export async function deleteProduct(productId, token) {
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    return request(`/api/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers
    })
}
