const BASE_URL = process.env.REACT_APP_API_URL;


export async function apiFetch(endpoint, metodo = 'GET', body = null) {
    try {
        // 1. Configurar la petición
        const tokenAcceso = localStorage.getItem('token');
        const configuracionPeticion = {
            method: metodo,
            headers: {
                     'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token'
            }
        };

        // 2. Agregar token de autenticación si existe
        if (tokenAcceso) {
            configuracionPeticion.headers['Authorization'] = `Bearer ${tokenAcceso}`;
            registrarLog(`Petición autenticada a ${endpoint}`);
        } else {
            registrarLog(`Petición pública a ${endpoint}`);
        }

        // 3. Agregar cuerpo si se proporciona
        if (cuerpo) {
            configuracionPeticion.body = JSON.stringify(cuerpo);
            registrarLog('Datos enviados:', cuerpo);
        }

        // 4. Realizar la petición HTTP
        const respuesta = await fetch(`${URL_BASE_API}${endpoint}`, configuracionPeticion);
        const datosRespuesta = await respuesta.json();

        // 5. Registrar información de depuración
        registrarLog('Respuesta del servidor:', {
            endpoint: endpoint,
            status: respuesta.status,
            data: datosRespuesta
        });

        // 6. Manejar respuestas no exitosas
        if (!respuesta.ok) {
            return manejarErrorRespuesta(respuesta, datosRespuesta);
        }

        // 7. Retornar datos en caso de éxito
        return datosRespuesta;

    } catch (error) {
        // 8. Manejar errores de la petición
        registrarErrorDetallado(error);
        throw error;
    }
}


 */
function manejarErrorRespuesta(respuesta, datos) {
    // Caso especial para token expirado/inválido
    if (respuesta.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
    }

    // Otros errores HTTP
    const mensajeError = datos.error ||
                       datos.message ||
                       `Error en la petición: ${respuesta.statusText} (${respuesta.status})`;

    throw new Error(mensajeError);
}

/**
 * Registra información de depuración en la consola
 * @param {...any} mensajes - Mensajes a registrar
 */
function registrarLog(...mensajes) {
    console.log('[API]', ...mensajes);
}

/**
 * Registra errores detallados en la consola
 * @param {Error} error - Error capturado
 */
function registrarErrorDetallado(error) {
    console.error('[API Error]', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
}