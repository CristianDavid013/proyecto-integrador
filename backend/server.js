// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Rutas y middlewares
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const auth = require('./middleware/auth');


const app = express();

// Configuración CORS
const corsOptions = {
  origin: [

    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors());

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gastos_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error de conexión:', error));

// Rutas públicas y protegidas
app.use('/auth', authRoutes);
app.use('/category', auth, categoryRoutes);
app.use('/expense', auth, expenseRoutes);

// Ruta DUMMY de prueba para ver si el servidor responde
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'API funcionando correctamente' });
});

// Rutas HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'reset-password.html'));
});

// Servir archivos estáticos (debe ir al final)
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor en funcionamiento');
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores internos
app.use((err, req, res, next) => {
  console.error('🛑 Error del servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/`));
