// src/components/Navbar.jsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'
import useCart from '../store/cart'
import SearchBar from './SearchBar.jsx'
import ProfileMenu from './ProfileMenu.jsx'
import CartMenu from './CartMenu.jsx'
import '../styles/components/navbar.css'

export default function Navbar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { items } = useCart()

    const [showSearch, setShowSearch] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showCart, setShowCart] = useState(false)

    function goHome() {
        console.debug('[Navbar] goHome from', pathname)
        navigate('/')
    }

    function handleSearch(query) {
        console.debug('[Navbar] search executed', query)
        // Por ahora solo debug; podrías navegar a /colecciones?q=...
    }

    return (
        <nav className="nav" role="navigation" aria-label="Main navigation">
            <div className="nav-left" onClick={goHome} role="button" tabIndex={0}>
                <div className="brand-text">Joyería</div>
            </div>

            <ul className="nav-right">
                <li>
                    <button
                        className="icon-btn"
                        aria-expanded={showSearch}
                        aria-controls="search-input"
                        onClick={() => { setShowSearch(s => !s); setShowProfile(false); setShowCart(false) }}
                    >
                        {showSearch ? 'Cerrar' : 'Buscar'}
                    </button>
                </li>

                <li style={{ position: 'relative' }}>
                    {showSearch && (
                        <div id="search-input" style={{ position: 'relative' }}>
                            <SearchBar onSearch={handleSearch} />
                        </div>
                    )}
                </li>

                {/* Link a Colecciones (biblioteca general) */}
                <li><Link to="/colecciones" className="icon-btn">Colecciones</Link></li>

                {!user && (
                    <>
                        <li><Link to="/login" className="icon-btn">Iniciar</Link></li>
                        <li><Link to="/signup" className="icon-btn">Sign Up</Link></li>
                    </>
                )}

                {user && (
                    <>
                        <li style={{ position: 'relative' }}>
                            <button
                                className="icon-btn"
                                aria-expanded={showProfile}
                                onClick={() => { setShowProfile(s => !s); setShowCart(false); setShowSearch(false) }}
                            >
                                Perfil
                            </button>

                            {showProfile && <ProfileMenu onClose={() => setShowProfile(false)} />}
                        </li>

                        <li style={{ position: 'relative' }}>
                            <button
                                className="icon-btn"
                                aria-expanded={showCart}
                                onClick={() => { setShowCart(s => !s); setShowProfile(false); setShowSearch(false) }}
                            >
                                Carrito <span className="badge">{items.length}</span>
                            </button>

                            {showCart && <CartMenu onClose={() => setShowCart(false)} />}
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
