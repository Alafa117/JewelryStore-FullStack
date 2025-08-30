// frontend/src/components/EditProductModal.jsx
import React, { useState } from 'react'
import { updateProduct } from '../api/products'
import useAuth from '../store/auth'
import '../styles/components/forms.css'

/**
 * Modal con formulario para editar un producto existente.
 * Llama a PUT /api/products/:id y devuelve el producto actualizado en onClose(true).
 */
export default function EditProductModal({ product, onClose }) {
    const { token } = useAuth()
    const [form, setForm] = useState({
        name: product.name || '',
        category: product.category || '',
        material: product.material || '',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock ?? 0
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    function onChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            console.debug('[EditProductModal] updating', product._id ?? product.id, form)
            await updateProduct(product._id ?? product.id, form, token)
            setLoading(false)
            alert('Producto actualizado')
            if (onClose) onClose(true)
        } catch (err) {
            console.error('[EditProductModal] update error', err)
            setError(err.message || 'No se pudo actualizar el producto')
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose && onClose(false) }}>
            <div className="modal-card">
                <header className="modal-header">
                    <h3>Editar producto</h3>
                    <button className="icon-btn" onClick={() => onClose && onClose(false)}>Cerrar</button>
                </header>

                <div className="modal-body">
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {error && <div className="form-error">{error}</div>}

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
                                <input name="price" value={form.price} onChange={onChange} required />
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

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="form-btn" type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar cambios'}</button>
                            <button type="button" className="icon-btn small" onClick={() => onClose && onClose(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
