// src/pages/Colecciones.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/products'
import ProductModal from '../components/ProductModal.jsx'
import useCart from '../store/cart'
import '../styles/pages/collections.css'
import '../styles/pages/products.css'

function formatPrice(n) {
    if (n == null) return '--'
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const PRICE_RANGES = [
    { id: 'r1', label: '50k - 100k', min: 50000, max: 100000 },
    { id: 'r2', label: '100k - 500k', min: 100000, max: 500000 },
    { id: 'r3', label: '500k - 1M', min: 500000, max: 1000000 },
]

export default function Colecciones() {
    const { addItem } = useCart()
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [query, setQuery] = useState('')
    const [selectedCats, setSelectedCats] = useState(new Set())
    const [selectedMaterials, setSelectedMaterials] = useState(new Set())
    const [selectedPrices, setSelectedPrices] = useState(new Set())

    const [page, setPage] = useState(1)
    const [per, setPer] = useState(12)

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const products = await getProducts()
                if (!mounted) return
                setAllProducts(Array.isArray(products) ? products : [])
                console.debug('[Colecciones] fetched products', products?.length)
            } catch (err) {
                console.error('[Colecciones] getProducts error', err)
                setError(err.message || 'No fue posible cargar productos')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    const categories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))), [allProducts])
    const materials = useMemo(() => Array.from(new Set(allProducts.map(p => p.material).filter(Boolean))), [allProducts])

    function toggleSet(setter, value) {
        setter(prev => {
            const s = new Set(prev)
            if (s.has(value)) s.delete(value)
            else s.add(value)
            setPage(1)
            return s
        })
    }

    function matchesFilters(p) {
        const q = (query || '').trim().toLowerCase()
        if (q) {
            const inText = `${p.name || ''} ${p.meta || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase()
            if (!inText.includes(q)) return false
        }
        if (selectedCats.size > 0 && !selectedCats.has(p.category)) return false
        if (selectedMaterials.size > 0 && !selectedMaterials.has(p.material)) return false
        if (selectedPrices.size > 0) {
            let ok = false
            for (const rId of selectedPrices) {
                const rng = PRICE_RANGES.find(r => r.id === rId)
                if (!rng) continue
                if ((p.price || 0) >= rng.min && (p.price || 0) <= rng.max) { ok = true; break }
            }
            if (!ok) return false
        }
        return true
    }

    const filtered = useMemo(() => {
        try {
            return allProducts.filter(matchesFilters)
        } catch (err) {
            console.error('[Colecciones] filter error', err)
            return []
        }
    }, [allProducts, query, selectedCats, selectedMaterials, selectedPrices])

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / per))
    const displayed = useMemo(() => filtered.slice(0, page * per), [filtered, page, per])

    function clearFilters() {
        setQuery('')
        setSelectedCats(new Set())
        setSelectedMaterials(new Set())
        setSelectedPrices(new Set())
        setPage(1)
    }

    function openModal(p) {
        setSelectedProduct(p)
        setModalOpen(true)
    }
    function closeModal() {
        setModalOpen(false)
        setSelectedProduct(null)
    }

    function handleAddToCart(ev, product) {
        ev.stopPropagation()
        try {
            if ((product.stock || 0) <= 0) {
                alert('No hay stock disponible para este producto.')
                return
            }
            addItem({ id: product._id ?? product.id, name: product.name, meta: product.meta, price: product.price })
            console.debug('[Colecciones] addItem', product._id ?? product.id)
            setTimeout(() => alert(`${product.name} agregado a tu lista`), 80)
        } catch (err) {
            console.error('[Colecciones] addItem error', err)
            alert('No fue posible agregar el producto. Revisa la consola.')
        }
    }

    function loadMore() {
        setPage(prev => Math.min(prev + 1, totalPages))
    }

    function goToPage(n) {
        if (n < 1) n = 1
        if (n > totalPages) n = totalPages
        setPage(n)
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
                        {categories.length === 0 && <div className="muted">No hay categorías</div>}
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
                        {materials.length === 0 && <div className="muted">No hay materiales</div>}
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
                            <select value={per} onChange={(e) => { setPer(Number(e.target.value)); setPage(1) }}>
                                <option value={6}>6 por página</option>
                                <option value={12}>12 por página</option>
                                <option value={24}>24 por página</option>
                            </select>
                        </div>
                    </div>

                    {loading && <div className="muted">Cargando productos…</div>}
                    {error && <div className="form-error">{error}</div>}

                    <div className="products-grid" role="list">
                        {displayed.map(p => {
                            const outOfStock = (p.stock || 0) <= 0
                            return (
                                <article
                                    className={`product-card ${outOfStock ? 'oos' : ''}`}
                                    key={p._id ?? p.id}
                                    role="listitem"
                                    onClick={(e) => { const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : ''; if (['button', 'svg', 'path', 'input', 'a'].includes(tag)) return; openModal(p) }}
                                >
                                    <div className="product-img" aria-hidden="true" style={{ backgroundImage: p.images && p.images[0] ? `url(${p.images[0]})` : undefined }} />

                                    {/* badge de stock */}
                                    <div className="product-stock-badge">
                                        {outOfStock ? <span className="out-of-stock">Out Of Stock</span> : <span>Stock: {p.stock}</span>}
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <div className="product-title">{p.name}</div>
                                        <div className="product-meta">{p.meta || p.material || p.category}</div>
                                        <div style={{ fontWeight: 700 }}>₡{formatPrice(p.price)}</div>
                                    </div>

                                    <div className="product-actions" style={{ marginTop: 12 }}>
                                        <button className="icon-btn small" onClick={(ev) => { ev.stopPropagation(); openModal(p) }}>
                                            Ver
                                        </button>

                                        <button
                                            className="icon-btn small"
                                            onClick={(ev) => handleAddToCart(ev, p)}
                                            disabled={outOfStock}
                                            aria-disabled={outOfStock}
                                            title={outOfStock ? 'Sin stock' : 'Agregar'}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </article>
                            )
                        })}
                    </div>

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
