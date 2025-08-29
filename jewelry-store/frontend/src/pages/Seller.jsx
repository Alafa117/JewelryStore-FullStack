// src/pages/Seller.jsx
import React, { useState } from 'react'
import useAuth from '../store/auth'
import { createProduct } from '../api/products'
import '../styles/components/forms.css'

export default function Seller() {
    const { token, user } = useAuth()
    const [form, setForm] = useState({
        name: '',
        category: '',
        material: '',
        price: '',
        description: '',
        stock: 1
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    function onChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSuccessMsg(null)

        // validación simple en frontend
        if (!form.name.trim() || !form.category.trim() || !form.price) {
            setError('Por favor completa: nombre, categoría y precio.')
            return
        }

        const payload = {
            name: form.name.trim(),
            category: form.category.trim(),
            material: form.material.trim(),
            price: Number(form.price),
            description: form.description.trim(),
            stock: Number(form.stock),
        }

        setLoading(true)
        try {
            const res = await createProduct(payload, token)
            setSuccessMsg('Producto creado correctamente.')
            console.debug('[Seller] created product', res.product)
            // limpiar
            setForm({ name: '', category: '', material: '', price: '', description: '', stock: 1 })
        } catch (err) {
            console.error('[Seller] create error', err)
            setError(err?.message || 'No se pudo crear el producto.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section style={{ maxWidth: 920, margin: '20px auto', padding: 16 }}>
            <h2>Panel de Vendedor</h2>
            <div style={{ color: 'var(--muted)', marginBottom: 12 }}>
                Usuario: <strong>{user?.email}</strong> · Rol: <strong>{user?.role}</strong>
            </div>

            <form className="form" onSubmit={handleSubmit} noValidate>
                {error && <div className="form-error">{error}</div>}
                {successMsg && <div style={{ background: '#f0fff7', color: '#136', padding: 8, borderRadius: 8 }}>{successMsg}</div>}

                <label className="form-field">
                    <span>Nombre del producto</span>
                    <input name="name" value={form.name} onChange={onChange} required />
                </label>

                <label className="form-field">
                    <span>Categoría</span>
                    <input name="category" value={form.category} onChange={onChange} placeholder="Anillos / Collares / Pendientes" required />
                </label>

                <label className="form-field">
                    <span>Material</span>
                    <input name="material" value={form.material} onChange={onChange} placeholder="Plata, Oro, Bronce..." />
                </label>

                <div className="two-col">
                    <label className="form-field">
                        <span>Precio (número)</span>
                        <input name="price" value={form.price} onChange={onChange} required />
                    </label>

                    <label className="form-field">
                        <span>Stock</span>
                        <input name="stock" value={form.stock} onChange={onChange} />
                    </label>
                </div>

                <label className="form-field">
                    <span>Descripción</span>
                    <textarea name="description" value={form.description} onChange={onChange} rows={4} />
                </label>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="form-btn" type="submit" disabled={loading}>{loading ? 'Creando…' : 'Crear producto'}</button>
                </div>
            </form>
        </section>
    )
}
