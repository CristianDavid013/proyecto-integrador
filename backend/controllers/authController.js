const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email y contraseña son requeridos" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Contraseña inválida" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24hrs" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token: "Usuario registrado correctamente"  });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar" });
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "No existe un usuario con este correo" });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        res.json({ message: "Se ha enviado un enlace de recuperación", resetToken, email: user.email });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;
        if (!token || !email || !newPassword) return res.status(400).json({ error: "Todos los campos son requeridos" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Contraseña actualizada correctamente", success: true });
    } catch (error) {
        res.status(400).json({ error: error.message || "Token inválido o expirado" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.resetPasswordToken !== token || Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }
        res.json({ valid: true });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        res.status(200).json({ message: "Token válido", user: req.user });
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};
