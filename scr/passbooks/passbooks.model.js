'use strict'

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";

export const Passbook = db.define('passbook', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    numero_libreta: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true
    },

    fecha_emision: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
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
    tableName: "passbooks"
});