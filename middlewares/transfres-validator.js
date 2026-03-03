import { param, query } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar la búsqueda por cuenta específica (Auditoría)
export const validateGetTransfersByAccount = [
    param('id_cuenta')
        .isInt()
        .withMessage('El ID de la cuenta debe ser un número entero válido'),
    checkValidators
];

export const validateTransferFilters = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser entre 1 y 100'),
    query('date')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe tener un formato válido (AAAA-MM-DD)'),
    checkValidators
];