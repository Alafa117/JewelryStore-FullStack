// backend/controllers/productController.js
const Product = require('../models/Product')

/**
 * POST /api/products
 * Body: { name, category, material, price, description, images, stock }
 * req.user must be set by authMiddleware (id + role)
 */
exports.createProduct = async (req, res, next) => {
    try {
        const { name, category, material, price, description, images, stock } = req.body

        // Validación mínima en controller (adicional a validadores del router)
        if (!name || !category || price == null) {
            return res.status(400).json({ message: 'Campos requeridos: name, category, price' })
        }
        if (typeof price !== 'number') {
            // intentar parsear si viene como string
            const parsed = Number(price)
            if (Number.isNaN(parsed)) {
                return res.status(400).json({ message: 'Price debe ser un número' })
            }
        }

        const product = new Product({
            name: name.trim(),
            category: category.trim(),
            material: (material || '').trim(),
            price: Number(price),
            description: (description || '').trim(),
            images: Array.isArray(images) ? images : [],
            stock: typeof stock === 'number' ? stock : (stock ? Number(stock) : 1),
            seller: req.user.id
        })

        await product.save()
        console.debug('[product.create] created', product._id)
        res.status(201).json({ message: 'Producto creado', product })
    } catch (err) {
        console.error('[product.create] error', err)
        next(err)
    }
}

/**
 * GET /api/products
 * Opcional: filtros simples via query string (category, material)
 */
exports.listProducts = async (req, res, next) => {
    try {
        const { category, material, seller } = req.query
        const filter = {}
        if (category) filter.category = category
        if (material) filter.material = material
        if (seller) filter.seller = seller
        const products = await Product.find(filter).sort({ createdAt: -1 }).limit(200).lean()
        res.json({ ok: true, count: products.length, products })
    } catch (err) {
        console.error('[product.list] error', err)
        next(err)
    }
}
