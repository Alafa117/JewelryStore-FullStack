// src/components/DebugPanel.jsx
import React from 'react'
import useAuth from '../store/auth'
import '../styles/components/debug.css'

export default function DebugPanel() {
    const { user, token } = useAuth()
    return (
        <details className="debug">
            <summary>Debug · Panel</summary>
            <pre className="debug-pre">{JSON.stringify({ user, hasToken: !!token }, null, 2)}</pre>
        </details>
    )
}
