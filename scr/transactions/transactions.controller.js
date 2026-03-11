'use strict'

import { Transaction } from "./transactions.model.js";
import { Account } from "../accounts/accounts.model.js";

export const getTransactions = async (req, res) => {
    try {

        const transactions = await Transaction.findAll({
            include: [
                {
                    model: Account,
                    attributes: ["numero_cuenta"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            success: true,
            total: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching transactions",
            error: error.message
        });
    }
};

export const getTransactionById = async (req, res) => {
    try {

        const { id } = req.params;

        const transaction = await Transaction.findByPk(id, {
            include: [
                {
                    model: Account,
                    attributes: ["numero_cuenta"]
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching transaction",
            error: error.message
        });
    }
};