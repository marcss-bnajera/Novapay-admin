import { param, query } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar obtención por ID (GET)
export const validateGetTransactionById = [
    param('id')
        .isInt()
        .withMessage('El ID de la transacción debe ser un número entero válido'),
    checkValidators
];

export const validateTransactionFilters = [
    query('sender_account_id')
        .optional()
        .isInt()
        .withMessage('El ID de la cuenta emisora debe ser un número'),

    query('receiver_account_id')
        .optional()
        .isInt()
        .withMessage('El ID de la cuenta receptora debe ser un número'),

    checkValidators
];