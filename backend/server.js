const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Asegúrate de tener el modelo User importado
const categoryRoutes = require('./routes/categoryRoutes');
const auth = require('./middleware/auth');
require('dotenv').config(); // Carga las variables de entorno desde .env

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Configurar la carpeta 'frontend' para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend'))); // Sirve los archivos estáticos de la carpeta frontend

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

// Ruta para el login (autenticación)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar las credenciales del usuario
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Generar el token JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Crea el token con una clave secreta

  // Retorna el token al cliente
  res.json({ token });
});

// Ruta para registrar un usuario
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      email,
      password,  // Recuerda encriptar la contraseña antes de guardarla (usando bcrypt por ejemplo)
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Responder con un mensaje de éxito
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para crear categorías (requiere autenticación)
app.use('/categories', auth, categoryRoutes); // Protege la ruta de categorías con autenticación

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor en funcionamiento');
});

// Ruta para servir el login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html')); // Sirve el archivo login.html
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}/`));
