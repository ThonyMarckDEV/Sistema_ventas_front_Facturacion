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

    if (isExpiring) {
      //  console.log("El token está próximo a expirar, se intentará renovar.");
    } else {
       // console.log("El token aún es válido, no se requiere renovación.");
    }
    
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
    console.log("Verificando si el token necesita renovación...");
    if (tokenExpirado()) {
        const nuevoToken = await renovarToken();
        if (nuevoToken) {
           // console.log("Renovación completada, el nuevo token se utilizará en la siguiente solicitud.");
        } else {
           console.log("No se pudo renovar el token, redirigiendo al login...");
        }
    } else {
       // console.log("El token es válido y no necesita renovación.");
    }
}


function parseJwt(token) {
    if (!token) return null; // Agrega esta verificación
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