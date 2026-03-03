import rateLimit from 'express-rate-limit';

export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) + ' segundos',
        });
    },
});
export const authLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Demasiados intentos de acceso. Por seguridad, espera un minuto.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});