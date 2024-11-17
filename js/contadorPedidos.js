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

export async function actualizarCantidadPedido() { // Cambiado a singular

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
        const response = await fetch(`${API_BASE_URL}/api/pedidos/cantidad`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario }) // Envía el idUsuario en el cuerpo de la solicitud
        });

        if (response.ok) {
            const data = await response.json();
            const cantidad = data.cantidad || 0;

            // Actualiza la cantidad solo si es mayor a 0
            const pedidosCantidadElement = document.getElementById("pedidosCantidad");
            if (cantidad > 0) {
                pedidosCantidadElement.textContent = cantidad;
                pedidosCantidadElement.classList.remove("hidden");
            } else {
                pedidosCantidadElement.classList.add("hidden"); // Oculta si no hay pedidos
            }
        } else {
            console.error("Error al obtener la cantidad de pedidos");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Ejecuta la función al cargar la página
document.addEventListener("DOMContentLoaded", actualizarCantidadPedido);
