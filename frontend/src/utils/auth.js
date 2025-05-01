// Obtener el token del localStorage
export function getToken() {
    return localStorage.getItem("token");
  }
  
  // Establecer el token en localStorage
  export function setToken(token) {
    localStorage.setItem("token", token);
  }
  
  // Eliminar el token de localStorage (cuando el usuario cierre sesión)
  export function clearToken() {
    localStorage.removeItem("token");
  }