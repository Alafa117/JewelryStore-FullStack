// src/components/ProductModal.jsx
import React from 'react'
import useCart from '../store/cart'
import useLikes from '../store/likes'
import { IconLike, IconDislike, IconHeart } from './icons.jsx'
import '../styles/pages/products.css'

export default function ProductModal({ product, isOpen, onClose }) {
    const { addItem } = useCart()
    const { getItem, toggleLike, toggleDislike, toggleMeGusta } = useLikes()

    if (!isOpen || !product) return null

    const state = getItem(product.id)

    function handleAdd() {
        try {
            addItem({ id: product.id, name: product.name, meta: product.meta, price: product.price })
            console.debug('[ProductModal] addItem', product.id)
            // feedback ligero y cierre opcional
            alert(`${product.name} agregado a tu lista`)
        } catch (err) {
            console.error('[ProductModal] addItem error', err)
            alert('No se pudo agregar el producto. Revisa la consola.')
        }
    }

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${product.name}`}
            onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose() }}
        >
            <div className="modal-card">
                <header className="modal-header">
                    <h3>{product.name}</h3>
                    <button className="icon-btn" onClick={onClose} aria-label="Cerrar">Cerrar</button>
                </header>

                <div className="modal-body">
                    <div className="modal-img" aria-hidden="true" />

                    <div className="modal-info">
                        <div style={{ color: 'var(--muted)', marginBottom: 8 }}>{product.meta}</div>
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>₡{product.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                        <p style={{ color: 'var(--muted)', marginBottom: 12 }}>{product.description || 'Descripción no disponible.'}</p>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                                className={`react-btn ${state?.liked ? 'active' : ''}`}
                                aria-pressed={!!state?.liked}
                                aria-label="Like"
                                onClick={() => { try { toggleLike(product.id) } catch (err) { console.error('[ProductModal] toggleLike', err) } }}
                            >
                                <IconLike />
                            </button>

                            <button
                                className={`react-btn ${state?.disliked ? 'active' : ''}`}
                                aria-pressed={!!state?.disliked}
                                aria-label="Dislike"
                                onClick={() => { try { toggleDislike(product.id) } catch (err) { console.error('[ProductModal] toggleDislike', err) } }}
                            >
                                <IconDislike />
                            </button>

                            <button
                                className={`react-btn ${state?.megusta ? 'active' : ''}`}
                                aria-pressed={!!state?.megusta}
                                aria-label="Me gusta"
                                onClick={() => { try { toggleMeGusta(product.id) } catch (err) { console.error('[ProductModal] toggleMeGusta', err) } }}
                            >
                                <IconHeart />
                            </button>

                            <button className="icon-btn" onClick={handleAdd}>Agregar a Lista</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
