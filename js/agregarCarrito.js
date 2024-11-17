import API_BASE_URL from './urlHelper.js';
import { actualizarCantidadCarrito } from './contadorCarrito.js';

import { verificarYRenovarToken } from './authToken.js';


let selectedProductId = null;

let selectedProductStock = 0; 

let selectedProductCantidadEnCarrito = 0; 

export function showModal(idProducto, nombreProducto, stockProducto, cantidadEnCarrito) {
    selectedProductId = idProducto;
    selectedProductStock = stockProducto;
    selectedProductCantidadEnCarrito = cantidadEnCarrito || 0; 
    const modal = document.getElementById("modal");
    document.getElementById("modalProductName").textContent = nombreProducto;
    document.getElementById("cantidadInput").value = 1; 
    modal.classList.remove("hidden");
}

// Ocultar el modal
function hideModal() {
    document.getElementById("modal").classList.add("hidden");
}

// Actualizar la cantidad en el input
function updateCantidad(increment) {
    
    const cantidadInput = document.getElementById("cantidadInput");
    let cantidad = parseInt(cantidadInput.value) || 1;
    cantidad = increment ? cantidad + 1 : cantidad - 1;
    cantidadInput.value = cantidad > 0 ? cantidad : 1;
}

// Validar la entrada manual de cantidad para que no exceda el stock
document.getElementById("cantidadInput").addEventListener("input", () => {
    const cantidadInput = document.getElementById("cantidadInput");
    let cantidad = parseInt(cantidadInput.value);

    // Verificar que la cantidad sea válida y no supere el stock
    if (cantidad > selectedProductStock) {
        showNotification("La cantidad supera el stock disponible", "bg-red-500");
        cantidadInput.value = selectedProductStock; // Limitar al stock disponible
    } else if (cantidad < 1) {
        cantidadInput.value = 1; // No permitir valores menores a 1
    }
});

// Función para descifrar el JWT y obtener el payload
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Función para agregar el producto al carrito
export async function agregarAlCarrito() {
    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    const token = localStorage.getItem("jwt");
    const cantidad = parseInt(document.getElementById("cantidadInput").value);

    // Extrae el idUsuario desde el token JWT
    const payload = parseJwt(token);
    const idUsuario = payload.idUsuario;

    // Calcular la cantidad total después de agregar la nueva cantidad
    const cantidadTotal = selectedProductCantidadEnCarrito + cantidad;

    // Verificar stock antes de enviar la solicitud
    if (cantidadTotal > selectedProductStock) {
        showNotification("La cantidad total supera el stock disponible", "bg-red-500");
        hideModal(); // Cerrar el modal si la cantidad supera el stock
        return;
    }

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    try {
        const response = await fetch(`${API_BASE_URL}/api/agregarCarrito`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                idProducto: selectedProductId,
                cantidad: cantidad,
                idUsuario: idUsuario
            })
        });

        const data = await response.json();

        if (response.ok) {
            const sonido = new Audio('../../songs/success.mp3');
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            showNotification("Productos agregados al carrito exitosamente", "bg-green-500");
            hideModal(); // Cerrar el modal al agregar con éxito
            actualizarCantidadCarrito();
        } else {
            const sonido = new Audio('../../songs/error.mp3');
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            showNotification(data.message || "Error al agregar productos al carrito", "bg-red-500");
            hideModal(); // Cerrar el modal en caso de error en el backend
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al agregar producto al carrito");
        hideModal(); // Cerrar el modal en caso de error en el frontend
    } finally {
        document.getElementById("loadingScreen").classList.add("hidden");
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


document.getElementById("incrementBtn").addEventListener("click", () => updateCantidad(true));
document.getElementById("decrementBtn").addEventListener("click", () => updateCantidad(false));
document.getElementById("addToCartBtn").addEventListener("click", agregarAlCarrito);
document.getElementById("closeModalBtn").addEventListener("click", hideModal);
// Agrega esta línea al final de fetchProductos.js
window.showModal = showModal;