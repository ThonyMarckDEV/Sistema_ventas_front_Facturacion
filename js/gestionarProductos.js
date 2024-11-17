import API_BASE_URL from './urlHelper.js';


import { verificarYRenovarToken } from './authToken.js';

const token = localStorage.getItem("jwt");
let categorias = []; // Declaración global de la variable `categorias`

// Cargar categorías para el select
async function loadCategories() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarCategorias`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        categorias = data.data; // Guardar las categorías en la variable global `categorias`

        // Agregar las categorías al select en el DOM
        const categorySelect = document.getElementById("idCategoria");
        categorySelect.innerHTML = ""; // Limpiar opciones anteriores
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.idCategoria;
            option.textContent = categoria.nombreCategoria;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error al cargar categorías:", error));
}

// Función para listar productos
async function listProducts() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarProductos`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        renderProductTable(data.data);
    })
    .catch(error => console.error("Error al cargar productos:", error));
}

function renderProductTable(products) {
    const productTableBody = document.getElementById("productTableBody");
    productTableBody.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3 border-b">${product.idProducto}</td>
            <td class="p-3 border-b">
                <input type="text" value="${product.nombreProducto}" class="border p-1 rounded-md w-full" id="nombreProducto-${product.idProducto}">
            </td>
            <td class="p-3 border-b">
                <textarea class="border p-1 rounded-md w-full" id="descripcion-${product.idProducto}">${product.descripcion}</textarea>
            </td>
            <td class="p-3 border-b">
                <input type="number" value="${product.precio}" class="border p-1 rounded-md w-full" id="precio-${product.idProducto}" step="0.01">
            </td>
            <td class="p-3 border-b">
                <input type="number" value="${product.stock}" class="border p-1 rounded-md w-full" id="stock-${product.idProducto}">
            </td>
            <td class="p-3 border-b">
                ${product.imagen ? `<img src="${product.imagen}" alt="Producto" class="h-12 w-12 object-cover mb-2">` : ""}
                <input type="file" class="border p-1 rounded-md w-full" id="imagen-${product.idProducto}">
            </td>
            <td class="p-3 border-b">
                <select class="border p-1 rounded-md w-full" id="idCategoria-${product.idProducto}">
                    ${categorias.map(cat => `<option value="${cat.idCategoria}" ${cat.idCategoria === product.idCategoria ? "selected" : ""}>${cat.nombreCategoria}</option>`).join("")}
                </select>
            </td>
            <td class="p-3 border-b flex space-x-2">
                <button onclick="updateProduct(${product.idProducto})" class="bg-blue-500 text-white px-3 py-1 rounded">Actualizar</button>
                <button onclick="deleteProduct(${product.idProducto})" class="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}


function buscarProducto() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#productTableBody tr");

    // Verificar qué se está buscando
    console.log("Texto de búsqueda: ", input);

    rows.forEach(row => {
        // Obtener el nombre del producto en la columna 1 (index 1)
        const productoNombre = row.children[1].querySelector("input").value.toLowerCase();
        if (productoNombre.includes(input)) {
            row.style.display = ""; // Mostrar fila
        } else {
            row.style.display = "none"; // Ocultar fila
        }
    });

    // Verificar qué filas están visibles después de la búsqueda
    console.log("Filas después de la búsqueda:", rows);
}


// Función para enviar el formulario de producto
async function submitProductForm() {
    
    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const form = document.getElementById("productForm");
    const formData = new FormData(form);

    //Mostrar loader de carga
    document.getElementById("loadingScreen").classList.remove("hidden");


    fetch(`${API_BASE_URL}/api/agregarProducto`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
            showNotification("Producto agregado exitosamente", "bg-green-500");   
            form.reset();
            listProducts();
        } else {
            //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
            showNotification(data.message || "Error al agregar producto", "bg-red-500");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Función para actualizar un producto con método PUT
window.updateProduct = async function(id) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const nombreProducto = document.getElementById(`nombreProducto-${id}`).value;
    const descripcion = document.getElementById(`descripcion-${id}`).value;
    const precio = parseFloat(document.getElementById(`precio-${id}`).value);
    const stock = parseInt(document.getElementById(`stock-${id}`).value);
    const idCategoria = document.getElementById(`idCategoria-${id}`).value;
    const imagen = document.getElementById(`imagen-${id}`).files[0];
    const formData = new FormData();

    formData.append('nombreProducto', nombreProducto);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('idCategoria', idCategoria);
    if (imagen) formData.append('imagen', imagen);

    //Mostrar loader de carga
    document.getElementById("loadingScreen").classList.remove("hidden");
    

    fetch(`${API_BASE_URL}/api/actualizarProducto/${id}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
             // Ocultar el loader después de la operación
              document.getElementById("loadingScreen").classList.add("hidden");
            showNotification("Producto actualizado exitosamente", "bg-green-500");
            listProducts();
        } else {
              //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
           // Ocultar el loader después de la operación
           document.getElementById("loadingScreen").classList.add("hidden");
            showNotification(data.message || "Error al actualizar producto", "bg-red-500");
        }
    })
    .catch(error => console.error("Error al actualizar producto:", error));
};

// Función para eliminar un producto
window.deleteProduct = async function(id) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

     //Mostrar loader de carga
     document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/eliminarProducto/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
           //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
            showNotification("Producto eliminado exitosamente", "bg-green-500");   
            listProducts();
        } else {
            //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
            showNotification(data.message || "Error al eliminar producto", "bg-red-500");
        }
    })
    .catch(error => console.error("Error al eliminar producto:", error));
};

// Función para mostrar la notificación
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Llama a loadCategories al inicio para cargar las categorías
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    listProducts();
});


window.submitProductForm = submitProductForm;
window.buscarProducto = buscarProducto;