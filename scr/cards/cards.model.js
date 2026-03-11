'use strict'

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Card = db.define('card', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    numero_tarjeta: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true
    },

    cvv: {
        type: DataTypes.STRING(3),
        allowNull: false
    },

    fecha_expiracion: {
        type: DataTypes.STRING,
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING,
        defaultValue: "ACTIVA"
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'id'
        }
    }

}, {
    timestamps: true,
    tableName: "cards"
});