import API_BASE_URL from './urlHelper.js';
import { actualizarCantidadCarrito } from './contadorCarrito.js';
const token = localStorage.getItem("jwt");
import { verificarYRenovarToken } from './authToken.js';

// Función para cargar los productos del carrito
export async function loadCartProducts() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    // // Mostrar el loader
    // document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/carrito`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar productos del carrito");
        }
        return response.json();
    })
    .then(data => {
        if (data && data.data) {
            renderCartTable(data.data); // Solo llama a renderCartTable si data está definido
        } else {
            console.error("Datos del carrito no encontrados o vacíos.");
        }
    })
    .catch(
        error => console.error("Error al cargar productos del carrito:", error

    )).finally(() => {
        // // Ocultar el loader después de la operación
        // document.getElementById("loadingScreen").classList.add("hidden");
    });;
}

function renderCartTable(products) {
    const tableBody = document.querySelector("#cartTableBody");
    tableBody.innerHTML = ""; // Limpia el contenido anterior

    let total = 0; // Variable para acumular el total del carrito

    products.forEach(product => {
        const precio = Number(product.precio);
        const cantidad = Number(product.cantidad);
        const stock = Number(product.stock); // Asegurarse de que 'stock' tenga el valor correcto

        // Verificación adicional para asegurar que 'stock' es válido
        if (isNaN(stock)) {
            console.error(`Error: El stock no es un número válido para el producto ID: ${product.idProducto}`);
            return; // Salta este producto si el stock no es válido
        }

        const subtotal = precio * cantidad;
        total += subtotal; // Acumula el subtotal al total

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.nombreProducto}</td>
            <td>
                <input type="number" min="1" value="${cantidad}"
                    data-id="${product.idProducto}" 
                    data-stock="${stock}"
                    class="cantidad-input w-16 px-2 py-1 border rounded text-center">
            </td>
            <td>$${precio.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button onclick="removeProduct(${product.idProducto})" class="bg-red-500 text-white px-2 py-1 rounded">
                    Eliminar
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById("totalPrice").textContent = `$${total.toFixed(2)}`;

    const cantidadInputs = document.querySelectorAll(".cantidad-input");
    cantidadInputs.forEach(input => {
        input.addEventListener("change", handleQuantityChange);
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                handleQuantityChange.call(this, event);
            }
        });
    });
}

function handleQuantityChange(event) {
    const input = event.target;
    const idProducto = input.getAttribute("data-id");
    const nuevaCantidad = Number(input.value);
    
    // Obtener y validar el stock disponible
    let stockDisponible = Number(input.getAttribute("data-stock"));
    if (isNaN(stockDisponible)) {
        showNotification("No se pudo obtener el stock disponible. Intente nuevamente más tarde.", "bg-red-500");
        
        const sonidoError = new Audio('../../songs/error.mp3');
        sonidoError.play().catch(error => console.error("Error al reproducir el sonido:", error));

        input.value = 1; // Restablecer a 1 en caso de error
        return;
    }

    console.log(`Cantidad ingresada: ${nuevaCantidad}, Stock disponible: ${stockDisponible}`);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        showNotification("Cantidad inválida. Por favor, ingresa un número mayor o igual a 1.", "bg-red-500");

        const sonidoError = new Audio('../../songs/error.mp3');
        sonidoError.play().catch(error => console.error("Error al reproducir el sonido:", error));

        input.value = 1; // Restablecer a 1 en caso de cantidad no válida
        return;
    }

    if (nuevaCantidad > stockDisponible) {
        showNotification("La cantidad solicitada supera el stock disponible. Restableciendo al máximo permitido.", "bg-red-500");

        const sonidoError = new Audio('../../songs/error.mp3');
        sonidoError.play().catch(error => console.error("Error al reproducir el sonido:", error));

        input.value = stockDisponible; // Restablece la cantidad al máximo permitido
        return;
    }

    // Mostrar el loader antes de la actualización en el backend
    document.getElementById("loadingScreen").classList.remove("hidden");

    // Realizar la actualización en el backend si la cantidad es válida
    updateQuantity(idProducto, nuevaCantidad);
}

async function updateQuantity(idProducto, cantidad) {

        // Verificar y renovar el token antes de cualquier solicitud
        await verificarYRenovarToken();

    const input = document.querySelector(`input[data-id="${idProducto}"]`);

    // Obtener y validar el stock disponible
    let stockDisponible = Number(input.getAttribute("data-stock"));
    if (isNaN(stockDisponible)) {
        console.error(`Error: El stock disponible no es un número válido para el producto ID: ${idProducto}`);
        alert("No se pudo obtener el stock disponible. Intente nuevamente más tarde.");
        return;
    }

    console.log(`Actualizando cantidad a ${cantidad} para el producto ID: ${idProducto}, con stock disponible: ${stockDisponible}`);

    // Mostrar el loader
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/carrito_detalle/${idProducto}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cantidad })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                document.getElementById("loadingScreen").classList.add("hidden");

                if (data.message === "La cantidad solicitada supera el stock disponible") {
                    alert(data.message);
                    input.value = stockDisponible; // Restablece al stock disponible máximo
                    console.log(`Restableciendo cantidad a ${stockDisponible} para el producto ID: ${idProducto}`);
                }
                
                throw new Error(data.message || "Error al actualizar cantidad");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const sonido = new Audio('../../songs/success.mp3'); 
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            showNotification("Cantidad actualizada exitosamente", "bg-green-500");
            loadCartProducts(); // Recargar el carrito
            actualizarCantidadCarrito();
        } else {
            const sonido = new Audio('../../songs/error.mp3'); 
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            showNotification("Error al actualizar cantidad", "bg-red-500");
            console.error("Error al actualizar cantidad:", data.message);
        }
    })
    .catch(error => {
        console.error("Error al actualizar cantidad:", error);
        const sonido = new Audio('../../songs/error.mp3'); 
        sonido.play().catch(function(error) {
            console.error("Error al reproducir el sonido:", error);
        });
        showNotification("Error al actualizar cantidad", "bg-red-500");
    })
    .finally(() => {
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
    });
}


// Función para eliminar un producto del carrito
async function removeProduct(idProducto) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    if (!confirm("¿Estás seguro de que deseas eliminar este producto del carrito?")) {
        return;
    }

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");


    fetch(`${API_BASE_URL}/api/carrito_detalle/${idProducto}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                   // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
                throw new Error(data.message || "Error al eliminar producto");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
             // Reproducir el sonido success
             var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });
             //=============================================================
            showNotification("Producto eliminado exitosamente", "bg-green-500");
               // Ocultar el loader después de la operación
               document.getElementById("loadingScreen").classList.add("hidden");
            loadCartProducts(); // Recargar el carrito
            actualizarCantidadCarrito();
        } else {
            console.error("Error al eliminar producto:", data.message);
             // Reproducir el sonido error
        var sonido = new Audio('../../songs/error.mp3'); // Asegúrate de que la ruta sea correcta
        sonido.play().catch(function(error) {
            console.error("Error al reproducir el sonido:", error);
        });
        //=============================================================
        showNotification("Error al eliminar producto", "bg-red-500");
           // Ocultar el loader después de la operación
           document.getElementById("loadingScreen").classList.add("hidden");
        }
    })
    .catch(error => {
        console.error("Error al eliminar producto:", error);
               // Reproducir el sonido error
               var sonido = new Audio('../../songs/error.mp3'); // Asegúrate de que la ruta sea correcta
               sonido.play().catch(function(error) {
                   console.error("Error al reproducir el sonido:", error);
               });
               //=============================================================
               showNotification("Error al eliminar producto", "bg-red-500");
                  // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
    });
}

// Cargar los productos del carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadCartProducts();
});

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


window.updateQuantity = updateQuantity;
window.removeProduct = removeProduct;
