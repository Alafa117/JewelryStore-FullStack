// frontend/src/api/auth.js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

class ApiError extends Error {
    constructor(message, status = 500, details = null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

async function request(path, options = {}) {
    const res = await fetch(BASE + path, options)
    const text = await res.text().catch(() => '')
    const data = text ? JSON.parse(text) : {}

    if (!res.ok) {
        // Si el backend envía validaciones, data.errors será un array
        if (data && data.errors) {
            throw new ApiError(data.message || 'Validation failed', res.status, data.errors)
        }
        throw new ApiError(data.message || `Request failed: ${res.status}`, res.status, data)
    }
    return data
}

export function signup(payload) {
    return request('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}

export function login(payload) {
    return request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}

export { ApiError }
