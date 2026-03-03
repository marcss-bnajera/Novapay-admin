'use strict';

import { Shopping } from "./shoppings.model.js";
import { Account } from "../accounts/accounts.model.js";
import { Product } from "../products/products.model.js";
import { db } from "../../configs/db.js";


//GET Listado de compras
export const getShoppings = async (req, res) => {
    try {
        const shoppings = await Shopping.findAll({
            include: [
                { model: Account, attributes: ['numero_cuenta'] },
                { model: Product, attributes: ['name', 'price'] }
            ]
        });
        res.status(200).json({
            success: true,
            total: shoppings.length,
            shoppings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las compras",
            error: error.message
        });
    }
};

//GET Buscar una compra por su id
export const getShoppingById = async (req, res) => {
    try {
        const { id } = req.params;
        const shopping = await Shopping.findByPk(id, {
            include: [
                { model: Account, attributes: ['numero_cuenta'] },
                { model: Product, attributes: ['name'] }
            ]
        });

        if (!shopping) {
            return res.status(404).json({
                success: false,
                message: "Compra no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            shopping
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar la compra",
            error: error.message
        });
    }
};

//POST Crear un registro manual
export const saveShopping = async (req, res) => {
    try {
        const { cuenta_id, producto_id, monto } = req.body;

        const newShopping = await Shopping.create({
            cuenta_id,
            producto_id,
            monto,
            estado: 'COMPLETADO'
        });

        res.status(201).json({
            success: true,
            message: "Compra registrada exitosamente",
            newShopping
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al registrar la compra",
            error: error.message
        });
    }
};

// --- MEJORAS Y NUEVOS REQUERIMIENTOS ---

// PUT / PATCH Editar datos o Anular devolviendo dinero
export const updateShopping = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const { estado, motivo_anulacion } = req.body;

        const shopping = await Shopping.findByPk(id);
        if (!shopping) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Compra no encontrada" });
        }


        if (estado === 'ANULADO' && shopping.estado !== 'ANULADO') {
            const account = await Account.findByPk(shopping.cuenta_id);
            if (account) {
                const nuevoBalance = parseFloat(account.balance) + parseFloat(shopping.monto);
                await account.update({ balance: nuevoBalance }, { transaction: t });
            }
        }

        await shopping.update(req.body, { transaction: t });
        await t.commit();

        res.status(200).json({
            success: true,
            message: "Compra gestionada exitosamente",
            shopping
        });
    } catch (error) {
        if (t) await t.rollback();
        res.status(500).json({ success: false, message: "Error en la gestión", error: error.message });
    }
};

//GET Ver los ultimos 5 movimientos de una cuenta
export const getLatestMovements = async (req, res) => {
    try {
        const { cuenta_id } = req.params;
        const movements = await Shopping.findAll({
            where: { cuenta_id },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Product, attributes: ['name'] }]
        });

        res.status(200).json({
            success: true,
            count: movements.length,
            history: movements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener historial", error: error.message });
    }
};

//DELETE Eliminar una compra con rembolso
export const deleteShopping = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const shopping = await Shopping.findByPk(id);

        if (!shopping || shopping.estado === 'ANULADO') {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Compra no encontrada o ya anulada" });
        }

        const account = await Account.findByPk(shopping.cuenta_id);
        const nuevoBalance = parseFloat(account.balance) + parseFloat(shopping.monto);

        await account.update({ balance: nuevoBalance }, { transaction: t });
        await shopping.update({
            estado: 'ANULADO',
            motivo_anulacion: motivo || "Anulado por el Administrador"
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            message: "Compra anulada y reembolso aplicado",
            nuevo_balance: nuevoBalance
        });
    } catch (error) {
        if (t) await t.rollback();
        res.status(500).json({ success: false, error: error.message });
    }
};