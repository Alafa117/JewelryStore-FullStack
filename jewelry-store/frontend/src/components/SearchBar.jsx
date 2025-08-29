// src/components/SearchBar.jsx
import React, { useState } from 'react'
import '../styles/components/search.css'

export default function SearchBar({ onSearch }) {
    const [q, setQ] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        console.debug('[SearchBar] search', q)
        if (onSearch) onSearch(q)
    }

    return (
        <div className="search-container" role="search">
            <form onSubmit={handleSubmit}>
                <input
                    className="search-input"
                    placeholder="Buscar productos, colecciones, materiales..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Buscar productos"
                />
            </form>
        </div>
    )
}
