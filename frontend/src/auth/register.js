import { apiFetch } from "../utils/api.js";
// Función que se encarga de el envio del formulario de registro
async function handleRegister(event) {
  event.preventDefault();
  //Obtener los valores de los campos
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  try {
    // Llamar a la API para registrar el usuario
    const response = await apiFetch("/auth/register", "POST", {
      name,
      email,
      password,
    });
    alert("Registro exitoso. Redirigiendo a Login");
    window.location.href = "login.html";
  } catch (error) {
    alert(`Error en el registro: ${error.message}`);
    console.error("Error en el registro", error);
  }
}

document
.getElementById("registerForm")
.addEventListener("submit", handleRegister);