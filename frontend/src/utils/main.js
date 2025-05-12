

// Verificación básica de auth
export const checkAuth = () =>
  localStorage.getItem('token') || (location.href='login.html', false);

// Configuración del logout
document.addEventListener('DOMContentLoaded', () =>
  document.getElementById('logoutButton')?.addEventListener('click', () =>
    (localStorage.removeItem('token'), location.href='login.html')
  )
);