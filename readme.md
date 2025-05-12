# Gastos Personales JWT

Este proyecto es una aplicación web para la **gestión de gastos personales**, implementando autenticación segura con **JSON Web Tokens (JWT)**. El objetivo es permitir que los usuarios puedan **registrarse, iniciar sesión, registrar gastos, visualizar categorías y recuperar su contraseña** de manera sencilla y segura.

##  Características principales

- Registro e inicio de sesión de usuarios con autenticación mediante JWT.
- Protección de rutas mediante middleware personalizado.
- Registro y visualización de gastos personales por categoría.
- Recuperación y cambio de contraseña a través de tokens seguros.
- Interfaz web para login, registro y manejo de gastos.
- Separación clara entre **backend (Node.js/Express)** y **frontend (HTML/JS)**.

##  Estructura del proyecto
gastos_personales/
│
├── backend/
│ ├── controllers/ # Controladores de autenticación y gastos
│ ├── middleware/ # Middleware de autenticación JWT
│ ├── models/ # Modelos de usuario y gastos
│ ├── routes/ # Rutas protegidas y públicas (auth, gastos)
│ ├── views/ # Páginas HTML para login, recuperación, etc.
│ ├── .env # Variables de entorno (JWT_SECRET, DB, etc.)
│ └── server.js # Punto de entrada del servidor Express
│
└── frontend/
├── login.html
├── register.html
├── expenses.html
├── reset-password.html
├── change-password.html
└── js/
├── login.js
├── register.js
├── reset-password.js
└── change-password.js

Instalar dependencias:
npm install

Ejecutar el servidor:
node server.js



