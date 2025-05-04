// src/utils/main.js
import { getToken } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token) {
    // Lógica para usuarios autenticados
  } else {
    // Lógica para usuarios no autenticados
  }
});

