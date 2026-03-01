`use strict`

import { Deposit } from "./deposits.model.js"
import { Account } from "../accounts/accounts.model.js";
import { db } from "../../configs/db.js";


// Funciones de administrador

// Obtener todos los depósitos (GET)
export const getDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.findAll();
        res.status(200).json({
            success: true,
            total: deposits.length,
            deposits
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener depósitos",
            error: error.message
        });
    }
};

// Obtener depósito por ID (GET)
export const getDepositById = async (req, res) => {
    try {
        const { id } = req.params;
        const deposit = await Deposit.findByPk(id);

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: "Depósito no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            deposit
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al buscar el depósito",
            error: error.message
        })
    }
}

export const makeDeposit = async (req, res) => {
    const t = await db.transaction();
    try {
        const { numero_cuenta, monto } = req.body;

        // 1. Validar que el monto sea positivo
        if (parseFloat(monto) <= 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "El monto debe ser mayor a 0" });
        }

        // 2. Buscar la cuenta por su número 
        const account = await Account.findOne({ where: { numero_cuenta } });
        if (!account) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Cuenta bancaria no encontrada" });
        }

        // 3. Crear el registro en la tabla de 'deposits'
        const newDeposit = await Deposit.create({
            cuenta_id: account.id,
            monto: monto,
            estado: "COMPLETADO"
        }, { transaction: t });

        // 4. Actualizar el balance de la cuenta sumando el monto
        const nuevoBalance = parseFloat(account.balance) + parseFloat(monto);
        await account.update({ balance: nuevoBalance }, { transaction: t });

        // 5. Confirmar todo
        await t.commit();

        res.status(200).json({
            success: true,
            message: "Depósito realizado exitosamente",
            data: {
                deposito_id: newDeposit.id,
                cuenta: account.numero_cuenta,
                monto_depositado: monto,
                nuevo_balance: nuevoBalance
            }
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: "Error al procesar el depósito",
            error: error.message
        });
    }
};