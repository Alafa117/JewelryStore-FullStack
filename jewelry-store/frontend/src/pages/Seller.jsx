// frontend/src/pages/Seller.jsx
import React, { useState } from 'react'
import useAuth from '../store/auth'
import CreateProductForm from '../components/CreateProductForm' // si ya tienes el Create original, apunta a él
import SellerProducts from '../components/SellerProducts'
import '../styles/components/forms.css'

/**
 * Seller panel con selector simple:
 * - Crear Producto
 * - Editar y Eliminar Producto (solo los del seller)
 *
 * Este archivo actúa como router de la UI del vendedor.
 */
export default function Seller() {
    const { user } = useAuth()
    const [tab, setTab] = useState('create') // 'create' | 'manage'

    if (!user || user.role !== 'Seller') {
        return (
            <section style={{ maxWidth: 920, margin: '24px auto', padding: 16 }}>
                <h2>Panel de Vendedor</h2>
                <div style={{ color: 'var(--muted)', marginTop: 12 }}>
                    Acceso restringido: necesitas iniciar sesión como <strong>Seller</strong>.
                </div>
            </section>
        )
    }

    return (
        <section style={{ maxWidth: 1000, margin: '20px auto', padding: 16 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                    <h2>Panel de Vendedor</h2>
                    <div style={{ color: 'var(--muted)', marginTop: 6 }}>
                        Bienvenido, <strong>{user.firstName || user.email}</strong> · Rol: <strong>{user.role}</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        className={`icon-btn small ${tab === 'create' ? 'active' : ''}`}
                        onClick={() => setTab('create')}
                        aria-pressed={tab === 'create'}
                    >
                        Crear Producto
                    </button>

                    <button
                        className={`icon-btn small ${tab === 'manage' ? 'active' : ''}`}
                        onClick={() => setTab('manage')}
                        aria-pressed={tab === 'manage'}
                    >
                        Editar / Eliminar Productos
                    </button>
                </div>
            </header>

            <div>
                {tab === 'create' && (
                    <div>
                        <CreateProductForm />
                    </div>
                )}

                {tab === 'manage' && (
                    <div>
                        <SellerProducts />
                    </div>
                )}
            </div>
        </section>
    )
}
