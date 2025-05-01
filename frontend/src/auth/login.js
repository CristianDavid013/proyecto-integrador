import { apiFetch } from "../utils/api.js";

// Función que se encarga de enviar el formulario de inicio de sesión
async function handleLogin(event) {
  event.preventDefault();

  // Obtener los valores de los campos
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    // Llamar a la API para iniciar sesión
    const response = await apiFetch("/auth/login", "POST", {
      email,
      password,
    });

    // Verificar si la respuesta contiene un token o sesión
    if (response.token) {
      // Guardar el token de sesión en el almacenamiento local
      localStorage.setItem("authToken", response.token);
      alert("Inicio de sesión exitoso. Redirigiendo...");
      
      // Redirigir a la página principal o dashboard
      window.location.href = "dashboard.html";  // O la URL que corresponda en tu aplicación
    } else {
      throw new Error("Error en el inicio de sesión: Credenciales incorrectas.");
    }
  } catch (error) {
    alert(`Error en el inicio de sesión: ${error.message}`);
    console.error("Error en el inicio de sesión", error);
  }
}

// Añadir el listener al formulario de inicio de sesión
document
  .getElementById("loginForm")
  .addEventListener("submit", handleLogin);
