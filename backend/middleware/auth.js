const jwt = require("jsonwebtoken");

/**
 * Middleware de autenticación JWT
 * Verifica la validez del token y adjunta el usuario autenticado a la solicitud

 */
const auth = (req, res, next) => {
    // 1. Extraer el token del encabezado Authorization
    const authHeader = req.header("Authorization");

    // Validar formato del encabezado (debe ser "Bearer <token>")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Token no enviado o formato incorrecto. Use 'Bearer <token>'"
        });
    }

    // 2. Extraer solo el token (eliminando "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verificar el token usando la clave secreta
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Adjuntar información del usuario a la solicitud
        // (Solo incluimos el ID para minimizar datos expuestos)
        req.user = {
            id: verified.id  // Coincide con el payload emitido en login ({id: user._id})
        };

        // 5. Pasar al siguiente middleware/ruta
        next();

    } catch (error) {
        // Manejo detallado de errores de verificación
        console.error("Error al verificar el token:", error.name, error.message);

        // Mensajes específicos según el tipo de error
        let errorMessage = "Token inválido";
        if (error.name === "TokenExpiredError") {
            errorMessage = "Token expirado - Por favor inicie sesión nuevamente";
        } else if (error.name === "JsonWebTokenError") {
            errorMessage = "Token malformado o firma inválida";
        }

        // Respuesta al cliente con el error específico
        return res.status(401).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = auth;