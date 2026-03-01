`use strict`

import { Transaction } from "./transactions.model.js";

// Funciones de administrador

/* 
RECORDAR QUE ESTE ES UN ENDPOINT QUE DEBE MOSTRAR EL 
HISTORIAL DE TODO LO QUE SE A HECHO EN LA PLATAFORMA TANTO PARA
ADMIN COMO USUARIO DEBEN TENER LA LOGICA DE SOLO GET Y TIENE QUE 
ESTAR RELACIONADA CON TODAS LAS DEMAS
DEPOSITOS, RETIROS, COMPRAS, TRANSFERENCIAS, ETC 
*/

// Ver todas (GET)
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json({ success: true, total: transactions.length, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
    }
};

// Ver por ID (GET)
export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);
        if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
        res.status(200).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error searching transaction", error: error.message });
    }
};

