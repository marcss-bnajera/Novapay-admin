import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateCurrency = [
    body('currency')
        .trim()
        .notEmpty().withMessage('El código de la moneda es obligatorio (ej: USD)')
        .isLength({ min: 3, max: 3 }).withMessage('El código debe tener exactamente 3 caracteres')
        .isAlpha().withMessage('El código solo debe contener letras')
        .toUpperCase(),

    body('symbol')
        .trim()
        .notEmpty().withMessage('El símbolo es obligatorio (ej: $)')
        .isLength({ max: 5 }).withMessage('El símbolo no puede exceder los 5 caracteres'),

    body('rate')
        .notEmpty().withMessage('La tasa de cambio (rate) es obligatoria')
        .isDecimal()
        .withMessage('El rate debe ser un número decimal (ej: 7.7500)')
        .custom(value => parseFloat(value) > 0)
        .withMessage('La tasa de cambio debe ser mayor a 0'),

    checkValidators
];

export const validateUpdateCurrency = [
    param('id')
        .isInt().withMessage('ID de moneda no válido'),

    body('currency')
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .isAlpha()
        .toUpperCase(),

    body('symbol')
        .optional()
        .trim()
        .isLength({ max: 5 }),

    body('rate')
        .optional()
        .isDecimal()
        .custom(value => parseFloat(value) > 0)
        .withMessage('El rate debe ser un número positivo'),

    checkValidators
];

export const validateDeleteCurrency = [
    param('id')
        .isInt().withMessage('ID de moneda no válido'),
    checkValidators
];