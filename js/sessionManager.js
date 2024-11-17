import API_BASE_URL from './urlHelper.js';

// Función para decodificar el JWT
function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'hidden') {
        const token = localStorage.getItem("jwt");
        const decodedToken = parseJwt(token);

        if (token && decodedToken) {
            const logoutData = new Blob([JSON.stringify({ idUsuario: decodedToken.idUsuario })], {
                type: "application/json"
            });
            navigator.sendBeacon(`${API_BASE_URL}/api/logout`, logoutData);
        }

        localStorage.removeItem("jwt");
        document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
    }
});

