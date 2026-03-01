`use strict`

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";
import { Account } from "../accounts/accounts.model.js";

export const Deposit = db.define('deposit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cuenta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: 'id'
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "COMPLETADO"
    }
}, {
    timestamps: true,
    tableName: 'deposits',
});

// Relaciones
Account.hasMany(Deposit, { foreignKey: 'cuenta_id' });
Deposit.belongsTo(Account, { foreignKey: 'cuenta_id' });