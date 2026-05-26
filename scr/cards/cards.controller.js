'use strict'

import { Card } from "./cards.model.js";
import { Account } from "../accounts/accounts.model.js";

// BIN distinto por tipo de tarjeta (6 dígitos identificadores del emisor NovaPay)
const BINS = {
    DEBITO:  '490001',
    CREDITO: '490002',
    PREPAGO: '490003',
    VIRTUAL: '490004',
};

const TIPOS_VALIDOS = ['DEBITO', 'CREDITO', 'PREPAGO', 'VIRTUAL'];

const luhnCheckDigit = (partial) => {
    let sum = 0;
    let alternate = true;
    for (let i = partial.length - 1; i >= 0; i--) {
        let n = parseInt(partial[i], 10);
        if (alternate) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        alternate = !alternate;
    }
    return ((10 - (sum % 10)) % 10).toString();
};

const generateCardNumber = (accountId, tipo) => {
    const bin = BINS[tipo] || BINS.DEBITO;
    const accountPart = String(accountId).padStart(9, '0').slice(-9);
    const partial = bin + accountPart;
    return partial + luhnCheckDigit(partial);
};

const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();

const generateExpiration = (tipo) => {
    const date = new Date();
    // Crédito dura 3 años, el resto 5 años
    date.setFullYear(date.getFullYear() + (tipo === 'CREDITO' ? 3 : 5));
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${mm}/${yy}`;
};

export const createCard = async (req, res) => {
    try {
        const { numero_cuenta, tipo_tarjeta = 'DEBITO' } = req.body;

        if (!TIPOS_VALIDOS.includes(tipo_tarjeta)) {
            return res.status(400).json({
                success: false,
                message: `Tipo de tarjeta inválido. Opciones: ${TIPOS_VALIDOS.join(', ')}`
            });
        }

        const account = await Account.findOne({ where: { numero_cuenta } });
        if (!account) {
            return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
        }

        // Verificar que la cuenta no tenga ya una tarjeta del mismo tipo
        const existingCard = await Card.findOne({
            where: { account_id: account.id, tipo_tarjeta }
        });
        if (existingCard) {
            return res.status(400).json({
                success: false,
                message: `Esta cuenta ya tiene una tarjeta de tipo ${tipo_tarjeta}`
            });
        }

        const card = await Card.create({
            numero_tarjeta: generateCardNumber(account.id, tipo_tarjeta),
            cvv: generateCVV(),
            fecha_expiracion: generateExpiration(tipo_tarjeta),
            tipo_tarjeta,
            account_id: account.id
        });

        return res.status(201).json({ success: true, message: "Tarjeta creada correctamente", card });

    } catch (error) {
        console.log("DETALLE DEL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating card",
            error: error.errors ? error.errors.map(e => e.message) : error.message
        });
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

export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const card = await Card.findByPk(id);
        if (!card) return res.status(404).json({ success: false, message: "Tarjeta no encontrada" });

        card.estado = estado;
        await card.save();

        return res.status(200).json({ success: true, message: "Estado actualizado", card });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al actualizar", error: error.message });
    }
};