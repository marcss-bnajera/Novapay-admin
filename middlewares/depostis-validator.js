import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar la creación de un depósito (POST)
export const validateMakeDeposit = [
    body('numero_cuenta')
        .notEmpty()
        .withMessage('El número de cuenta es obligatorio')
        .isLength({ min: 10, max: 12 })
        .withMessage('El número de cuenta debe tener entre 10 y 12 dígitos')
        .isNumeric()
        .withMessage('El número de cuenta solo debe contener números'),

    body('monto')
        .notEmpty()
        .withMessage('El monto del depósito es requerido')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El monto debe ser un número decimal válido (ej: 500.00)')
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                throw new Error('El monto a depositar debe ser mayor a 0');
            }
            return true;
        }),

    checkValidators,
];

// 2. Validar búsqueda por ID (GET)
export const validateGetDepositById = [
    param('id')
        .isInt()
        .withMessage('El ID del depósito debe ser un número entero válido'),
    checkValidators,
];