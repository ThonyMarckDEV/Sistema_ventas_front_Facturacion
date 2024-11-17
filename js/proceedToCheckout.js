import API_BASE_URL from './urlHelper.js';
import { actualizarCantidadPedido } from './contadorPedidos.js'; // Cambiado a plural
import { actualizarCantidadCarrito } from './contadorCarrito.js';
const token = localStorage.getItem("jwt");


import { verificarYRenovarToken } from './authToken.js';

// Función para obtener el payload del token
function getTokenPayload() {
    const token = localStorage.getItem('jwt');
    if (!token) return null;

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
        console.error("Error al decodificar el JWT:", error);
        return null;
    }
}

// Función para verificar las direcciones del usuario
async function verificarDireccionUsuario() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const payload = getTokenPayload();
    if (!payload) {
        showNotification("Error: No se encontró el token", "bg-red-500");
        return;
    }

    const idUsuario = payload.idUsuario;
    try {
        const response = await fetch(`${API_BASE_URL}/api/listarDireccion/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            showNotification("Error al verificar la dirección", "bg-red-500");
            return;
        }

        const direcciones = await response.json();
        const direccionUsando = direcciones.find(d => d.estado === 'usando');

        if (direcciones.length === 0) {
                // Reproducir el sonido error
                var sonido = new Audio('../../songs/error.mp3'); // Asegúrate de que la ruta sea correcta
                sonido.play().catch(function(error) {
                    console.error("Error al reproducir el sonido:", error);
                });
                //=============================================================
            showNotification("Error: Agrega una dirección para el envío", "bg-red-500");
        } else if (!direccionUsando) {
                // Reproducir el sonido error
                var sonido = new Audio('../../songs/error.mp3'); // Asegúrate de que la ruta sea correcta
                sonido.play().catch(function(error) {
                    console.error("Error al reproducir el sonido:", error);
                });
                //=============================================================
            showNotification("Error: Selecciona una dirección para usar", "bg-red-500");
        } else {
            proceedToCheckout(); // Procede al pago si todo está bien
        }
    } catch (error) {
        console.error("Error en la verificación de dirección:", error);
        showNotification("Error al verificar la dirección", "bg-red-500");
    }
}

async function proceedToCheckout() {
    await verificarYRenovarToken();

    const totalText = document.getElementById("totalPrice").textContent;
    const total = parseFloat(totalText.replace('$', '').replace(',', ''));
    const payload = getTokenPayload();

    if (!payload) {
        showNotification("Error: No se encontró el token", "bg-red-500");
        return;
    }

    const idCarrito = payload.idCarrito;
    const idUsuario = payload.idUsuario;

    if (!idCarrito || !idUsuario) {
        showNotification("Error: No se encontró el carrito o el usuario", "bg-red-500");
        return;
    }

    try {
        const direccionResponse = await fetch(`${API_BASE_URL}/api/listarDireccion/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const direcciones = await direccionResponse.json();
        const direccionUsando = direcciones.find(d => d.estado === 'usando');

        if (!direccionUsando) {
            showNotification("Error: Selecciona una dirección para usar", "bg-red-500");
            return;
        }

        document.getElementById("loadingScreen").classList.remove("hidden");

        const response = await fetch(`${API_BASE_URL}/api/pedido`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ total, idCarrito, idUsuario, idDireccion: direccionUsando.idDireccion })
        });

        if (!response.ok) {
            throw new Error("Error al proceder al pedido");
        }

        const data = await response.json();

        if (data.success) {
            new Audio('../../songs/success.mp3').play();
            showNotification("Pedido realizado con éxito", "bg-green-500");
            document.getElementById("loadingScreen").classList.add("hidden");
            clearCartUI();
            actualizarCantidadPedido();
            actualizarCantidadCarrito();
        } else {
            new Audio('../../songs/error.mp3').play();
            showNotification("Error al proceder al pedido", "bg-red-500");
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    } catch (error) {
        document.getElementById("loadingScreen").classList.add("hidden");
        showNotification("Error al proceder al pedido", "bg-red-500");
    }
}


// Función para mostrar notificaciones
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Función para limpiar la interfaz del carrito
function clearCartUI() {
    const tableBody = document.querySelector("#cartTableBody");
    tableBody.innerHTML = "";
    document.getElementById("totalPrice").textContent = '$0.00';
}

// Asignar el evento al botón "Proceder al Pago"
document.getElementById("checkoutButton").addEventListener("click", verificarDireccionUsuario);

window.proceedToCheckout = proceedToCheckout;
