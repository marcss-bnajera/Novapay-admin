import { body, param, query } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar búsqueda por número de cuenta
export const validateGetAccountByNumber = [
    param('numero_cuenta')
        .notEmpty()
        .isNumeric()
        .isLength({ min: 10, max: 12 })
        .withMessage('El número de cuenta debe ser numérico y tener entre 10 y 12 dígitos'),
    checkValidators
];

// 2. Validar actualización de cuenta (Admin puede editar balance y estado)
export const validateUpdateAccountAdmin = [
    param('numero_cuenta')
        .isNumeric()
        .isLength({ min: 10, max: 12 })
        .withMessage('Número de cuenta no válido'),

    body('nombre_cuenta')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('El nombre de la cuenta debe tener al menos 3 caracteres'),

    body('tipo_cuenta')
        .optional()
        .isIn(['AHORRO', 'MONETARIA'])
        .withMessage('Tipo de cuenta no válido'),

    body('estado')
        .optional()
        .toUpperCase()
        .isIn(['ACTIVA', 'INACTIVA', 'BLOQUEADA', 'SUSPENDIDA'])
        .withMessage('Estado de cuenta no válido'),

    body('balance')
        .optional()
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El balance debe ser un número decimal válido')
        .custom(value => parseFloat(value) >= 0)
        .withMessage('El balance no puede ser negativo'),

    checkValidators
];

// 3. Validar reporte de actividad
export const validateGetAccountsActivity = [
    query('order')
        .optional()
        .toUpperCase()
        .isIn(['ASC', 'DESC'])
        .withMessage('El orden debe ser ASC o DESC'),
    checkValidators
];

// 4. Validar eliminación
export const validateDeleteAccount = [
    param('numero_cuenta')
        .isNumeric()
        .withMessage('Debe proporcionar un número de cuenta válido para eliminar'),
    checkValidators
];