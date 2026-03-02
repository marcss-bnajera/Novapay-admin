`use strict`;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import { dbConnection } from './db.js';
import { corsOption } from './cors-configuration.js';

// --- Modelos para tener roles y adminB ---
import { Role } from '../scr/roles/roles.model.js';
import { User } from '../scr/users/users.model.js';

// --- IMPORTAR RUTAS ---
import rolesRoutes from '../scr/roles/roles.routes.js';
import usersRoutes from '../scr/users/users.routes.js';
import accountsRoutes from '../scr/accounts/accounts.routes.js';
import deposits from '../scr/deposits/deposits.routes.js'
import transfersRoutes from '../scr/transfers/transfers.routes.js';

// Función para crear datos iniciales (Roles y Admin por defecto)
const initData = async () => {
    try {
        // 1. Crear Roles si no existen
        const [adminRole] = await Role.findOrCreate({ where: { name: 'ADMIN' } });
        await Role.findOrCreate({ where: { name: 'CLIENT' } });

        // 2. Crear ADMINB si no existe
        const adminExists = await User.findOne({ where: { username: 'ADMINB' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('ADMINB', 10);
            await User.create({
                nombre: 'Admin',
                apellido: 'NovaPay',
                username: 'ADMINB',
                email: 'admin@novapay.com',
                dpi: '0000000000000',
                nit: '0000000-0',
                telefono: '00000000',
                direccion: 'Guatemala',
                nombre_trabajo: 'NovaPay HQ',
                ingresos_mensuales: 999999,
                password: hashedPassword,
                role_id: adminRole.id
            });
            console.log('Usuario ADMINB inicializado correctamente.');
        }
    } catch (error) {
        console.error('Error al inicializar datos:', error);
    }
};

const setupMiddlewares = (app) => {
    app.use(helmet());
    app.use(cors(corsOption));
    app.use(morgan('dev'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
};

const setupRoutes = (app) => {
    const BASE_URL = '/NovaPay/admin/v1';

    app.use(`${BASE_URL}/roles`, rolesRoutes);
    app.use(`${BASE_URL}/users`, usersRoutes);
    app.use(`${BASE_URL}/accounts`, accountsRoutes);
    app.use(`${BASE_URL}/deposits`, deposits);
    app.use(`${BASE_URL}/transfers`, transfersRoutes);
    app.get(`${BASE_URL}/check`, (req, res) => {
        res.status(200).json({ message: 'NovaPay Admin Server is up and running' });
    });
};

// Inicialización del servidor
export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3001;

    try {
        // 1. Conexión a la base de datos
        await dbConnection();

        // 2. Crear datos maestros (AdminB y Roles)
        await initData();

        // 3. Middlewares y Rutas
        setupMiddlewares(app);
        setupRoutes(app);

        app.listen(PORT, () => {
            console.log(`Servidor ADMIN corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error fatal al iniciar el servidor:', error);
    }
};