// src/components/ProfileMenu.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'
import '../styles/components/profile.css'

export default function ProfileMenu({ onClose }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        if (onClose) onClose()
    }

    function goSeller() {
        if (onClose) onClose()
        navigate('/seller')
    }

    if (!user) return null

    return (
        <div className="dropdown" role="dialog" aria-label="Profile menu">
            <div style={{ fontWeight: 700 }}>{user.email}</div>
            <div className="muted">{user.role}</div>
            <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.firstName || ''} {user.lastName || ''}</div>
            </div>

            {/* Solo Seller / Admin verá este botón */}
            {(user.role === 'Seller' || user.role === 'Admin') && (
                <button className="icon-btn" onClick={goSeller} style={{ marginTop: 8 }}>
                    Panel Vendedor
                </button>
            )}

            <button className="icon-btn" onClick={handleLogout} style={{ marginTop: 8 }}>
                Cerrar sesión
            </button>
        </div>
    )
}
