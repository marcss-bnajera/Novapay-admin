'use strict';

import { Shopping } from "./shoppings.model.js";

// Funciones de administrador

//Obtener todas las compras (GET)
export const getShoppings = async (req, res) => {
    try {
        const shoppings = await Shopping.findAll();
        res.status(200).json(
            {
                success: true,
                total: shoppings.length,
                shoppings
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error al obtener las compras",
                error: error.message
            }
        );
    }
};

//Obtener una compra por ID (GET)
export const getShoppingById = async (req, res) => {
    try {
        const { id } = req.params;
        const shopping = await Shopping.findByPk(id);

        if (!shopping) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Compra no encontrada"
                }
            );
        }

        res.status(200).json(
            {
                success: true,
                shopping
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error al buscar la compra",
                error: error.message
            }
        );
    }
};

//Actualizar (PUT)
// Misma logica de depositos, se debe juntar con delete
export const updateShopping = async (req, res) => {
    try {
        const { id } = req.params;
        const { cuenta_id, producto_id, monto, fecha } = req.body;

        const shopping = await Shopping.findByPk(id);

        if (!shopping) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Compra no encontrada"
                }
            );
        }

        await shopping.update({
            cuenta_id,
            producto_id,
            monto,
            fecha
        });

        res.status(200).json(
            {
                success: true,
                message: "Compra actualizada exitosamente",
                shopping
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error al actualizar la compra",
                error: error.message
            }
        );
    }
};

//Eliminar (DELETE)
export const deleteShopping = async (req, res) => {
    try {
        const { id } = req.params;

        const shopping = await Shopping.findByPk(id);

        if (!shopping) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Compra no encontrada"
                }
            );
        }

        await shopping.destroy();

        res.status(200).json(
            {
                success: true,
                message: "Compra eliminada exitosamente"
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error al eliminar la compra",
                error: error.message
            }
        );
    }
};
