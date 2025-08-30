// frontend/src/components/CreateProductForm.jsx
import React, { useState } from 'react'
import useAuth from '../store/auth'
import { createProduct } from '../api/products'
import '../styles/components/forms.css'

/**
 * CreateProductForm
 * - Formulario sencillo para Sellers crear productos.
 * - Usa createProduct(payload, token) desde src/api/products.js
 * - Opcional: recibe prop onCreated() para notificar al padre.
 */
export default function CreateProductForm({ onCreated } = {}) {
    const { token, user } = useAuth()
    const [form, setForm] = useState({
        name: '',
        category: 'Anillos',
        material: 'Plata',
        price: '',
        stock: 1,
        description: '',
        images: '' // comma-separated URLs
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    function onChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        setError(null)
        setSuccess(null)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        // validación mínima
        if (!form.name.trim()) return setError('Nombre requerido')
        if (!form.price || isNaN(Number(form.price))) return setError('Precio inválido')

        const payload = {
            name: form.name.trim(),
            category: form.category,
            material: form.material,
            price: Number(form.price),
            stock: Number(form.stock) || 0,
            description: form.description.trim(),
            // backend espera array de imágenes; convertimos si el usuario puso urls separadas por comas
            images: form.images
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
        }

        try {
            setLoading(true)
            console.debug('[CreateProductForm] creating product', { payload, seller: user?.id ?? user?._id })
            const res = await createProduct(payload, token)
            console.debug('[CreateProductForm] created', res)
            setSuccess('Producto creado correctamente')
            setForm({
                name: '',
                category: 'Anillos',
                material: 'Plata',
                price: '',
                stock: 1,
                description: '',
                images: ''
            })
            if (typeof onCreated === 'function') onCreated(res)
            // Emitimos un pequeño aviso para UX
            setTimeout(() => setSuccess(null), 2500)
        } catch (err) {
            console.error('[CreateProductForm] error creating product', err)
            setError(err?.message || 'No se pudo crear el producto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 760 }}>
            <h3 className="form-title">Crear Producto</h3>

            {error && <div className="form-error" role="alert">{error}</div>}
            {success && <div style={{ background: '#eef9f3', color: '#0a5a2a', padding: 8, borderRadius: 8, marginBottom: 8 }}>{success}</div>}

            <label className="form-field">
                <span>Nombre</span>
                <input name="name" value={form.name} onChange={onChange} required />
            </label>

            <div className="two-col">
                <label className="form-field">
                    <span>Categoría</span>
                    <select name="category" value={form.category} onChange={onChange}>
                        <option>Anillos</option>
                        <option>Collares</option>
                        <option>Pendientes</option>
                    </select>
                </label>

                <label className="form-field">
                    <span>Material</span>
                    <select name="material" value={form.material} onChange={onChange}>
                        <option>Bronce</option>
                        <option>Plata</option>
                        <option>Oro</option>
                    </select>
                </label>
            </div>

            <div className="two-col">
                <label className="form-field">
                    <span>Precio</span>
                    <input name="price" value={form.price} onChange={onChange} placeholder="Ej: 120000" required />
                </label>

                <label className="form-field">
                    <span>Stock</span>
                    <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} />
                </label>
            </div>

            <label className="form-field">
                <span>Descripción</span>
                <textarea name="description" rows="4" value={form.description} onChange={onChange} />
            </label>

            <label className="form-field">
                <span>Imágenes (URLs separadas por coma)</span>
                <input name="images" value={form.images} onChange={onChange} placeholder="https://... , https://..." />
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
                <button className="form-btn" type="submit" disabled={loading}>{loading ? 'Creando…' : 'Crear producto'}</button>
                <button type="button" className="icon-btn small" onClick={() => {
                    setForm({
                        name: '',
                        category: 'Anillos',
                        material: 'Plata',
                        price: '',
                        stock: 1,
                        description: '',
                        images: ''
                    })
                    setError(null)
                    setSuccess(null)
                }}>Limpiar</button>
            </div>
        </form>
    )
}
