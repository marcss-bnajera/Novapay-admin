'use strict';

import { Shopping } from "./shoppings.model.js";
import { Account } from "../accounts/accounts.model.js";
import { Product } from "../products/products.model.js";
import { db } from "../../configs/db.js";

// Obtener todas las compras (GET)
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

// Obtener una compra por ID (GET)
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
// Agregar un nuevo Shopping (POST) - Para pruebas del Admin
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
// Actualizar (PUT)
export const updateShopping = async (req, res) => {
    try {
        const { id } = req.params;
        const { cuenta_id, producto_id, monto, fecha, estado, motivo_anulacion } = req.body;

        const shopping = await Shopping.findByPk(id);

        if (!shopping) {
            return res.status(404).json({
                success: false,
                message: "Compra no encontrada"
            });
        }

        await shopping.update({
            cuenta_id,
            producto_id,
            monto,
            fecha,
            estado,
            motivo_anulacion
        });

        res.status(200).json({
            success: true,
            message: "Compra actualizada exitosamente",
            shopping
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la compra",
            error: error.message
        });
    }
};

// Eliminar (DELETE) -> Convertido a ANULACIÓN CON REEMBOLSO
// Seguimos la lógica de depósitos: usamos transacciones para devolver el dinero
export const deleteShopping = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const shopping = await Shopping.findByPk(id);

        if (!shopping) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Compra no encontrada"
            });
        }

        if (shopping.estado === 'ANULADO') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: "Esta compra ya ha sido anulada previamente"
            });
        }


        const account = await Account.findByPk(shopping.cuenta_id);
        if (!account) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Cuenta asociada a la compra no encontrada"
            });
        }


        const nuevoBalance = parseFloat(account.balance) + parseFloat(shopping.monto);
        await account.update({ balance: nuevoBalance }, { transaction: t });


        await shopping.update({
            estado: 'ANULADO',
            motivo_anulacion: motivo || "Anulado por el Administrador"
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            message: "Compra anulada y monto reembolsado exitosamente",
            detalle: {
                monto_devuelto: shopping.monto,
                nuevo_balance_cuenta: nuevoBalance
            }
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: "Error al procesar la anulación de la compra",
            error: error.message
        });
    }
};