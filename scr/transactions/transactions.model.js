'use strict'

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";
import { Account } from "../accounts/accounts.model.js";

export const Transaction = db.define('transaction', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: "id"
        }
    },

    type: {
        type: DataTypes.ENUM(
            "deposit",
            "withdraw",
            "transfer_in",
            "transfer_out"
        ),
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    reference_account_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    description: {
        type: DataTypes.STRING
    },

    balance_after: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }

}, {
    timestamps: true,
    tableName: "transactions"
});

Account.hasMany(Transaction, { foreignKey: "account_id" });
Transaction.belongsTo(Account, { foreignKey: "account_id" });