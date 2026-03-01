`use strict`

import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js"

export const Role = db.define('role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    // Agrega createdAt y updatedAt automaticamente 
    // (opcional es solo de muestra pq sirve para otros)
    timestamps: true,
    // Aseguramos el nombre de la tabla en Postgres
    tableName: 'roles',
});