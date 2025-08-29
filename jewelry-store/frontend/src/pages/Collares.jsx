// src/pages/Collares.jsx
import React, { useState } from 'react'
import useCart from '../store/cart'
import useLikes from '../store/likes'
import { IconLike, IconDislike, IconHeart } from '../components/icons.jsx'
import ProductModal from '../components/ProductModal.jsx'
import '../styles/pages/products.css'

const SAMPLE = [
    { id: 'neck-1', name: 'Collar Minimal', meta: 'Plata 925 • Cadena 45cm', price: '₡90.000', description: 'Collar sencillo y elegante.' },
    { id: 'neck-2', name: 'Collar Perla', meta: 'Perla natural • Cierre baño plata', price: '₡180.000', description: 'Perlas naturales seleccionadas.' },
    { id: 'neck-3', name: 'Collar Statement', meta: 'Aleación premium • Edición', price: '₡210.000', description: 'Collar llamativo para ocasión especial.' },
]

export default function Collares() {
    const { addItem } = useCart()
    const { getItem, toggleLike, toggleDislike, toggleMeGusta } = useLikes()
    const [selected, setSelected] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    function openModal(p) { setSelected(p); setIsOpen(true) }
    function closeModal() { setIsOpen(false); setSelected(null) }

    // protección adicional para evitar que errores silenciosos rompan la página
    try {
        return (
            <section className="products-page">
                <h2 style={{ marginBottom: 8 }}>Collares</h2>
                <p style={{ color: 'var(--muted)' }}>Collares para todas las ocasiones.</p>

                <div className="products-grid">
                    {SAMPLE.map(p => {
                        const st = getItem(p.id)
                        return (
                            <article
                                className="product-card"
                                key={p.id}
                                onClick={(e) => {
                                    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : ''
                                    if (tag === 'button' || tag === 'svg' || tag === 'path' || tag === 'a') return
                                    openModal(p)
                                }}
                            >
                                <div className="product-img" aria-hidden="true" />

                                <div style={{ marginTop: 10 }}>
                                    <div className="product-title">{p.name}</div>
                                    <div className="product-meta">{p.meta}</div>
                                    <div style={{ fontWeight: 700 }}>{p.price}</div>
                                </div>

                                <div className="product-actions" style={{ marginTop: 12 }}>
                                    <button
                                        className={`react-btn ${st?.liked ? 'active' : ''}`}
                                        onClick={(ev) => { ev.stopPropagation(); toggleLike(p.id) }}
                                        aria-pressed={!!st?.liked}
                                        aria-label="Like"
                                    >
                                        <IconLike />
                                    </button>

                                    <button
                                        className={`react-btn ${st?.disliked ? 'active' : ''}`}
                                        onClick={(ev) => { ev.stopPropagation(); toggleDislike(p.id) }}
                                        aria-pressed={!!st?.disliked}
                                        aria-label="Dislike"
                                    >
                                        <IconDislike />
                                    </button>

                                    <button
                                        className={`react-btn ${st?.megusta ? 'active' : ''}`}
                                        onClick={(ev) => { ev.stopPropagation(); toggleMeGusta(p.id) }}
                                        aria-pressed={!!st?.megusta}
                                        aria-label="Me gusta"
                                    >
                                        <IconHeart />
                                    </button>

                                    <button className="icon-btn small" onClick={(ev) => { ev.stopPropagation(); addItem({ id: p.id, name: p.name, meta: p.meta }); alert(`${p.name} agregado a tu lista`) }}>
                                        Agregar
                                    </button>

                                    <button className="icon-btn small" onClick={(ev) => { ev.stopPropagation(); openModal(p) }}>
                                        Ver
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>

                <ProductModal product={selected} isOpen={isOpen} onClose={closeModal} />
            </section>
        )
    } catch (err) {
        console.error('[Collares] render error', err)
        return (
            <section style={{ padding: 20 }}>
                <h2>Error al mostrar Collares</h2>
                <p style={{ color: 'var(--muted)' }}>Ocurrió un error al renderizar la página. Revisa la consola (Ctrl+Shift+J) y la terminal donde corre Vite.</p>
            </section>
        )
    }
}
