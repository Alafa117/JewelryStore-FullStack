// src/pages/Login.jsx
import React, { useState } from 'react'
import { login } from '../api/auth'
import useAuth from '../store/auth'
import Spinner from '../components/Spinner'
import '../styles/components/forms.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setSession } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            console.debug('[Login] send', { email })
            const res = await login({ email, password })
            console.debug('[Login] res', res)
            setSession(res.token, res.user)
            alert('Inicio de sesión exitoso')
        } catch (err) {
            console.error('[Login] error', err)
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2 className="form-title">Iniciar Sesión</h2>
            {error && <div className="form-error">{error}</div>}

            <label className="form-field">
                <span>Email</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>

            <label className="form-field">
                <span>Contraseña</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>

            <button className="form-btn" type="submit" disabled={loading}>
                {loading ? <Spinner /> : 'Ingresar'}
            </button>
        </form>
    )
}
