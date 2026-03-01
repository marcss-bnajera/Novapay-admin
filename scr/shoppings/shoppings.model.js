import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";
import { Account } from "../accounts/accounts.model.js";
import { Product } from "../products/products.model.js";

export const Shopping = db.define("shopping", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cuenta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: "id"
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: "id"
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "shoppings"
});