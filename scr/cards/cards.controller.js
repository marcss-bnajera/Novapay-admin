'use strict'

import { Card } from "./cards.model.js";
import { Account } from "../accounts/accounts.model.js";

const NOVAPAY_BIN = '490001'; // Identificador del emisor NovaPay (6 dígitos)

const luhnCheckDigit = (partial) => {
    let sum = 0;
    let alternate = true; // el último dígito del parcial se dobla
    for (let i = partial.length - 1; i >= 0; i--) {
        let n = parseInt(partial[i], 10);
        if (alternate) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        alternate = !alternate;
    }
    return ((10 - (sum % 10)) % 10).toString();
};

const generateCardNumber = (accountId) => {
    const accountPart = String(accountId).padStart(9, '0').slice(-9);
    const partial = NOVAPAY_BIN + accountPart;
    return partial + luhnCheckDigit(partial);
};

const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();

const generateExpiration = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${mm}/${yy}`;
};

export const createCard = async (req, res) => {
    try {
        const { numero_cuenta } = req.body;

        const account = await Account.findOne({ where: { numero_cuenta } });
        if (!account) {
            return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
        }

        const card = await Card.create({
            numero_tarjeta: generateCardNumber(account.id),
            cvv: generateCVV(),
            fecha_expiracion: generateExpiration(),
            account_id: account.id
        });

        return res.status(201).json({ success: true, message: "Tarjeta creada correctamente", card });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating card", error: error.message });
    }
};

export const getCards = async (req, res) => {
    try {
        const cards = await Card.findAll({
            include: [{ model: Account, attributes: ['numero_cuenta', 'nombre_cuenta'] }],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ success: true, total: cards.length, cards });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching cards", error: error.message });
    }
};

export const getCardsByAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const cards = await Card.findAll({ where: { account_id: id } });
        return res.status(200).json({ success: true, total: cards.length, cards });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching cards", error: error.message });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Card.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ success: false, message: "Tarjeta no encontrada" });
        return res.status(200).json({ success: true, message: "Tarjeta eliminada" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting card", error: error.message });
    }
};
