// index.js
import dotenv from 'dotenv';
import { initServer } from './configs/app.js';

dotenv.config();

// Manejo de errores globales para evitar que la app muera sin avisar
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

console.log('Iniciando servidor del Banco...');
initServer();