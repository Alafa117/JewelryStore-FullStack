// routes/auth.js
const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authController = require('../controllers/authController')
const validateRequest = require('../middleware/validateRequest')

// Signup validation rules
const signupValidators = [
    body('firstName').isLength({ min: 1 }).withMessage('firstName required'),
    body('lastName').isLength({ min: 1 }).withMessage('lastName required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('role').optional().isIn(['User', 'Seller', 'Admin']).withMessage('Invalid role')
]

// Login validation rules
const loginValidators = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password required')
]

router.post('/signup', signupValidators, validateRequest, authController.signup)
router.post('/login', loginValidators, validateRequest, authController.login)

module.exports = router
