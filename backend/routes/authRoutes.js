const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const validator = require("validator");
const auth = require("../middleware/auth");

const router = express.Router();

// Registro de usuario con validación
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar el correo electrónico
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si ya existe un usuario con el mismo correo
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Ya existe un usuario con este correo" });
    }

    // Encriptar la contraseña antes de guardar al usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const user = new User({ name, email, password: hashedPassword });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para verificar el token
router.get("/verify", auth, (req, res) => {
  res.status(200).json({ message: "Token válido", user: req.user });
});

module.exports = router;