// src/components/RoleProtected.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../store/auth'

/**
 * <RoleProtected roles={['Seller','Admin']}>...</RoleProtected>
 * Si no está autenticado -> redirige a /login
 * Si está autenticado pero rol no permitido -> muestra mensaje de acceso denegado
 */
export default function RoleProtected({ roles = [], children }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated()) {
        // usuario no autenticado -> ir a login
        return <Navigate to="/login" replace />
    }

    if (!user || !roles.includes(user.role)) {
        // usuario autenticado pero rol no autorizado
        return (
            <div style={{ padding: 24, maxWidth: 680, margin: '36px auto', textAlign: 'center' }}>
                <h3 style={{ marginBottom: 8 }}>Acceso denegado</h3>
                <p style={{ color: 'var(--muted)' }}>
                    No tienes permiso para acceder a esta página. Tu rol actual es: <strong>{user?.role || '—'}</strong>
                </p>
                <p style={{ marginTop: 12 }}>
                    Si crees que deberías tener acceso, contacta al administrador o inicia sesión con una cuenta Seller/Admin.
                </p>
            </div>
        )
    }

    return children
}
