`use strict`;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

// Instancia de Sequelize (Define como nos comunicamos con el sv)
export const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'db',
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',

        // Cambiar a 'console.log' si queremos ver el SQL puro en bash
        // logging: (msg) => logger.info(msg),
        logging: false,
        pool: {
            // Maximo de conexiones abiertas
            max: 5,
            min: 0,
            // Tiempo maximo para conectar (30s)
            acquire: 30000,
            // Tiempo para cerrar una conexion inactiva (10s)
            idle: 10000
        }
    }
);

// Funcion para probar y sincronizar la conexion
export const dbConnection = async () => {
    try {
        // Autentica la conexion
        await db.authenticate();
        logger.info('PostgreeSQL | Connection successful.')

        /*
            Sincronizacion de los modelos:
            { alter: true} -> Compara el modelo con la tabla y la actualiza si hay cambios.
             Ideal para desarrollo ya que no borra los datos
        */
        await db.sync({ alter: true });
        logger.info('PostgreeSQL | Database synchronized and tables cheked.');
    } catch (error) {
        logger.error('PostgreSQL | Connectin failed: ', error.message);
        process.exit(1);
    }
};