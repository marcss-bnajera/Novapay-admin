import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar creación de producto (POST)
export const validateCreateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del producto es obligatorio')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria'),

    body('category')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Categoría no válida'),

    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal (ej: 10.50)')
        .custom(value => parseFloat(value) > 0).withMessage('El precio debe ser un monto positivo'),

    body('state')
        .optional()
        .toUpperCase()
        .isIn(['ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING'])
        .withMessage('Estado de producto no válido'),

    checkValidators
];

// 2. Validar actualización de producto (PUT)
export const validateUpdateProduct = [
    param('id')
        .isInt().withMessage('ID de producto no válido'),

    body('name').optional().trim().isLength({ min: 3 }),
    body('price').optional().isDecimal().custom(value => parseFloat(value) > 0),
    body('state').optional().toUpperCase().isIn(['ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING']),

    checkValidators
];

// 3. Validar búsqueda o eliminación (GET / DELETE)
export const validateProductId = [
    param('id')
        .isInt().withMessage('El ID debe ser un número entero'),
    checkValidators
];