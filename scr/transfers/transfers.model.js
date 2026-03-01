`use strict`

import { DataTypes } from "sequelize"
import { db } from "../../configs/db.js"
import { Account } from "../accounts/accounts.model.js"

export const Transfer = db.define('transfer', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    account_origin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: 'id'
        },
    },
    account_destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: 'id'
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }

}, {
    timestamps: false,
    tableName: 'transfers'
});
Transfer.belongsTo(Account, { as: 'Origin', foreignKey: 'account_origin_id' });
Transfer.belongsTo(Account, { as: 'Destination', foreignKey: 'account_destination_id' });