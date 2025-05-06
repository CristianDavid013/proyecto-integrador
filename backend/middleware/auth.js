const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization"); 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no enviado o no válido" });
    }

    const token = authHeader.split(" ")[1]; // Extraemos el token del encabezado

    try {
        // Verificamos el token usando la clave secreta definida en el entorno
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Asignamos solo el userId al objeto req.user
        req.user = { id: verified.userId };

        next(); // Continuamos con la siguiente función en el flujo
    } catch (error) {
        console.error("Error al verificar el token", error.name, error.message); 

        let message = "Token inválido"; // Mensaje predeterminado para token inválido
        if (error.name === "TokenExpiredError") {
            message = "Token expirado"; // Caso de error cuando el token ha expirado
        }

        // Devolvemos un error detallado dependiendo del tipo de problema
        return res.status(400).json({ error: message }); 
    }
};


module.exports = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Acceso no autorizado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = auth;
