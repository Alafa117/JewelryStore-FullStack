// src/components/ProfileMenu.jsx
import React from 'react'
import useAuth from '../store/auth'
import '../styles/components/profile.css'

export default function ProfileMenu({ onClose }) {
    const { user, logout } = useAuth()

    function handleLogout() {
        logout()
        if (onClose) onClose()
    }

    if (!user) return null

    return (
        <div className="dropdown" role="dialog" aria-label="Profile menu">
            <div style={{ fontWeight: 700 }}>{user.email}</div>
            <div className="muted">{user.role}</div>
            <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.firstName || ''} {user.lastName || ''}</div>
            </div>
            <button className="icon-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
    )
}
