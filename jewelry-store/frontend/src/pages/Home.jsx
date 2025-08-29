// src/pages/Home.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/pages/home.css'

export default function Home() {
    const navigate = useNavigate()

    function goToCategory(path, name) {
        console.debug('[Home] navegar a categoría', { path, name })
        navigate(path)
    }

    return (
        <section className="home">
            <header className="hero">
                <div>
                    <h1 className="hero-title">Joyería · Colecciones exclusivas</h1>
                    <p className="hero-sub">Diseños atemporales. Materiales nobles. Entrega segura.</p>
                </div>
                <div className="hero-cta">
                    <Link to="/colecciones" className="btn">Ver colecciones</Link>
                </div>
            </header>

            <section id="collections" className="grid">
                <article className="card">
                    <div className="card-title">Anillos</div>
                    <div className="card-desc">Diseños clásicos y modernos.</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button className="icon-btn" onClick={() => goToCategory('/anillos', 'Anillos')}>Ir a Anillos</button>
                        <Link to="/colecciones" className="icon-btn">Ver en Colecciones</Link>
                    </div>
                </article>

                <article className="card">
                    <div className="card-title">Collares</div>
                    <div className="card-desc">Piezas únicas para cada ocasión.</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button className="icon-btn" onClick={() => goToCategory('/collares', 'Collares')}>Ir a Collares</button>
                        <Link to="/colecciones" className="icon-btn">Ver en Colecciones</Link>
                    </div>
                </article>

                <article className="card">
                    <div className="card-title">Pendientes</div>
                    <div className="card-desc">Detalles que hablan por sí solos.</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button className="icon-btn" onClick={() => goToCategory('/pendientes', 'Pendientes')}>Ir a Pendientes</button>
                        <Link to="/colecciones" className="icon-btn">Ver en Colecciones</Link>
                    </div>
                </article>
            </section>
        </section>
    )
}
