'use strict'

import { Passbook } from "./passbooks.model.js";
import { Account } from "../accounts/accounts.model.js";

const TIPOS_VALIDOS = ['AHORRO', 'CORRIENTE', 'PLAZO_FIJO', 'INFANTIL'];

const generatePassbookNumber = () => {
    let number = '';
    for (let i = 0; i < 12; i++) number += Math.floor(Math.random() * 10);
    return number;
};

export const createPassbook = async (req, res) => {
    try {
        const { numero_cuenta, tipo_libreta = 'AHORRO' } = req.body;

        if (!TIPOS_VALIDOS.includes(tipo_libreta)) {
            return res.status(400).json({
                success: false,
                message: `Tipo de libreta inválido. Opciones: ${TIPOS_VALIDOS.join(', ')}`
            });
        }

        const account = await Account.findOne({ where: { numero_cuenta } });
        if (!account) {
            return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
        }

        // Una cuenta solo puede tener una libreta de cada tipo
        const existing = await Passbook.findOne({
            where: { account_id: account.id, tipo_libreta }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Esta cuenta ya tiene una libreta de tipo ${tipo_libreta}`
            });
        }

        const passbook = await Passbook.create({
            numero_libreta: generatePassbookNumber(),
            tipo_libreta,
            account_id: account.id
        });

        const fullPassbook = await Passbook.findByPk(passbook.id, {
            include: [{ model: Account, attributes: ['numero_cuenta'] }]
        });

        return res.status(201).json({ success: true, passbook: fullPassbook });

    } catch (error) {
        console.error("DETALLE DEL ERROR 500:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el servidor",
            details: error.message
        });
    }
};

export const getPassbooks = async (req, res) => {
    try {
        const passbooks = await Passbook.findAll({
            include: [{ model: Account, attributes: ['numero_cuenta', 'nombre_cuenta'] }],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ success: true, total: passbooks.length, passbooks });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching passbooks", error: error.message });
    }
};

export const getPassbookByAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const passbook = await Passbook.findOne({ where: { account_id: id } });
        return res.status(200).json({ success: true, passbook });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching passbook", error: error.message });
    }
};

export const deletePassbook = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Passbook.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ success: false, message: "Libreta no encontrada" });
        return res.status(200).json({ success: true, message: "Libreta eliminada" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting passbook", error: error.message });
    }
};

export const updatePassbook = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ESTADOS_VALIDOS = ['ACTIVA', 'INACTIVA', 'BLOQUEADA'];
        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado inválido. Opciones: ${ESTADOS_VALIDOS.join(', ')}`
            });
        }

        const passbook = await Passbook.findByPk(id);
        if (!passbook) return res.status(404).json({ success: false, message: "Libreta no encontrada" });

        passbook.estado = estado;
        await passbook.save();

        return res.status(200).json({ success: true, message: "Estado actualizado", passbook });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al actualizar", error: error.message });
    }
};