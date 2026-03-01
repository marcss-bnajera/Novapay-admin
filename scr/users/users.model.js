`use strict`

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";
import { Role } from "../roles/roles.model.js"; //Modelo de roles

export const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    dpi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    nit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombre_trabajo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ingresos_mensuales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'users',
});
// Un Rol tiene muchos Usuarios
Role.hasMany(User, { foreignKey: 'role_id' });
// Un Usuario pertenece a un Rol
User.belongsTo(Role, { foreignKey: 'role_id' });