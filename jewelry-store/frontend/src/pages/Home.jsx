// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'  // <-- usar Link para navegación SPA
import '../styles/pages/home.css'

export default function Home() {
    return (
        <section className="home">
            <header className="hero">
                <div>
                    <h1 className="hero-title">Joyería · Colecciones exclusivas</h1>
                    <p className="hero-sub">Diseños atemporales. Materiales nobles. Entrega segura.</p>
                </div>

                <div className="hero-cta">
                    {/* Usamos Link a /colecciones en lugar de anchor #collections */}
                    <Link to="/colecciones" className="btn">Ver colecciones</Link>
                </div>
            </header>

            {/* Sección de colecciones: tarjetas VISUALES únicamente (SIN BOTONES NI ENLACES) */}
            <section id="collections" className="grid visual-cards" aria-label="Colecciones visuales">
                <article className="card visual-card" aria-hidden="true">
                    <div className="card-media" role="img" aria-label="Imagen Anillos" />
                    <div className="card-body">
                        <div className="card-title">Anillos</div>
                        <div className="card-desc">Diseños clásicos y modernos.</div>
                    </div>
                </article>

                <article className="card visual-card" aria-hidden="true">
                    <div className="card-media" role="img" aria-label="Imagen Collares" />
                    <div className="card-body">
                        <div className="card-title">Collares</div>
                        <div className="card-desc">Piezas únicas para cada ocasión.</div>
                    </div>
                </article>

                <article className="card visual-card" aria-hidden="true">
                    <div className="card-media" role="img" aria-label="Imagen Pendientes" />
                    <div className="card-body">
                        <div className="card-title">Pendientes</div>
                        <div className="card-desc">Detalles que hablan por sí solos.</div>
                    </div>
                </article>
            </section>
        </section>
    )
}
