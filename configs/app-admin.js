// configs/app.js
`use strict`;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOption } from './cors-configuration.js';

// Importar rutas
import rolesRoutes from '../scr/roles/roles.routes.js';
import usersRoutes from '../scr/users/users.routes.js';
import accountsRoutes from '../scr/accounts/accounts.routes.js';
import depositsRoutes from '../scr/deposits/deposits.routes.js';
import transfersRoutes from '../scr/transfers/transfers.routes.js';
import productsRoutes from '../scr/products/products.routes.js';
import shoppingsRoutes from '../scr/shoppings/shoppings.routes.js';
import currenciesRoutes from '../scr/currencies/currencies.routes.js';
import transactionsRoutes from '../scr/transactions/transactions.routes.js';

// Si prefieres dejar el CORS en un archivo aparte como en tu guía:
const setupMiddlewares = (app) => {
    // Seguridad de cabeceras
    app.use(helmet());
    app.use(cors(corsOption));
    // Logs en consola
    app.use(morgan('dev'));

    // Lectura de datos en JSON y formularios
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
};

// Configuración de rutas
const setupRoutes = (app) => {
    const BASE_URL = '/NovaPay/admin/v1';

    // Rutas de modulos
    app.use(`${BASE_URL}/roles`, rolesRoutes);
    app.use(`${BASE_URL}/users`, usersRoutes);
    app.use(`${BASE_URL}/accounts`, accountsRoutes);
    app.use(`${BASE_URL}/deposits`, depositsRoutes);
    app.use(`${BASE_URL}/shoppings`, shoppingsRoutes);

    app.use(`${BASE_URL}/transfers`, transfersRoutes);
    app.use(`${BASE_URL}/products`, productsRoutes);
    app.use(`${BASE_URL}/currencies`, currenciesRoutes);
    app.use(`${BASE_URL}/transactions`, transactionsRoutes);

    // Ruta de prueba
    app.get(`${BASE_URL}/check`, (req, res) => {
        res.status(200).json({ message: 'Server is up and running' });
    });
};

// Inicializacion del servidor
export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3001;

    try {
        // Esperamos a Postgres
        await dbConnection();
        setupMiddlewares(app);
        setupRoutes(app);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};