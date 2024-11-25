import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';

const checkTokenInterval = 60000; // Verificación cada 60 segundos
const expirationThreshold = 120;   // Intento de renovación si quedan 2 minutos o menos

let isRenewingToken = false;

document.addEventListener("DOMContentLoaded", function() {
    console.log("Iniciando verificación de token almacenado...");

    // Verificación inicial del token
    let token = localStorage.getItem("jwt");
    if (!token) {
        console.log("No se encontró token en localStorage, redirigiendo al login...");
        redirectToLogin();
        return;
    }

    let decodedToken = parseJwt(token);
    let rol = decodedToken.rol;
    let idUsuario = decodedToken.idUsuario;

    console.log("Rol del usuario:", rol);
    console.log("ID de usuario:", idUsuario);

    async function checkUserStatus() {
        console.log("Verificando estado del usuario con la API...");

        const token = localStorage.getItem('jwt'); // Obtén el token actualizado
        const idUsuario = parseJwt(token).idUsuario; // Obtén idUsuario actualizado

        try {
            const response = await fetch(`${API_BASE_URL}/api/check-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Envía el token en el header
                },
                body: JSON.stringify({ idUsuario })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta de estado recibida:", data);

                if (data.status === 'loggedOff' || (data.status === 'loggedOnInvalidToken' && !data.isTokenValid)) {
                    console.log("Estado del usuario/token inválido. Redirigiendo al login...");
                    logoutAndRedirect();
                } else if (data.status === 'loggedOn' && data.isTokenValid) {
                    console.log("Estado del usuario activo y token válido. Procediendo a verificar rol...");
                    verifyUserRole();
                }
            } else {
                console.log("Error en la respuesta al verificar el estado, redirigiendo...");
                logoutAndRedirect();
            }
        } catch (error) {
            console.error("Error en la solicitud de verificación del estado del usuario:", error);
            logoutAndRedirect();
        }
    }

    function verifyUserRole() {
        const token = localStorage.getItem('jwt'); // Obtén el token actualizado
        const decodedToken = parseJwt(token);
        const rol = decodedToken.rol;

        const currentPath = window.location.pathname;
        console.log("Verificando rol del usuario con la ruta actual:", currentPath);

        if ((currentPath.includes("/ADMINPHP") && rol !== "admin") ||
            (currentPath.includes("/CLIENTEPHP") && rol !== "cliente")) {
            console.log("Acceso no autorizado: usuario sin rol adecuado. Redirigiendo...");
            alert("Acceso no autorizado. Redirigiendo...");
            logoutAndRedirect();
        } else {
            console.log("Acceso autorizado para el rol:", rol);
        }
    }

    function redirectToLogin() {
        console.log("Redirigiendo al login...");
        // window.location.href = "../../index.php";
    }

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error al decodificar el token JWT:", error);
            return null;
        }
    }

    function parseJwtExpiration(token) {
        const payload = parseJwt(token);
        return payload ? payload.exp : null;
    }

    async function renewToken() {
        if (isRenewingToken) return;
        isRenewingToken = true;

        const token = localStorage.getItem('jwt'); // Asegúrate de obtener el token actualizado

        try {
            const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Token renovado");
                const nuevoToken = data.accessToken;
                localStorage.setItem('jwt', nuevoToken);
                console.log("Nuevo token almacenado en localStorage.");
            } else {
                console.log("Error al renovar el token, cerrando sesión...");
                logoutAndRedirect();
            }
        } catch (error) {
            console.error("Excepción al renovar el token:", error);
            logoutAndRedirect();
        } finally {
            isRenewingToken = false;
        }
    }

    function checkAndRenewToken() {
        console.log("Verificando Token almacenado");
        const token = localStorage.getItem('jwt');

        if (!token) {
            console.log("No hay token");
            redirectToLogin();
            return;
        }

        const tokenExpiration = parseJwtExpiration(token);
        if (!tokenExpiration) {
            console.log("No se pudo obtener la expiración del token, cerrando sesión...");
            logoutAndRedirect();
            return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = tokenExpiration - currentTime;

        if (timeRemaining <= 0) {
            alert("Tu sesión ha caducado, serás redirigido para iniciar sesión nuevamente.");
            console.log("El token ha expirado, cerrando sesión...");
            logoutAndRedirect();
        } else if (timeRemaining <= expirationThreshold) {
            console.log(`Renovando el token, tiempo restante hasta expiración: ${timeRemaining} segundos.`);
            renewToken();
        } else {
            console.log(`No es necesario renovar aún, tiempo restante hasta expiración: ${timeRemaining} segundos.`);
        }
    }

    checkUserStatus();
    setInterval(checkAndRenewToken, checkTokenInterval);
});