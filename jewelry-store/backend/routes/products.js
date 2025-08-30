// backend/routes/products.js
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const productController = require('../controllers/productController')
const { verifyToken, isOwnerOrAdmin } = require('../middleware/auth')

/* Public list - supports query ?sellerId=... */
router.get('/', productController.listProducts)

/* Protected: list my products */
router.get('/mine', verifyToken, productController.listMyProducts)

/* Create product (seller must be authenticated) */
router.post('/',
    verifyToken,
    // validations optional
    body('name').isLength({ min: 2 }).withMessage('El nombre es muy corto'),
    body('price').isNumeric().withMessage('Precio inválido'),
    productController.createProduct
)

/* For routes with :id we preload product so auth can check ownership */
router.use('/:id', productController.loadProduct)

/* Update (only owner or admin) */
router.put('/:id', verifyToken, isOwnerOrAdmin, productController.updateProduct)

/* Delete (only owner or admin) */
router.delete('/:id', verifyToken, isOwnerOrAdmin, productController.deleteProduct)

module.exports = router
