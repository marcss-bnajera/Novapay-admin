`use strict`

import { User } from "./users.model.js";
import { Account } from "../accounts/accounts.model.js";
import { Transfer } from "../transfers/transfers.model.js";
import { db } from "../../configs/db.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";


// 1. Agregar un nuevo Cliente 
export const saveUser = async (req, res) => {
    const t = await db.transaction(); // Inicia transacción para asegurar que se creen ambos o ninguno
    try {
        const data = req.body;

        // Validación de Ingresos Mensuales
        if (parseFloat(data.ingresos_mensuales) < 100) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: "Los ingresos mensuales deben ser mayores a Q100 para crear una cuenta."
            });
        }

        // Encriptar la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        // Crear el Usuario
        const newUser = await User.create(data, { transaction: t });

        // Generar No. Cuenta aleatorio de 10 dígitos
        const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Crear la Cuenta automáticamente vinculada al nuevo Usuario
        await Account.create({
            numero_cuenta: randomAccountNumber,
            nombre_cuenta: `Cuenta Principal - ${newUser.nombre} ${newUser.apellido}`,
            tipo_cuenta: data.tipo_cuenta || "AHORRO",
            balance: 0.00,
            usuario_id: newUser.id
        }, { transaction: t });

        // Confirmar cambios en la base de datos
        await t.commit();

        res.status(201).json({
            success: true,
            message: "Cliente creado exitosamente con su número de cuenta",
            accountNumber: randomAccountNumber
        });

    } catch (error) {
        // Si algo falla (ej: DPI duplicado), deshace todo
        await t.rollback();
        res.status(500).json({
            success: false,
            message: "Error al registrar el cliente y su cuenta",
            error: error.message
        });
    }
};

// 2. Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        // Incluimos la cuenta para ver el saldo como pide el requerimiento
        const users = await User.findAll({
            where: { active: true },
            include: [{ model: Account }]
        });
        res.status(200).json({
            success: true,
            total: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

// 3. Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: [{ model: Account }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Obtenemos los IDs de las cuentas del usuario para buscar sus movimientos
        const accountIds = user.accounts.map(acc => acc.id);

        // REQUERIMIENTO: Últimos 5 movimientos de Transferencias
        const lastMovements = await Transfer.findAll({
            where: {
                [Op.or]: [
                    { account_origin_id: { [Op.in]: accountIds } },
                    { account_destination_id: { [Op.in]: accountIds } }
                ]
            },
            limit: 5,
            order: [['date', 'DESC']],
            include: [
                { model: Account, as: 'Origin', attributes: ['numero_cuenta'] },
                { model: Account, as: 'Destination', attributes: ['numero_cuenta'] }
            ]
        });

        res.status(200).json({
            success: true,
            user,
            lastMovements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el usuario",
            error: error.message
        });
    }
};

// 4. Actualizar usuario 
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { dpi, password, role_id, active, username, ...restOfData } = req.body; // Extraemos para ignorarlos

        const [affectedCount] = await User.update(restOfData, {
            where: { id }
        });

        if (affectedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado o no hubo cambios permitidos"
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario actualizado"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: error.message
        });
    }
};

// "Eliminar" usuario (Desactivación Lógica)
export const deleteUser = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;

        // 1. Desactivamos al Usuario
        const user = await User.findByPk(id);
        if (!user) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        await user.update({ active: false }, { transaction: t });

        // 2. Desactivamos TODAS sus cuentas asociadas
        await Account.update(
            { estado: "INACTIVA" },
            { where: { usuario_id: id }, transaction: t }
        );

        await t.commit();
        res.status(200).json({
            success: true,
            message: "Usuario y cuentas desactivados correctamente (Los datos se conservan por auditoría)"
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: "Error al desactivar el usuario",
            error: error.message
        });
    }
};

// 6. Agregar una cuenta adicional a un usuario existente
export const addExtraAccount = async (req, res) => {
    try {
        const { usuario_id, tipo_cuenta } = req.body;

        // 1. Verificar si el usuario existe
        const user = await User.findByPk(usuario_id);
        if (!user || !user.active) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado o inactivo."
            });
        }

        // 2. Generar No. Cuenta aleatorio único
        const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // 3. Crear la nueva cuenta vinculada al ID del usuario
        const newAccount = await Account.create({
            numero_cuenta: randomAccountNumber,
            nombre_cuenta: `Cuenta - ${user.nombre} ${user.apellido}`,
            tipo_cuenta: tipo_cuenta || "AHORRO",
            balance: 0.00,
            usuario_id: user.id // Aquí es donde se hace el vínculo
        });

        res.status(201).json({
            success: true,
            message: "Nueva cuenta asignada al cliente correctamente",
            account: newAccount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al agregar la cuenta adicional",
            error: error.message
        });
    }
};