'use strict';

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Product = db.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    },
}, {
    timestamps: true,
    tableName: 'products',
})