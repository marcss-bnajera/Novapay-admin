import { query } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateDashboardPeriod = [
    query('periodo')
        .optional()
        .isIn(['SEMANAL', 'MENSUAL', 'ANUAL'])
        .withMessage('El periodo seleccionado no es válido'),
    checkValidators
];