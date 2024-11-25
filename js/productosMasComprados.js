import API_BASE_URL from './urlHelper.js';

document.addEventListener("DOMContentLoaded", async () => {
    const productosMasCompradosContainer = document.getElementById("productosMasComprados");

    const token = localStorage.getItem("jwt");

    try {
        const response = await fetch(`${API_BASE_URL}/api/productos-mas-comprados`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const productos = await response.json();

        if (!Array.isArray(productos) || productos.length === 0) {
            productosMasCompradosContainer.innerHTML = '<p class="text-center text-gray-600">No hay datos disponibles.</p>';
            return;
        }

        const productosHTML = productos.map(producto => `
            <div class="flex items-center space-x-4 mb-4">
                <img src="${API_BASE_URL}/storage/${producto.imagen}" alt="${producto.nombreProducto}" class="w-16 h-16 rounded-lg">
                <div>
                    <p class="text-gray-800 font-semibold">${producto.nombreProducto}</p>
                    <p class="text-gray-600">Cantidad Vendida: ${producto.cantidadVendida}</p>
                </div>
            </div>
        `).join("");

        productosMasCompradosContainer.innerHTML = productosHTML;
    } catch (error) {
        console.error("Error al cargar los productos más comprados:", error);
        productosMasCompradosContainer.innerHTML = '<p class="text-center text-red-600">Error al cargar los datos.</p>';
    }
});