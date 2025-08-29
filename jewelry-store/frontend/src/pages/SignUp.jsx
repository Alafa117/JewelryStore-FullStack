// frontend/src/pages/SignUp.jsx
import React, { useState } from 'react'
import { signup, ApiError } from '../api/auth'
import '../styles/components/forms.css'

export default function SignUp() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'User' })
    const [errorGlobal, setErrorGlobal] = useState(null)
    const [fieldErrors, setFieldErrors] = useState([]) // array de { msg, param, location }
    const [loading, setLoading] = useState(false)

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErrorGlobal(null)
        setFieldErrors([])
        setLoading(true)
        try {
            const res = await signup(form)
            console.debug('[SignUp] response', res)
            alert('Cuenta creada correctamente')
            // opcional: redirigir a login
            // navigate('/login')
        } catch (err) {
            console.error('[SignUp] error', err)
            if (err && err.name === 'ApiError' && err.details && Array.isArray(err.details)) {
                // mostrar errores de validación por campo
                setFieldErrors(err.details)
                setErrorGlobal(err.message || 'Validation failed')
            } else {
                setErrorGlobal(err.message || 'Error al crear la cuenta')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Crear Cuenta</h2>

            {errorGlobal && <div className="form-error">{errorGlobal}</div>}

            {fieldErrors.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                    <strong>Errores:</strong>
                    <ul style={{ margin: '6px 0 0 16px', color: '#b22' }}>
                        {fieldErrors.map((err, i) => (
                            <li key={i}>{err.param ? `${err.param}: ` : ''}{err.msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="two-col">
                <label className="form-field">
                    <span>Nombres</span>
                    <input name="firstName" value={form.firstName} onChange={onChange} required />
                </label>

                <label className="form-field">
                    <span>Apellidos</span>
                    <input name="lastName" value={form.lastName} onChange={onChange} required />
                </label>
            </div>

            <label className="form-field">
                <span>Email</span>
                <input name="email" type="email" value={form.email} onChange={onChange} required />
            </label>

            <label className="form-field">
                <span>Contraseña</span>
                <input name="password" type="password" value={form.password} onChange={onChange} required />
            </label>

            <label className="form-field">
                <span>Rol</span>
                <select name="role" value={form.role} onChange={onChange}>
                    <option value="User">User</option>
                    <option value="Seller">Seller</option>
                    <option value="Admin">Admin</option>
                </select>
            </label>

            <button className="form-btn" type="submit" disabled={loading}>
                {loading ? 'Creando…' : 'Registrar'}
            </button>
        </form>
    )
}
