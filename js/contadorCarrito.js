import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

// Función para descifrar el JWT y obtener el payload
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export async function actualizarCantidadCarrito() {
    
  // Verificar y renovar el token antes de cualquier solicitud
  await verificarYRenovarToken();
  
    const token = localStorage.getItem("jwt");

    if (!token) {
        console.error("Token no encontrado");
        return;
    }

    // Decodifica el JWT para obtener el idUsuario
    const payload = parseJwt(token);
    const idUsuario = payload.idUsuario; 

    try {
        const response = await fetch(`${API_BASE_URL}/api/carrito/cantidad?idUsuario=${idUsuario}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const cantidad = data.cantidad || 0;

            // Actualiza la cantidad solo si es mayor a 0
            const carritoCantidadElement = document.getElementById("carritoCantidad");
            if (cantidad > 0) {
                carritoCantidadElement.textContent = cantidad;
                carritoCantidadElement.classList.remove("hidden");
            } else {
                carritoCantidadElement.classList.add("hidden"); // Oculta si no hay productos
            }
        } else {
            console.error("Error al obtener la cantidad del carrito");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Ejecuta la función al cargar la página
document.addEventListener("DOMContentLoaded", actualizarCantidadCarrito);
