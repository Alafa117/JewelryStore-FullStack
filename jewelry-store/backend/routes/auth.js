// backend/routes/auth.js
const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authController = require('../controllers/authController')
const validateRequest = require('../middleware/validateRequest')
const authMiddleware = require('../middleware/authMiddleware')

// Mensaje único y consolidado para password (exactamente como pediste)
const passwordRequirementsMsg =
    'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo especial.'

// Signup validation rules (usamos UNA validación compuesta para password)
const signupValidators = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('Nombres es requerido.')
        .isLength({ max: 80 }).withMessage('Nombres demasiado largo (máx 80).'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Apellidos es requerido.')
        .isLength({ max: 80 }).withMessage('Apellidos demasiado largo (máx 80).'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email es requerido.')
        .isEmail().withMessage('Email no es válido.'),

    /**
     * Password: UNA sola regla compuesta (regex) que exige:
     * - al menos 8 caracteres
     * - al menos 1 minúscula
     * - al menos 1 mayúscula
     * - al menos 1 dígito
     * - al menos 1 carácter especial (\W or underscore)
     *
     * Si falla, devolverá SOLO el mensaje passwordRequirementsMsg.
     */
    body('password')
        .notEmpty().withMessage('Contraseña es requerida.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .withMessage(passwordRequirementsMsg),

    body('role')
        .optional()
        .isIn(['User', 'Seller', 'Admin']).withMessage('Rol inválido.')
]

// Login validation
const loginValidators = [
    body('email').trim().isEmail().withMessage('Email no es válido.'),
    body('password').notEmpty().withMessage('Contraseña requerida.')
]

router.post('/signup', signupValidators, validateRequest, authController.signup)
router.post('/login', loginValidators, validateRequest, authController.login)

// Endpoint de prueba protegido
router.get('/test', authMiddleware, authController.test)

module.exports = router
