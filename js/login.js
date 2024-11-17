import API_BASE_URL from './urlHelper.js';

// Agregar un evento para verificar el token almacenado al cargar la página
document.addEventListener("DOMContentLoaded", checkStoredToken);

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    document.getElementById("loadingScreen").classList.remove("hidden");

    const correo = document.getElementById("email").value; // Cambiado a correo
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password }) // Enviamos correo en lugar de email
        });

        if (response.status === 409) {
            alert("El usuario ya está logueado en otra sesión.");
            return;
        } else if (response.status === 401) {
            alert("Credenciales inválidas. Por favor, intenta de nuevo.");
            return;
        } else if (response.status === 404) {
            alert("Usuario no encontrado.");
            return;
        } else if (!response.ok) {
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("justLoggedIn", "true"); // Bandera para control de redirección
        setCookie("jwt", data.token, 1); // Expira en 1 día

        // Redirigir según el rol del usuario
        handleRedirection(data.token);
    } catch (error) {
        console.error("Error:", error);
        alert("Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.");
    } finally {
        document.getElementById("loadingScreen").classList.add("hidden");
    }
});

function checkStoredToken() {
    console.log("Verificando token almacenado");
    const token = localStorage.getItem("jwt");
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (justLoggedIn) {
        localStorage.removeItem("justLoggedIn");
    }

    if (token) {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken && decodedToken.exp <= currentTime && decodedToken.estado === 'loggedOn') {
            changeUserStatusToLoggedOff(decodedToken.idUsuario);
            clearAuthData();
        } else if (decodedToken && decodedToken.exp > currentTime && decodedToken.estado === 'loggedOn') {
            window.location.reload();
            if (!justLoggedIn) {
                handleRedirection(token);
            }
        } else {
            clearAuthData();
        }
    } else {

    }
}

function handleRedirection(token) {
    const decodedToken = parseJwt(token);
    const rol = decodedToken.rol;

    switch (rol) {
        case "admin":
            window.open("ADMINPHP/Admin.php", "_self");
            break;
        case "cliente":
            window.open("CLIENTEPHP/Cliente.php", "_self");
            break;
        default:
            alert("Rol no reconocido");
            break;
    }
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};expires=${expires};path=/;Secure;SameSite=Strict`;
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

function clearAuthData() {
    localStorage.removeItem("jwt");
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
}

async function changeUserStatusToLoggedOff(idUsuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUsuario })
        });
        const data = await response.json();
    } catch (error) {
    }
}
