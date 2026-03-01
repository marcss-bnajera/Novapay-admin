`use strict`

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js"
import { User } from "../users/users.model.js";

export const Account = db.define('account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    numero_cuenta: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre_cuenta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_cuenta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ACTIVA"
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'accounts',
});