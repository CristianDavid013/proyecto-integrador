import { apiFetch } from "../utils/api.js";
import { setToken } from "../utils/auth.js";
//Funcion para el formulario de incio de sesión
async function haldleLogin(event) {
  event.preventDefault();
  //Obtener los valores de los campos
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword");
  try {
    //Llamar al endpoint de inicio sesión
    const response = await apiFetch("/auth/login", "POST", { email, password });
    setToken(response.token);
    alert("Inicio de sesión exitoso. Redirigiendo a la página de gastos");
    window.location.href = "expenses.html";
  } catch (error) {
    alert(`Error al iniciar sesión: ${error.message}`);
    console.error("Error en el login:", error);
  }
}
document.getElementById("loginForm").addEventListener("submit", haldleLogin);