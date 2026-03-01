import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Guarda los errores en un archivo
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Guarda todos los logs en otro archivo
        new winston.transports.File({ filename: 'logs/combined.log' }),
        // Tambien los mostrara en consola
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export default logger;