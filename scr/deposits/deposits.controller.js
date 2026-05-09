'use strict'

import { Deposit } from "./deposits.model.js";
import { Account } from "../accounts/accounts.model.js";
import { Transaction } from "../transactions/transactions.model.js";
import { db } from "../../configs/db.js";

export const getDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.findAll({
            include: [{ model: Account, attributes: ['numero_cuenta', 'nombre_cuenta'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, total: deposits.length, deposits });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener depósitos", error: error.message });
    }
};

export const makeDeposit = async (req, res) => {

    const t = await db.transaction();

    try {

        const { numero_cuenta, monto } = req.body;

        if (parseFloat(monto) <= 0) {
            await t.rollback();
            return res.status(400).json({ message: "Monto inválido" });
        }

        const account = await Account.findOne({
            where: { numero_cuenta }
        });

        if (!account) {
            await t.rollback();
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        const newBalance = parseFloat(account.balance) + parseFloat(monto);

        const deposit = await Deposit.create({
            cuenta_id: account.id,
            monto
        }, { transaction: t });

        await account.update({
            balance: newBalance
        }, { transaction: t });

        await Transaction.create({
            account_id: account.id,
            type: "deposit",
            amount: monto,
            description: "Depósito en cuenta",
            balance_after: newBalance
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            deposit,
            newBalance
        });

    } catch (error) {

        await t.rollback();

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};