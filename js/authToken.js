import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';

// Función para verificar si el token está próximo a expirar
function tokenExpirado() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        console.log("Token no encontrado en localStorage.");
        return true;
    }

    const payload = parseJwt(token);
    const exp = payload.exp * 1000; // Convertir a milisegundos
    const isExpiring = Date.now() > exp - 120000; // Renovar 2 minutos antes de expirar

    return isExpiring;
}

// Función para renovar el token
export async function renovarToken() {
    const token = localStorage.getItem('jwt');

    try {
        const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const nuevoToken = data.accessToken;
            localStorage.setItem('jwt', nuevoToken); // Guarda el nuevo token inmediatamente
            return nuevoToken;
        } else if (response.status === 401) {
            showNotification('El token ha expirado. Recargando la página...', 'bg-red-500');
            setTimeout(() => window.location.reload(), 3000);
        } else {
            logoutAndRedirect();
        }
    } catch (error) {
        console.error("Error al intentar renovar el token:", error);
        logoutAndRedirect();
    }
}

// Función que verifica y renueva el token si es necesario
export async function verificarYRenovarToken() {
    if (tokenExpirado()) {
        const nuevoToken = await renovarToken();
        if (nuevoToken) {
            console.log("Renovación completada, el nuevo token se utilizará en la siguiente solicitud.");
        } else {
            console.log("No se pudo renovar el token, redirigiendo al login...");
        }
    } else {
        console.log("El token es válido y no necesita renovación.");
    }
}

// Función para decodificar el token
function parseJwt(token) {
    if (!token) return null; // Verificación adicional
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token JWT:", error);
        return null;
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'bg-green-500') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error("No se encontró el elemento de notificación.");
        return;
    }

    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md z-50 text-white text-center ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000); // Ocultar después de 3 segundos
}

// Función para realizar una solicitud con manejo de errores
export async function realizarSolicitud(url, options = {}) {
    await verificarYRenovarToken();

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        } else if (response.status === 401) {
            showNotification('No autorizado. Recargando la página...', 'bg-red-500');
            setTimeout(() => window.location.reload(), 3000);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la solicitud');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        showNotification(error.message || 'Error desconocido al procesar la solicitud', 'bg-red-500');
        throw error;
    }
}
