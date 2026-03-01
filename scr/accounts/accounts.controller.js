`use strict`

import { Account } from "./accounts.model.js"


// Funciones de administrador

// Obtener todas las cuentas (GET)
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.status(200).json({
            success: true,
            total: accounts.length,
            accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener cuentas",
            error: error.message
        });
    }
};

// Obtener cuenta por ID (GET) 
// la pk debe ser el no de cuenta
// este deberia ser por numero de cuenta y se deberia de crear en automatico y aleatorio con 10 numeros de longitud
export const getAccountByNumber = async (req, res) => {
    try {
        const { numero_cuenta } = req.params;
        const account = await Account.findOne({ where: { numero_cuenta } });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Cuenta no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            account
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al buscar la cuenta",
            error: error.message
        })
    }
}


// Actualizar (PUT)
export const updateAccount = async (req, res) => {
    try {
        const { numero_cuenta } = req.params;
        const { nombre_cuenta, tipo_cuenta, estado, balance } = req.body;

        const { updateRows } = await Account.update(
            { nombre_cuenta, tipo_cuenta, estado, balance },
            { where: { numero_cuenta } }
        );

        if (updateRows === 0) {
            return res.status(404).json({
                succes: false,
                message: "Cuenta no encontrada o no hubo cambios"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cuenta actualizada exitosamente"
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
export const deleteAccount = async (req, res) => {
    try {
        const { numero_cuenta } = req.params;

        const deleteRows = await Account.destroy({
            where: { numero_cuenta }
        });

        if (deleteRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Cuenta no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cuenta eliminada permanentemente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la cuenta",
            error: error.message
        });
    }
}