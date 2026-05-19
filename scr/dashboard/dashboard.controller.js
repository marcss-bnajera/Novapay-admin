`use strict`

import { Account } from "../accounts/accounts.model.js";
import { Transfer } from "../transfers/transfers.model.js";
import { User } from "../users/users.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalAccounts = await Account.count();
        const activeAccounts = await Account.count({ where: { estado: 'ACTIVA' } });
        const inactiveAccounts = await Account.count({ where: { estado: 'INACTIVA' } });
        const totalMoneyInBank = await Account.sum('balance') || 0;
        const totalTransfers = await Transfer.count();

        const recentTransfers = await Transfer.findAll({
            limit: 5,
            //  CORRECCIÓN: 'Transfer' no tiene timestamps, usamos su columna real 'date'
            order: [['date', 'DESC']],
            include: [{
                model: Account,
                as: 'Origin',
                // Ahora que confirmamos tu modelo, estos campos son 100% válidos
                attributes: ['numero_cuenta', 'nombre_cuenta']
            }]
        });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAccounts,
                activeAccounts,
                inactiveAccounts,
                totalMoneyInBank: parseFloat(totalMoneyInBank).toFixed(2),
                totalTransfers
            },
            recentTransfers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al generar las estadísticas del dashboard",
            error: error.message
        });
    }
};