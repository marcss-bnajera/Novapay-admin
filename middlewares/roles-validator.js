import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar creación de rol (POST)
export const validateCreateRole = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del rol es obligatorio')
        .isUppercase().withMessage('Por convención, los roles deben estar en MAYÚSCULAS')
        .isLength({ min: 4, max: 20 }).withMessage('El nombre del rol debe tener entre 4 y 20 caracteres')
        .isAlpha().withMessage('El nombre del rol solo debe contener letras'),
    checkValidators
];

// 2. Validar actualización de rol (PUT)
export const validateUpdateRole = [
    param('id')
        .isInt().withMessage('El ID del rol debe ser un número entero'),
    body('name')
        .optional()
        .trim()
        .isUppercase().withMessage('El nombre debe estar en MAYÚSCULAS')
        .isLength({ min: 4, max: 20 }),
    checkValidators
];

// 3. Validar búsqueda o eliminación (GET / DELETE)
export const validateRoleId = [
    param('id')
        .isInt().withMessage('ID de rol no válido'),
    checkValidators
];