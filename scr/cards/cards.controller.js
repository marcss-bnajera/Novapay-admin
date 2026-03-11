'use strict'

import { Card } from "./cards.model.js";

const generateCardNumber = () => {
    let number = '';
    for (let i = 0; i < 16; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
}

const generateExpiration = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
}

export const createCard = async (req, res) => {
    try {

        const { account_id } = req.body;

        const card = await Card.create({
            numero_tarjeta: generateCardNumber(),
            cvv: generateCVV(),
            fecha_expiracion: generateExpiration(),
            account_id
        });

        return res.status(201).json({
            success: true,
            message: "Tarjeta creada correctamente",
            card
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error creating card",
            error: error.message
        });

    }
}

export const getCardsByAccount = async (req, res) => {

    try {
        const { id } = req.params;

        const cards = await Card.findAll({
            where: { account_id: id }
        });

        return res.status(200).json({
            success: true,
            total: cards.length,
            cards
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching cards",
            error: error.message
        });

    }

}