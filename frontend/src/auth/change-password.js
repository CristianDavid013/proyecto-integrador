import { apiFetch } from '../utils/api.js';

// Configuración inicial cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', () => {
    const formularioCambioClave = document.getElementById('changePasswordForm');
    const correoGuardado = sessionStorage.getItem('resetEmail');
    const tokenGuardado = sessionStorage.getItem('resetToken');

    // Verificar si hay datos de recuperación almacenados
    if (!correoGuardado || !tokenGuardado) {
        mostrarAlertaYSalir();
        return;
    }

    // Mostrar el correo automáticamente en el formulario
    const campoCorreo = document.getElementById('resetEmail');
    if (campoCorreo) {
        campoCorreo.value = correoGuardado;
    }

    // Preparar el formulario para enviar la nueva contraseña
    formularioCambioClave.addEventListener('submit', procesarCambioClave);
});

function mostrarAlertaYSalir() {
    alert('No encontramos tu solicitud de recuperación. Por favor inicia el proceso nuevamente.');
    window.location.href = './reset-password.html';
}

// Procesar el formulario de cambio de contraseña
async function procesarCambioClave(evento) {
    evento.preventDefault();

    const botonConfirmar = evento.target.querySelector('button');
    const correoElectronico = document.getElementById('resetEmail').value;
    const nuevaClave = document.getElementById('newPassword').value;
    const confirmacionClave = document.getElementById('confirmPassword').value;
    const tokenAcceso = sessionStorage.getItem('resetToken');

    // Validar que ambas contraseñas sean iguales
    if (nuevaClave !== confirmacionClave) {
        alert('Por favor asegúrate de que ambas contraseñas coincidan exactamente');
        return;
    }

    try {
        prepararBotonEnvio(botonConfirmar, true);

        // Enviar los datos al servidor
        const respuesta = await enviarDatosAlServidor(correoElectronico, nuevaClave, tokenAcceso);

        if (respuesta.exito) {
            manejarCambioExitoso();
        }
    } catch (error) {
        manejarErrorCambioClave(error);
    } finally {
        prepararBotonEnvio(botonConfirmar, false);
    }
}

function prepararBotonEnvio(boton, estaCargando) {
    boton.disabled = estaCargando;
    boton.textContent = estaCargando ? 'Procesando tu solicitud...' : 'Actualizar Contraseña';
}

async function enviarDatosAlServidor(correo, clave, token) {
    return await apiFetch('/auth/reset-password/confirm', 'POST', {
        email: correo,
        newPassword: clave,
        token: token
    });
}

function manejarCambioExitoso() {
    // Limpiar datos de recuperación
    sessionStorage.removeItem('resetToken');
    sessionStorage.removeItem('resetEmail');

    // Ocultar formulario y mostrar mensaje de éxito
    const contenedorMensaje = document.getElementById('messageContainer');
    const formulario = document.getElementById('changePasswordForm');

    formulario.style.display = 'none';
    contenedorMensaje.style.display = 'block';

    // Iniciar cuenta regresiva para redirección
    iniciarCuentaRegresiva();
}

function iniciarCuentaRegresiva() {
    let segundosRestantes = 5;
    const elementoContador = document.getElementById('countdown');

    const intervalo = setInterval(() => {
        segundosRestantes--;
        elementoContador.textContent = segundosRestantes;

        if (segundosRestantes <= 0) {
            clearInterval(intervalo);
            window.location.href = './login.html';
        }
    }, 1000);
}

function manejarErrorCambioClave(error) {
    console.error('Ocurrió un problema al cambiar tu contraseña:', error);
    alert('No pudimos completar el cambio. Error: ' + error.message);
}