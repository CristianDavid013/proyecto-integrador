const formularioLogin = document.getElementById("loginForm");

formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  // Obtener valores de los campos del formulario
  const correo = document.getElementById("loginEmail").value.trim();
  const contrasena = document.getElementById("loginPassword").value;
  const botonLogin = evento.target.querySelector("button");

  try {
    // Cambiar estado del botón durante la solicitud
    actualizarEstadoBoton(botonLogin, true, "Iniciando sesión...");
    console.log("Iniciando sesión para:", correo); // Log para depuración

    // Realizar petición al servidor
    const respuesta = await iniciarSesionEnServidor(correo, contrasena);
    console.log("Respuesta recibida:", respuesta); // Log para depuración

    // Verificar si la respuesta es JSON
    const contentType = respuesta.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es válida');
    }

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || "Credenciales incorrectas");
    }

    if (!datos.token) {
      throw new Error("No se recibió token de autenticación");
    }

    // Procesar respuesta exitosa
    manejarLoginExitoso(datos.token);

  } catch (error) {
    console.error("Error en inicio de sesión:", {
      message: error.message,
      stack: error.stack
    });
    manejarErrorLogin(error);
  } finally {
    // Restaurar estado del botón
    actualizarEstadoBoton(botonLogin, false, "Iniciar Sesión");
  }
});


async function iniciarSesionEnServidor(correo, contrasena) {
  try {
    const respuesta = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: correo,
        password: contrasena
      }),
    });

    return respuesta;
  } catch (error) {
    console.error("Error en la petición fetch:", error);
    throw new Error("No se pudo conectar con el servidor");
  }
}

/**
 * Maneja el inicio de sesión exitoso
 * @param {string} token - Token de autenticación recibido del servidor
 */
function manejarLoginExitoso(token) {
  console.log("Login exitoso, almacenando token");
  localStorage.setItem("token", token);
  window.location.href = "expenses.html";
}

/**
 * Maneja errores durante el inicio de sesión
 * @param {Error} error - Error ocurrido durante el proceso
 */
function manejarErrorLogin(error) {
  const mensajeError = error.message || "Error desconocido al iniciar sesión";
  alert(`Error: ${mensajeError}`);

  // Opcional: Mostrar error en la interfaz
  const errorElement = document.getElementById("error-message") || document.createElement("div");
  errorElement.id = "error-message";
  errorElement.textContent = mensajeError;
  errorElement.style.color = "red";
  errorElement.style.marginTop = "10px";

  if (!document.getElementById("error-message")) {
    formularioLogin.appendChild(errorElement);
  }
}


function actualizarEstadoBoton(boton, deshabilitado, texto) {
  boton.disabled = deshabilitado;
  boton.textContent = texto;
}