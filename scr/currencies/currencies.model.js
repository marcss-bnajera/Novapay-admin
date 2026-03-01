`use strict`

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js"

export const Currency = db.define('currency', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0000
    }
}, {
    timestamps: true,
    tableName: 'currencies',
});