// frontend/src/components/SellerProducts.jsx
import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../store/auth'
import { getSellerProducts, deleteProduct } from '../api/products'
import EditProductModal from './EditProductModal'
import ConfirmDouble from './ConfirmDouble'
import useCart from '../store/cart'
import '../styles/pages/collections.css'

/**
 * Muestra los productos creados por el seller actual.
 * Reusa el layout de colecciones (products-grid, product-card).
 * Permite Editar (abre modal) y Eliminar (doble confirmación).
 */
export default function SellerProducts() {
    const { user, token } = useAuth()
    const sellerId = user?.id || user?._id || null
    const { addItem } = useCart()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [editingProduct, setEditingProduct] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null) // product to delete
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        if (!sellerId) return
        let mounted = true
        async function load() {
            setLoading(true)
            setError(null)
            try {
                console.debug('[SellerProducts] fetching products for seller', sellerId)
                const list = await getSellerProducts(token, sellerId)
                if (!mounted) return
                setProducts(Array.isArray(list) ? list : [])
                console.debug('[SellerProducts] fetched', { count: (list?.length ?? 0) })
            } catch (err) {
                console.error('[SellerProducts] load error', err)
                setError(err.message || 'Error al cargar productos')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [sellerId, refreshKey, token])

    function openEdit(p) {
        setEditingProduct(p)
    }

    function closeEdit(updated) {
        setEditingProduct(null)
        if (updated) {
            // refrescar lista (mejor pedir al backend la lista actualizada)
            setRefreshKey(k => k + 1)
        }
    }

    async function confirmAndDelete(productToDelete) {
        setConfirmDelete(productToDelete)
    }

    async function doDelete(productId) {
        try {
            console.debug('[SellerProducts] deleting', productId)
            await deleteProduct(productId, token)
            setProducts(prev => prev.filter(p => (p._id ?? p.id) !== productId))
            setConfirmDelete(null)
            setTimeout(() => alert('Producto eliminado correctamente.'), 80)
        } catch (err) {
            console.error('[SellerProducts] delete error', err)
            alert(err?.message || 'No se pudo eliminar el producto')
        }
    }

    function handleAddToCart(ev, product) {
        ev.stopPropagation()
        try {
            if ((product.stock || 0) <= 0) {
                alert('No hay stock disponible para este producto.')
                return
            }
            addItem({ id: product._id ?? product.id, name: product.name, meta: product.meta, price: product.price })
            alert(`${product.name} agregado a tu lista`)
        } catch (err) {
            console.error('[SellerProducts] addItem error', err)
            alert('No fue posible agregar el producto. Revisa la consola.')
        }
    }

    return (
        <section>
            <div style={{ marginBottom: 12 }}>
                <strong>Tus productos</strong>
                <div className="muted" style={{ marginTop: 4 }}>{products.length} productos creados</div>
            </div>

            {loading && <div className="muted">Cargando productos…</div>}
            {error && <div className="form-error">{error}</div>}

            <div className="products-grid" role="list">
                {products.map(p => {
                    const id = p._id ?? p.id
                    const outOfStock = (p.stock || 0) <= 0
                    return (
                        <article key={id} className={`product-card ${outOfStock ? 'oos' : ''}`} role="listitem">
                            <div className="product-img" aria-hidden="true" style={{ backgroundImage: p.images && p.images[0] ? `url(${p.images[0]})` : undefined }} />

                            <div className="product-stock-badge">
                                {outOfStock ? <span className="out-of-stock">Out Of Stock</span> : <span>Stock: {p.stock}</span>}
                            </div>

                            <div style={{ marginTop: 10 }}>
                                <div className="product-title">{p.name}</div>
                                <div className="product-meta">{p.meta || p.material || p.category}</div>
                                <div style={{ fontWeight: 700 }}>₡{p.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                            </div>

                            <div className="product-actions" style={{ marginTop: 12 }}>
                                <button className="icon-btn small" onClick={() => openEdit(p)}>Editar</button>
                                <button className="icon-btn small" onClick={() => confirmAndDelete(p)} style={{ background: '#fff0f0', borderColor: 'rgba(11,11,11,0.06)' }}>
                                    Eliminar
                                </button>
                                <button className="icon-btn small" onClick={(ev) => handleAddToCart(ev, p)} disabled={outOfStock}>Agregar</button>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* Edit modal */}
            {editingProduct && (
                <EditProductModal product={editingProduct} onClose={closeEdit} />
            )}

            {/* Confirm double modal for delete */}
            {confirmDelete && (
                <ConfirmDouble
                    title="Eliminar producto"
                    prompt={`Vas a eliminar "${confirmDelete.name}". Esto no se puede deshacer.`}
                    confirmText="ELIMINAR"
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => doDelete((confirmDelete._id ?? confirmDelete.id))}
                />
            )}
        </section>
    )
}
