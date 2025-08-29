// src/pages/Anillos.jsx
import React, { useState } from 'react'
import useCart from '../store/cart'
import useLikes from '../store/likes'
import { IconLike, IconDislike, IconHeart } from '../components/icons.jsx'
import ProductModal from '../components/ProductModal.jsx'
import '../styles/pages/products.css'

const SAMPLE = [
    { id: 'ring-1', name: 'Anillo Clásico Oro', meta: 'Oro 14K • Tallas 10-14', price: '₡120.000', description: 'Anillo clásico con diseño atemporal.' },
    { id: 'ring-2', name: 'Anillo Solitario', meta: 'Plata 925 • Piedras Zafiro', price: '₡240.000', description: 'Solitario con piedra principal y acabado pulido.' },
    { id: 'ring-3', name: 'Anillo Vintage', meta: 'Bronce pulido • Ed. limitada', price: '₡85.000', description: 'Diseño vintage para coleccionistas.' },
]

export default function Anillos() {
    const { addItem } = useCart()
    const { getItem, toggleLike, toggleDislike, toggleMeGusta } = useLikes()
    const [selected, setSelected] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    function openModal(p) { setSelected(p); setIsOpen(true) }
    function closeModal() { setIsOpen(false); setSelected(null) }

    return (
        <section className="products-page">
            <h2 style={{ marginBottom: 8 }}>Anillos</h2>
            <p style={{ color: 'var(--muted)' }}>Explora nuestra selección de anillos.</p>

            <div className="products-grid">
                {SAMPLE.map(p => {
                    const st = getItem(p.id)
                    return (
                        <article
                            className="product-card"
                            key={p.id}
                            onClick={(e) => { const tag = e.target.tagName.toLowerCase(); if (tag === 'button' || tag === 'svg' || tag === 'path') return; openModal(p) }}
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
}
