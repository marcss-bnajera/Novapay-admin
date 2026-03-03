import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar creación de Cliente (POST)
export const validateSaveUser = [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
    body('username').trim().notEmpty().withMessage('El username es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('dpi')
        .isLength({ min: 13, max: 13 }).withMessage('El DPI debe tener 13 dígitos')
        .isNumeric().withMessage('El DPI solo debe contener números'),
    body('nit').notEmpty().withMessage('El NIT es obligatorio'),
    body('telefono').isMobilePhone().withMessage('Número de teléfono no válido'),
    body('ingresos_mensuales')
        .isDecimal()
        .custom(value => parseFloat(value) >= 100)
        .withMessage('Los ingresos deben ser de al menos Q100.00'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('role_id').isInt().withMessage('El ID de rol debe ser un número entero'),
    checkValidators
];

// 2. Validar actualización (PUT)
export const validateUpdateUser = [
    param('id').isInt().withMessage('ID de usuario no válido'),
    body('email').optional().isEmail().withMessage('Formato de email incorrecto'),
    body('telefono').optional().isMobilePhone(),
    body('ingresos_mensuales').optional().isDecimal(),
    // Nota: El controlador ya ignora DPI, Password y Role_id por seguridad
    checkValidators
];

// 3. Validar ID para eliminación o búsqueda
export const validateUserId = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    checkValidators
];