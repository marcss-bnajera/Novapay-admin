`use strict`

import { Currency } from "./currencies.model.js"

// Funciones de administrador

// Ver todas (GET)
export const getCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.findAll();
        res.status(200).json({
            success: true,
            total: currencies.length,
            currencies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching currencies",
            error: error.message
        });
    }
};

// Agregar (POST)
export const createCurrency = async (req, res) => {
    try {
        const { currency, symbol, rate } = req.body;

        await Currency.create({
            currency,
            symbol,
            rate
        });

        res.status(201).json({
            success: true,
            message: "Currency created"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating currency",
            error: error.message
        });
    }
};

// Editar (PUT)
export const updateCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const { currency, symbol, rate } = req.body;

        const [updatedRows] = await Currency.update(
            { currency, symbol, rate },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Currency not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Currency updated"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating currency",
            error: error.message
        });
    }
};

// Eliminar (DELETE)
export const deleteCurrency = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await Currency.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Currency not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Currency deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting currency",
            error: error.message
        });
    }
};