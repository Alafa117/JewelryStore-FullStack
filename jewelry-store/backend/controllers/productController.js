// backend/controllers/productController.js
const Product = require('../models/Product')
const { validationResult } = require('express-validator')

/**
 * GET /api/products
 * - opcional: ?sellerId=... para filtrar por vendedor
 */
exports.listProducts = async (req, res, next) => {
    try {
        const q = {}
        if (req.query.sellerId) q.seller = req.query.sellerId
        // podrías añadir paginación, filtros, búsqueda, orden etc.
        const products = await Product.find(q).sort({ createdAt: -1 }).lean().exec()
        res.json(products)
    } catch (err) {
        console.error('[productController.listProducts] error', err)
        next(err)
    }
}

/**
 * GET /api/products/mine
 * - requiere token
 */
exports.listMyProducts = async (req, res, next) => {
    try {
        const sellerId = req.user.id
        const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 }).lean().exec()
        res.json(products)
    } catch (err) {
        console.error('[productController.listMyProducts] error', err)
        next(err)
    }
}

/**
 * POST /api/products
 * - crear producto por seller autenticado
 */
exports.createProduct = async (req, res, next) => {
    try {
        // express-validator errors if used in route
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() })

        const payload = {
            name: req.body.name,
            description: req.body.description || '',
            meta: req.body.meta || '',
            category: req.body.category || 'Otros',
            material: req.body.material || 'Plata',
            price: Number(req.body.price) || 0,
            stock: Number(req.body.stock) || 0,
            images: Array.isArray(req.body.images) ? req.body.images : (req.body.images ? req.body.images.split(',').map(s => s.trim()).filter(Boolean) : []),
            seller: req.user.id
        }

        const product = new Product(payload)
        await product.save()
        console.log('[productController.createProduct] created', product._id)
        res.status(201).json(product)
    } catch (err) {
        console.error('[productController.createProduct] error', err)
        next(err)
    }
}

/**
 * Middleware helper: cargar producto por :id y adjuntarlo a req.product
 */
exports.loadProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        req.product = product
        next()
    } catch (err) {
        console.error('[productController.loadProduct] error', err)
        next(err)
    }
}

/**
 * PUT /api/products/:id
 * - actualizar producto (owner o admin)
 */
exports.updateProduct = async (req, res, next) => {
    try {
        const product = req.product // desde loadProduct
        // aplicar cambios permitidos (evitar cambiar seller a otro)
        const up = {}
        const allowed = ['name', 'description', 'meta', 'category', 'material', 'price', 'stock', 'images']
        allowed.forEach(k => {
            if (req.body[k] !== undefined) up[k] = req.body[k]
        })
        // normalizar images si vienen como string
        if (up.images && typeof up.images === 'string') {
            up.images = up.images.split(',').map(s => s.trim()).filter(Boolean)
        }
        Object.assign(product, up)
        await product.save()
        console.log('[productController.updateProduct] updated', product._id)
        res.json(product)
    } catch (err) {
        console.error('[productController.updateProduct] error', err)
        next(err)
    }
}

/**
 * DELETE /api/products/:id
 * - eliminar producto (owner o admin)
 */
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = req.product
        await product.deleteOne()
        console.log('[productController.deleteProduct] deleted', product._id)
        res.json({ message: 'Product deleted' })
    } catch (err) {
        console.error('[productController.deleteProduct] error', err)
        next(err)
    }
}
