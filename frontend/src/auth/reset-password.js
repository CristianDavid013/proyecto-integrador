import { apiFetch } from '../utils/api.js';

/**
 * Configura el formulario de recuperación de contraseña cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    const formularioRecuperacion = document.getElementById('resetPasswordForm');
    
    // Verificar si el formulario existe en el DOM
    if (!formularioRecuperacion) {
        mostrarErrorConsola('El formulario de recuperación no fue encontrado en la página');
        return;
    }

    // Configurar el manejador de envío del formulario
    formularioRecuperacion.addEventListener('submit', manejarSolicitudRecuperacion);
});

/**
 * Maneja el envío del formulario de recuperación de contraseña
 * @param {Event} evento - Evento de submit del formulario
 */
async function manejarSolicitudRecuperacion(evento) {
    evento.preventDefault();

    const botonEnvio = evento.target.querySelector('button');
    const campoEmail = document.getElementById('resetEmail');

    // Validar que el campo de email existe
    if (!campoEmail) {
        mostrarErrorConsola('El campo de correo electrónico no fue encontrado');
        return;
    }

    const correoElectronico = campoEmail.value.trim();

    try {
        // Actualizar estado del botón durante la solicitud
        actualizarEstadoBoton(botonEnvio, true, 'Enviando solicitud...');

        console.log('Iniciando proceso de recuperación para:', correoElectronico);

        // Enviar solicitud al servidor
        const respuesta = await solicitarRestablecimientoContrasena(correoElectronico);
        
        console.log('Respuesta recibida del servidor:', respuesta);

        // Procesar respuesta exitosa
        if (respuesta.resetToken) {
            manejarRespuestaExitosa(respuesta.resetToken, correoElectronico);
        }
    } catch (error) {
        manejarErrorRecuperacion(error);
    } finally {
        // Restaurar estado del botón
        actualizarEstadoBoton(botonEnvio, false, 'Enviar enlace de recuperación');
    }
}

/**
 * Solicita el restablecimiento de contraseña al servidor
 * @param {string} correo - Correo electrónico del usuario
 * @returns {Promise<Object>} Respuesta del servidor
 */
async function solicitarRestablecimientoContrasena(correo) {
    return await apiFetch('/auth/request-password-reset', 'POST', { 
        email: correo 
    });
}



function manejarRespuestaExitosa(token, correo) {
    // Almacenar datos temporalmente en sessionStorage
    sessionStorage.setItem('resetToken', token);
    sessionStorage.setItem('resetEmail', correo);
    
    // Notificar al usuario y redirigir
    alert('Hemos enviado un enlace de recuperación a tu correo electrónico');
    window.location.href = './change-password.html';
}

/**
 * Maneja errores durante el proceso de recuperación
 * @param {Error} error - Error ocurrido
 */
function manejarErrorRecuperacion(error) {
    console.error('Error en recuperación de contraseña:', error);
    alert('Ocurrió un error al procesar tu solicitud: ' + error.message);
}


function actualizarEstadoBoton(boton, deshabilitado, texto) {
    boton.disabled = deshabilitado;
    boton.textContent = texto;
}

/**
 * Muestra un mensaje de error en la consola
 * @param {string} mensaje - Mensaje de error
 */
function mostrarErrorConsola(mensaje) {
    console.error(`[Error] ${mensaje}`);
}