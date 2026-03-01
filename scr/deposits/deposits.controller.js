`use strict`

import { Deposit } from "./deposits.model.js"

// Funciones de administrador

// Obtener todos los depósitos (GET)
export const getDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.findAll();
        res.status(200).json({
            success: true,
            total: deposits.length,
            deposits
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener depósitos",
            error: error.message
        });
    }
};

// Obtener depósito por ID (GET)
export const getDepositById = async (req, res) => {
    try {
        const { id } = req.params;
        const deposit = await Deposit.findByPk(id);

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: "Depósito no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            deposit
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al buscar el depósito",
            error: error.message
        })
    }
}

// Actualizar (PUT)
// Unificar logica de update - Delete para una sola 
export const updateDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto, estado } = req.body;

        const { updateRows } = await Deposit.update(
            { monto, estado },
            { where: { id } }
        );

        if (updateRows === 0) {
            return res.status(404).json({
                succes: false,
                message: "Depósito no encontrado o no hubo cambios"
            });
        }

        res.status(200).json({
            success: true,
            message: "Depósito actualizado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar ",
            error: error.message
        });
    }
};

// Eliminar (DELETE)
// este no deberia de existir pero deberia de ser una accion estilo anular deposito y debe tener una razon
export const deleteDeposit = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteRows = await Deposit.destroy({
            where: { id }
        });

        if (deleteRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Depósito no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Depósito eliminado permanentemente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el depósito",
            error: error.message
        });
    }
}