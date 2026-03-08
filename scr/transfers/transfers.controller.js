`use strict`

import { Transfer } from "./transfers.model.js";
import { Account } from "../accounts/accounts.model.js";
import { Op } from "sequelize";

// Obtener todas las transferencias del sistema
export const getAllTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.findAll({
            include: [
                {
                    model: Account,
                    as: 'Origin',
                    attributes: ['numero_cuenta', 'nombre_cuenta']
                },
                {
                    model: Account,
                    as: 'Destination',
                    attributes: ['numero_cuenta', 'nombre_cuenta']
                }
            ],
            order: [['date', 'DESC']] // Ver las más recientes primero
        });

        res.status(200).json({
            success: true,
            total: transfers.length,
            transfers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el historial global",
            error: error.message
        });
    }
};

// Ver transferencias de una cuenta específica (Auditoría)
export const getTransfersByAccount = async (req, res) => {
    try {
        const { id_cuenta } = req.params;
        const transfers = await Transfer.findAll({
            where: {
                [Op.or]: [
                    { account_origin_id: id_cuenta },
                    { account_destination_id: id_cuenta }
                ]
            },
            include: [
                { model: Account, as: 'Origin', attributes: ['numero_cuenta'] },
                { model: Account, as: 'Destination', attributes: ['numero_cuenta'] }
            ]
        });

        res.status(200).json({ success: true, transfers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};