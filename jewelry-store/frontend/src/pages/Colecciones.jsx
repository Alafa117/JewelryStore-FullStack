// src/pages/Colecciones.jsx
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import PRODUCTS from '../data/products'
import ProductModal from '../components/ProductModal.jsx'
import useCart from '../store/cart'
import '../styles/pages/products.css'
import '../styles/pages/collections.css'

/* Helpers */
function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const PRICE_RANGES = [
    { id: 'r1', label: '50k - 100k', min: 50000, max: 100000 },
    { id: 'r2', label: '100k - 500k', min: 100000, max: 500000 },
    { id: 'r3', label: '500k - 1M', min: 500000, max: 1000000 },
]

export default function Colecciones() {
    const { addItem } = useCart()
    const [searchParams, setSearchParams] = useSearchParams()

    // Read initial values from URL
    const paramQ = searchParams.get('q') || ''
    const paramCats = (searchParams.get('cats') || '').split(',').filter(Boolean)
    const paramMats = (searchParams.get('mats') || '').split(',').filter(Boolean)
    const paramPrices = (searchParams.get('prices') || '').split(',').filter(Boolean)
    const paramPage = parseInt(searchParams.get('page') || '1', 10) || 1
    const paramPer = parseInt(searchParams.get('per') || '6', 10) || 6

    const [query, setQuery] = useState(paramQ)
    const [selectedCats, setSelectedCats] = useState(new Set(paramCats))
    const [selectedMaterials, setSelectedMaterials] = useState(new Set(paramMats))
    const [selectedPrices, setSelectedPrices] = useState(new Set(paramPrices))
    const [page, setPage] = useState(paramPage)         // page used for pagination / lazy load
    const [per, setPer] = useState(paramPer)            // items per page / batch
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    // Derived lists
    const categories = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.category))), [])
    const materials = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.material))), [])

    // toggle helper for sets
    const toggleSet = useCallback((setter, value) => {
        setter(prev => {
            const s = new Set(prev)
            if (s.has(value)) s.delete(value)
            else s.add(value)
            // reset page to 1 whenever filters change
            setPage(1)
            return s
        })
    }, [])

    // Filtering logic
    function matchesFilters(p) {
        const q = (query || '').trim().toLowerCase()
        if (q) {
            const inText = (p.name + ' ' + p.meta + ' ' + p.description + ' ' + p.category).toLowerCase()
            if (!inText.includes(q)) return false
        }
        if (selectedCats.size > 0 && !selectedCats.has(p.category)) return false
        if (selectedMaterials.size > 0 && !selectedMaterials.has(p.material)) return false
        if (selectedPrices.size > 0) {
            let ok = false
            for (const rId of selectedPrices) {
                const rng = PRICE_RANGES.find(r => r.id === rId)
                if (!rng) continue
                if (p.price >= rng.min && p.price <= rng.max) { ok = true; break }
            }
            if (!ok) return false
        }
        return true
    }

    // filtered list (unpaginated)
    const filtered = useMemo(() => {
        try {
            return PRODUCTS.filter(matchesFilters)
        } catch (err) {
            console.error('[Colecciones] filter error', err)
            return []
        }
    }, [query, selectedCats, selectedMaterials, selectedPrices])

    // Pagination / Lazy-load: we show items up to page * per
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / per))
    // displayed items: cumulative up to page * per (lazy load behavior)
    const displayed = useMemo(() => filtered.slice(0, page * per), [filtered, page, per])

    // Sync state -> URL params (replace to avoid polluting history)
    useEffect(() => {
        const params = {}
        if (query) params.q = query
        if (selectedCats.size > 0) params.cats = Array.from(selectedCats).join(',')
        if (selectedMaterials.size > 0) params.mats = Array.from(selectedMaterials).join(',')
        if (selectedPrices.size > 0) params.prices = Array.from(selectedPrices).join(',')
        if (page && page > 1) params.page = String(page)
        if (per && per !== 6) params.per = String(per) // default 6, only set if different
        // setSearchParams expects an object or URLSearchParams
        try {
            setSearchParams(params, { replace: true })
            console.debug('[Colecciones] URL params set', params)
        } catch (err) {
            console.error('[Colecciones] setSearchParams error', err)
        }
    }, [query, selectedCats, selectedMaterials, selectedPrices, page, per, setSearchParams])

    // If URL changes externally (user pastes link), keep state in sync:
    useEffect(() => {
        // We listen for searchParams changes (react-router guarantees referential change)
        const newQ = searchParams.get('q') || ''
        const newCats = (searchParams.get('cats') || '').split(',').filter(Boolean)
        const newMats = (searchParams.get('mats') || '').split(',').filter(Boolean)
        const newPrices = (searchParams.get('prices') || '').split(',').filter(Boolean)
        const newPage = parseInt(searchParams.get('page') || '1', 10) || 1
        const newPer = parseInt(searchParams.get('per') || '6', 10) || 6

        // Only update local state if differs (avoids infinite loop)
        if (newQ !== query) setQuery(newQ)
        // compare sets
        const catsEqual = newCats.length === selectedCats.size && newCats.every(c => selectedCats.has(c))
        if (!catsEqual) setSelectedCats(new Set(newCats))
        const matsEqual = newMats.length === selectedMaterials.size && newMats.every(m => selectedMaterials.has(m))
        if (!matsEqual) setSelectedMaterials(new Set(newMats))
        const pricesEqual = newPrices.length === selectedPrices.size && newPrices.every(p => selectedPrices.has(p))
        if (!pricesEqual) setSelectedPrices(new Set(newPrices))
        if (newPage !== page) setPage(newPage)
        if (newPer !== per) setPer(newPer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    function clearFilters() {
        setQuery('')
        setSelectedCats(new Set())
        setSelectedMaterials(new Set())
        setSelectedPrices(new Set())
        setPage(1)
        setPer(6)
    }

    function openModal(product) {
        setSelectedProduct(product)
        setModalOpen(true)
    }
    function closeModal() {
        setModalOpen(false)
        setSelectedProduct(null)
    }

    function handleAddToCart(ev, product) {
        ev.stopPropagation()
        try {
            addItem({ id: product.id, name: product.name, meta: product.meta, price: product.price })
            console.debug('[Colecciones] addItem', product.id)
            setTimeout(() => alert(`${product.name} agregado a tu lista`), 80)
        } catch (err) {
            console.error('[Colecciones] addItem error', err)
            alert('No fue posible agregar el producto. Revisa la consola.')
        }
    }

    function loadMore() {
        // increment page (lazy-load)
        setPage(prev => Math.min(prev + 1, totalPages))
    }

    function goToPage(n) {
        if (n < 1) n = 1
        if (n > totalPages) n = totalPages
        setPage(n)
        // scroll to top of results for usability
        const el = document.querySelector('.results')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <section className="collections-page">
            <div className="collections-grid">
                <aside className="filters card-surface" aria-label="Filtros de productos">
                    <div className="filters-header">
                        <h3>Filtros</h3>
                        <button className="icon-btn small" onClick={clearFilters}>Limpiar</button>
                    </div>

                    <div className="filter-block">
                        <label className="filter-search">
                            <input
                                placeholder="Buscar dentro de colecciones..."
                                value={query}
                                onChange={e => { setQuery(e.target.value); setPage(1) }}
                                aria-label="Buscar en colecciones"
                            />
                        </label>
                    </div>

                    <div className="filter-section">
                        <h4>Categorías</h4>
                        {categories.map(cat => (
                            <label key={cat} className="filter-item-real">
                                <input
                                    type="checkbox"
                                    checked={selectedCats.has(cat)}
                                    onChange={() => toggleSet(setSelectedCats, cat)}
                                />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>

                    <div className="filter-section">
                        <h4>Precio</h4>
                        {PRICE_RANGES.map(r => (
                            <label key={r.id} className="filter-item-real">
                                <input
                                    type="checkbox"
                                    checked={selectedPrices.has(r.id)}
                                    onChange={() => toggleSet(setSelectedPrices, r.id)}
                                />
                                <span>{r.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="filter-section">
                        <h4>Material</h4>
                        {materials.map(m => (
                            <label key={m} className="filter-item-real">
                                <input
                                    type="checkbox"
                                    checked={selectedMaterials.has(m)}
                                    onChange={() => toggleSet(setSelectedMaterials, m)}
                                />
                                <span>{m}</span>
                            </label>
                        ))}
                    </div>
                </aside>

                <main className="results" aria-live="polite">
                    <div className="results-header">
                        <div>
                            <h3>Todos los productos</h3>
                            <div className="muted">{total} resultados</div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <label className="sort-label muted">Mostrar:</label>
                            <select value={per} onChange={(e) => { setPer(parseInt(e.target.value, 10)); setPage(1) }}>
                                <option value={6}>6 por página</option>
                                <option value={12}>12 por página</option>
                                <option value={24}>24 por página</option>
                            </select>
                        </div>
                    </div>

                    <div className="products-grid" role="list">
                        {displayed.map(p => (
                            <article
                                className="product-card"
                                key={p.id}
                                role="listitem"
                                onClick={(e) => { const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : ''; if (['button', 'svg', 'path', 'input', 'a'].includes(tag)) return; openModal(p) }}
                            >
                                <div className="product-img" aria-hidden="true" />

                                <div style={{ marginTop: 10 }}>
                                    <div className="product-title">{p.name}</div>
                                    <div className="product-meta">{p.meta}</div>
                                    <div style={{ fontWeight: 700 }}>₡{formatPrice(p.price)}</div>
                                </div>

                                <div className="product-actions" style={{ marginTop: 12 }}>
                                    <button className="icon-btn small" onClick={(ev) => { ev.stopPropagation(); openModal(p) }}>
                                        Ver
                                    </button>

                                    <button className="icon-btn small" onClick={(ev) => handleAddToCart(ev, p)}>
                                        Agregar
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Paginación / Lazy load controls */}
                    <div className="pagination">
                        <div className="pagination-left">
                            <button className="icon-btn small" onClick={() => goToPage(page - 1)} disabled={page <= 1}>Prev</button>
                            <span className="muted">Página {Math.min(page, totalPages)} de {totalPages}</span>
                            <button className="icon-btn small" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>Next</button>
                        </div>

                        <div className="pagination-right">
                            {page * per < total ? (
                                <button className="icon-btn" onClick={loadMore}>Cargar más</button>
                            ) : (
                                <span className="muted">No hay más resultados</span>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <ProductModal product={selectedProduct} isOpen={modalOpen} onClose={closeModal} />
        </section>
    )
}
