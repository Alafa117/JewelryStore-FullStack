// backend/routes/products.js
const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const productController = require('../controllers/productController')
const validateRequest = require('../middleware/validateRequest')
const authMiddleware = require('../middleware/authMiddleware')
const requireRole = require('../middleware/roleMiddleware')

// Validaciones simples para creación
const createValidators = [
    body('name').trim().notEmpty().withMessage('name required'),
    body('category').trim().notEmpty().withMessage('category required'),
    body('price').notEmpty().withMessage('price required').isNumeric().withMessage('price must be numeric'),
    // images, description, stock optional
]

router.post(
    '/',
    authMiddleware,
    requireRole('Seller', 'Admin'),
    createValidators,
    validateRequest,
    productController.createProduct
)

// GET list (público)
router.get('/', productController.listProducts)

module.exports = router
