import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// 1. Validar creación de Cliente (POST)
export const validateSaveUser = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras'),
    body('apellido')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo debe contener letras'),
    body('username')
        .trim()
        .notEmpty().withMessage('El username es obligatorio')
        .isAlphanumeric().withMessage('El username solo puede contener letras y números'),
    body('email')
        .trim()
        .isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('dpi')
        .trim()
        .isString()
        .matches(/^[0-9]{13}$/).withMessage('El DPI debe tener exactamente 13 dígitos numéricos'),
    body('nit')
        .trim()
        .notEmpty().withMessage('El NIT es obligatorio')
        .matches(/^[0-9Kk-]+$/).withMessage('Formato de NIT no válido'),
        body('telefono')
        .trim()
        .matches(/^[0-9]{8}$/).withMessage('El teléfono debe tener exactamente 8 dígitos numéricos'),
    body('ingresos_mensuales')
        .isDecimal().withMessage('Los ingresos deben ser un número válido')
        .custom(value => parseFloat(value) >= 100).withMessage('Los ingresos deben ser de al menos Q100.00'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('role_id')
        .isInt().withMessage('El ID de rol debe ser un número entero'),
    checkValidators
];

// 2. Validar actualización (PUT)
export const validateUpdateUser = [
    param('id').isInt().withMessage('ID de usuario no válido'),
    body('nombre').optional().trim().isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras'),
    body('apellido').optional().trim().isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo debe contener letras'),
    body('username').optional().trim().isAlphanumeric().withMessage('El username solo puede contener letras y números'),
    body('email').optional().trim().isEmail().withMessage('Formato de email incorrecto'),
    body('nit').optional().trim().matches(/^[0-9Kk-]+$/).withMessage('Formato de NIT inválido'),
    body('telefono').optional().trim().matches(/^[0-9]{8}$/).withMessage('El teléfono debe tener exactamente 8 dígitos'),
    body('ingresos_mensuales').optional().isDecimal().custom(value => parseFloat(value) >= 100).withMessage('Mínimo Q100.00'),
    body('direccion').optional().trim().notEmpty().withMessage('La dirección no puede estar vacía'),

    checkValidators
];

// 3. Validar ID para eliminación o búsqueda
export const validateUserId = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    checkValidators
];