`use strict`

import { Transfer } from "./transfers.model.js"

// Funciones de administrador

// Obtener todas las transferencias (GET)
export const getTransfers = async (req, res) => {
    try {
        const transfer = await Transfer.findAll();
        res.status(200).json({
            success: true,
            total: transfer.length,
            transfer
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las transferencias",
            error: error.message
        })
    }
};

// Obtener transferencia por ID (GET)
export const getTransferById = async (req, res) => {
    try {
        const { id } = req.params;
        const transfer = await Transfer.findByPk(id);
        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: "Transferencia no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            transfer
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la transferencia",
            error: error.message
        })
    }
};

// Misma logca, actualizar y eliminar tienen que ser una sola que sea cancelar y devuelva el monto y motivo
// Actualizar transferencia (PUT)
export const updateTransfer = async (req, res) => {
    try {
        const { id } = req.params;
        const transferData = req.body;
        const [updateTransfer] = await Transfer.update(transferData, {
            where: { id }
        });
        if (updateTransfer === 0) {
            return res.status(404).json({
                success: false,
                message: "Transferencia no encontrada o no hubo cambios"
            });
        }
        res.status(200).json({
            success: true,
            message: "Transferencia actualizada exitosamente"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la transferencia",
            error: error.message
        })
    }
};

// Eliminar transferencia (DELETE)
export const deleteTransfer = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteRows = await Transfer.destroy({
            where: { id }
        });
        if (deleteRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Transferencia no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            message: "Transferencia eliminada permanentemente"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la transferencia",
            error: error.message
        })
    }
};
