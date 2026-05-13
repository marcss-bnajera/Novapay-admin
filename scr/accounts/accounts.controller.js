`use strict`

import { Account } from "./accounts.model.js"

import { db } from "../../configs/db.js";
import { Transfer } from "../transfers/transfers.model.js";



// Funciones de administrador

// Obtener todas las cuentas (GET)
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.status(200).json({
            success: true,
            total: accounts.length,
            accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener cuentas",
            error: error.message
        });
    }
};

export const getAccountsByActivity = async (req, res) => {
    try {
        const { order = 'DESC' } = req.query;

        const activity = await Transfer.findAll({
            attributes: [
                'account_origin_id',
                [db.fn('COUNT', db.col('account_origin_id')), 'total_movimientos']
            ],
            include: [{
                model: Account,
                as: 'Origin',
                attributes: ['id', 'numero_cuenta', 'nombre_cuenta']
            }],
            group: [
                'transfer.account_origin_id',
                'Origin.id',
                'Origin.numero_cuenta',
                'Origin.nombre_cuenta'
            ],
            order: [[db.literal('total_movimientos'), order]],
        });

        res.status(200).json({ success: true, activity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Obtener cuenta por ID (GET) 
// la pk debe ser el no de cuenta
// este deberia ser por numero de cuenta y se deberia de crear en automatico y aleatorio con 10 numeros de longitud
export const getAccountByNumber = async (req, res) => {
    try {
        const { numero_cuenta } = req.params;
        const account = await Account.findOne({ where: { numero_cuenta } });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Cuenta no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            account
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al buscar la cuenta",
            error: error.message
        })
    }
}


// Actualizar (PUT)
export const updateAccount = async (req, res) => {
    try {
        const { numero_cuenta } = req.params;
        const { nombre_cuenta, tipo_cuenta, estado, balance } = req.body;

        const { updateRows } = await Account.update(
            { nombre_cuenta, tipo_cuenta, estado, balance },
            { where: { numero_cuenta } }
        );

        if (updateRows === 0) {
            return res.status(404).json({
                succes: false,
                message: "Cuenta no encontrada o no hubo cambios"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cuenta actualizada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar ",
            error: error.message
        });
    }
};

// Eliminar (DELETE)
export const deleteAccount = async (req, res) => {
    try {
        const { numero_cuenta } = req.params;

        const account = await Account.findOne({ where: { numero_cuenta } });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Cuenta no encontrada"
            });
        }

        // Verificar si tiene saldo
        if (parseFloat(account.balance) > 0) {
            return res.status(400).json({
                success: false,
                message: `No se puede cerrar la cuenta. Tiene un saldo de Q${parseFloat(account.balance).toFixed(2)}. El cliente debe retirar o transferir el dinero antes de cerrar la cuenta.`,
                balance: account.balance
            });
        }

        // Si saldo es 0, cerrar la cuenta (soft delete)
        await account.update({ estado: "INACTIVA" });

        res.status(200).json({
            success: true,
            message: "Cuenta cerrada correctamente (Los datos se conservan por auditoría)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al cerrar la cuenta",
            error: error.message
        });
    }
};