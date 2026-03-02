`use strict`

import { Currency } from "./currencies.model.js";

// Ver todas (GET)
export const getCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.findAll();
        return res.status(200).json({
            success: true,
            total: currencies.length,
            currencies
        });
    } catch (error) {
        console.error("Error en getCurrencies:", error);
        return res.status(500).json({
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

        if (!currency || !symbol || !rate) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const newCurrency = await Currency.create({ currency, symbol, rate });

        return res.status(201).json({
            success: true,
            message: "Currency created",
            newCurrency
        });
    } catch (error) {
        console.error("Error en createCurrency:", error);
        return res.status(500).json({
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
            return res.status(404).json({ success: false, message: "Currency not found" });
        }

        return res.status(200).json({ success: true, message: "Currency updated" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating currency", error: error.message });
    }
};

// Eliminar (DELETE)
export const deleteCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Currency.destroy({ where: { id } });

        if (deletedRows === 0) {
            return res.status(404).json({ success: false, message: "Currency not found" });
        }

        return res.status(200).json({ success: true, message: "Currency deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting currency", error: error.message });
    }
};