// src/components/CartMenu.jsx
import React from 'react'
import useCart from '../store/cart'
import '../styles/components/cart.css'

export default function CartMenu({ onClose }) {
    const { items, removeItem, clear } = useCart()

    return (
        <div className="dropdown" role="dialog" aria-label="Cart menu">
            <div style={{ fontWeight: 700 }}>Tu Lista</div>
            <div className="muted" style={{ marginBottom: 8 }}>{items.length} artículos</div>

            {items.length === 0 && <div className="muted">Aún no agregas artículos</div>}

            <ul style={{ listStyle: 'none', padding: 0, margin: 8 }}>
                {items.map(it => (
                    <li key={it.id} style={{ padding: '8px 0', borderBottom: '1px dashed rgba(11,11,11,0.04)' }}>
                        <div style={{ fontWeight: 700 }}>{it.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{it.meta || ''}</div>
                        <div style={{ marginTop: 6 }}>
                            <button className="icon-btn" onClick={() => removeItem(it.id)} style={{ padding: '6px 8px' }}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>

            {items.length > 0 && (
                <>
                    <button className="icon-btn" onClick={() => { clear(); if (onClose) onClose() }} style={{ width: '100%', marginTop: 8 }}>
                        Vaciar lista
                    </button>
                </>
            )}
        </div>
    )
}
