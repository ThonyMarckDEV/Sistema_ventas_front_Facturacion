
import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

const jwtToken = localStorage.getItem("jwt");

document.addEventListener("DOMContentLoaded", async () => {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    if (jwtToken) {
        try {
            const decodedToken = jwt_decode(jwtToken);
            const userId = decodedToken.idUsuario;

            const response = await fetch(`${API_BASE_URL}/api/pedidos-completos/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            });
            const pedidos = await response.json();

            renderPedidos(pedidos);
        } catch (error) {
            console.error("Error al cargar los pedidos:", error);
            document.getElementById("orderHistory").innerHTML =
                '<p class="text-center text-red-600">Error al cargar los pedidos.</p>';
        }
    } else {
        document.getElementById("orderHistory").innerHTML =
            '<p class="text-center text-red-600">No se encontró el token de sesión.</p>';
    }
});

function renderPedidos(pedidos) {
    if (!Array.isArray(pedidos) || pedidos.length === 0) {
        document.getElementById("orderHistory").innerHTML =
            '<p class="text-center text-gray-600">No hay pedidos registrados.</p>';
        return;
    }

    const rows = pedidos.map(pedido => {
        // Separar productos e imágenes
        const productos = pedido.productos.split(', ');
        const imagenes = pedido.imagenes.split(', ');

        // Crear HTML para los productos
        const productosHTML = productos.map((producto, index) => `
            <div class="text-center">
                <img src="${API_BASE_URL}/storage/${imagenes[index] || 'placeholder.jpg'}" alt="${producto}" class="w-20 h-20 mx-auto mb-2 rounded-lg">
                <p class="text-sm">${producto}</p>
            </div>
            
        `).join("");

        return `
            <div class="bg-gray-100 p-4 mb-4 rounded-lg shadow-md">
                <h4 class="font-semibold">Pedido #${pedido.idPedido}</h4>
                <p>Fecha: ${new Date(pedido.fecha_pedido).toLocaleDateString()}</p>
                <p>Método de Pago: ${pedido.metodo_pago}</p>
                <p>Total: <span class="text-red-600">S/ ${parseFloat(pedido.montoPagoNegativo).toFixed(2)}</span></p>
                <div class="grid grid-cols-3 gap-4 mt-4">
                    ${productosHTML}
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("orderHistory").innerHTML = rows;
}

