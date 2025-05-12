const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        // Extraer email y password del cuerpo de la solicitud
        const { email, password } = req.body;

        // Validar que se proporcionaron ambos campos
        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        // Buscar usuario en la base de datos incluyendo el campo password (normalmente excluido)
        const user = await User.findOne({ email }).select('+password');

        // Si no se encuentra el usuario, retornar error
        if (!user) {
            console.log('Intento de login con usuario inexistente:', email);
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Comparación de contraseña exitosa:', isMatch);

        // Si no coinciden, retornar error
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña inválida" });
        }

        // Generar token JWT válido por 1 día
        const token = jwt.sign(
            { id: user._id }, // Payload con ID de usuario
            process.env.JWT_SECRET, // Clave secreta
            { expiresIn: "1d" } // Tiempo de expiración
        );

        // Retornar el token al cliente
        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

/**
 * Controlador para registro de nuevos usuarios
 * Crea un nuevo usuario en la base de datos
 */
exports.register = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Ya existe un usuario con este correo" });
        }

        // Hashear la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el salt rounds

        // Crear nuevo usuario con la contraseña hasheada
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Guardar usuario en la base de datos
        await user.save();
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
};

/**
 * Controlador para solicitar restablecimiento de contraseña
 * Genera un token temporal y lo asocia al usuario
 */
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "No existe un usuario con este correo" });
        }

        // Generar token JWT válido por 1 hora para el restablecimiento
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Asignar token y fecha de expiración al usuario
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora en milisegundos
        await user.save();

        // Retornar respuesta con token (en producción se enviaría por email)
        res.json({
            message: "Se ha enviado un enlace de recuperación",
            resetToken,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

/**
 * Controlador para restablecer la contraseña
 * Valida el token y actualiza la contraseña del usuario
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;

        // Validar que todos los campos requeridos están presentes
        if (!token || !email || !newPassword) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        // Buscar usuario con token válido y no expirado
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // $gt = mayor que (fecha actual)
        });

        if (!user) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña y limpiar campos de reset
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Guardar cambios
        await user.save();
        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error('Error en reset password:', error);
        res.status(400).json({ error: "Token inválido o expirado" });
    }
};

/**
 * Controlador para verificar validez de un token JWT
 * (Middleware ya verificó el token, solo confirma su validez)
 */
exports.verifyToken = (req, res) => {
    try {
        res.status(200).json({
            message: "Token válido",
            user: req.user // Usuario adjuntado por el middleware de autenticación
        });
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};