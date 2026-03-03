import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar creación manual (POST)
export const validateSaveShopping = [
    body('cuenta_id')
        .isInt().withMessage('El ID de la cuenta debe ser un número entero'),

    body('producto_id')
        .isInt().withMessage('El ID del producto debe ser un número entero'),

    body('monto')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('El monto debe ser un número decimal válido')
        .custom(value => parseFloat(value) > 0)
        .withMessage('El monto debe ser mayor a 0'),

    checkValidators
];

// 2. Validar actualización o anulación (PUT)
export const validateUpdateShopping = [
    param('id')
        .isInt().withMessage('ID de compra no válido'),

    body('estado')
        .optional()
        .toUpperCase()
        .isIn(['COMPLETADO', 'ANULADO'])
        .withMessage('El estado solo puede ser COMPLETADO o ANULADO'),

    body('motivo_anulacion')
        .if(body('estado').equals('ANULADO'))
        .notEmpty()
        .withMessage('Si anula la compra, debe proporcionar un motivo')
        .isLength({ min: 10 })
        .withMessage('El motivo debe tener al menos 10 caracteres'),

    checkValidators
];

// 3. Validar búsqueda por cuenta (Historial)
export const validateGetLatestMovements = [
    param('cuenta_id')
        .isInt().withMessage('ID de cuenta no válido'),
    checkValidators
];

// 4. Validar eliminación con reembolso (DELETE)
export const validateDeleteShopping = [
    param('id').isInt().withMessage('ID no válido'),
    body('motivo')
        .notEmpty().withMessage('El motivo de la eliminación es obligatorio para auditoría'),
    checkValidators
];