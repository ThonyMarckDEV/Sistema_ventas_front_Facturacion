import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

const token = localStorage.getItem("jwt");
let categories = []; // Variable global para almacenar las categorías cargadas
// Mostrar notificación
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Enviar el formulario de categoría
async function submitCategoryForm() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const form = document.getElementById("categoryForm");
    const formData = new FormData(form);

    //Mostrar loader de carga
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/agregarCategoria`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); 
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");
            showNotification("Categoría agregada exitosamente", "bg-green-500");
            form.reset();
            listCategories(); // Actualiza la lista de categorías
        } else {
              // Reproducir el sonido error
              var sonido = new Audio('../../songs/error.mp3');
              sonido.play().catch(function(error) {
                  console.error("Error al reproducir el sonido:", error);
              });           
             //=============================================================          
            showNotification(data.message || "Error al agregar categoría", "bg-red-500");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Cargar y listar categorías
async function listCategories() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarCategorias`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        categories = data.data; // Almacena las categorías en la variable global
        renderCategoryTable(categories);
    })
    .catch(error => console.error("Error al cargar categorías:", error));
}

function renderCategoryTable(categories) {
    const categoryTableBody = document.getElementById("categoryTableBody");
    categoryTableBody.innerHTML = "";

    categories.forEach(category => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3 border-b">${category.idCategoria}</td>
            <td class="p-3 border-b">
                <input type="text" value="${category.nombreCategoria}" class="border p-1 rounded-md w-full" id="nombreCategoria-${category.idCategoria}">
            </td>
            <td class="p-3 border-b">
                <textarea class="border p-1 rounded-md w-full" id="descripcion-${category.idCategoria}">${category.descripcion || ''}</textarea>
            </td>
            <td class="p-3 border-b flex space-x-2">
                <button onclick="updateCategory(${category.idCategoria})" class="bg-blue-500 text-white px-3 py-1 rounded">Actualizar</button>
                <button onclick="deleteCategory(${category.idCategoria})" class="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
            </td>
        `;

        categoryTableBody.appendChild(row);
    });
}

// Función para eliminar una categoría
async function deleteCategory(id) {

     // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    //Mostrar loader de carga
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/eliminarCategoria/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reproducir el sonido success
                var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
                sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================       
            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden"); 
            showNotification("Categoría eliminada exitosamente", "bg-green-500");
            listCategories(); // Actualiza la lista de categorías
        } else {
                  // Reproducir el sonido error
                  var sonido = new Audio('../../songs/error.mp3');
                  sonido.play().catch(function(error) {
                      console.error("Error al reproducir el sonido:", error);
                  });           
                 //=============================================================    
             // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");   
            showNotification(data.message || "Error al eliminar categoría", "bg-red-500");
        }
    })
    .catch(error => console.error("Error al eliminar categoría:", error));
}

async function updateCategory(id) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const nombreCategoria = document.getElementById(`nombreCategoria-${id}`).value;
    const descripcion = document.getElementById(`descripcion-${id}`).value;


    //Mostrar loader de carga
    document.getElementById("loadingScreen").classList.remove("hidden");


    fetch(`${API_BASE_URL}/api/actualizarCategoria/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombreCategoria: nombreCategoria,
            descripcion: descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
                   // Reproducir el sonido success
                   var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
                   sonido.play().catch(function(error) {
                       console.error("Error al reproducir el sonido:", error);
                   });
                   //=============================================================   
             // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");     
            showNotification("Categoría actualizada exitosamente", "bg-green-500");
            listCategories(); // Refresca la lista de categorías después de actualizar
        } else {
                 // Reproducir el sonido error
                 var sonido = new Audio('../../songs/error.mp3');
                 sonido.play().catch(function(error) {
                     console.error("Error al reproducir el sonido:", error);
                 });           
                //=============================================================           
                 // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");     
            showNotification(data.message || "Error al actualizar categoría", "bg-red-500");
        }
    })
    .catch(error => console.error("Error al actualizar categoría:", error));
}

// Función para buscar categorías
function filterCategories() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredCategories = categories.filter(category => 
        category.nombreCategoria.toLowerCase().includes(searchTerm) ||
        (category.descripcion && category.descripcion.toLowerCase().includes(searchTerm))
    );
    renderCategoryTable(filteredCategories);
}


// Cargar categorías al iniciar
document.addEventListener("DOMContentLoaded", () => {
    listCategories();
});

window.submitCategoryForm = submitCategoryForm;
window.deleteCategory = deleteCategory;
window.updateCategory = updateCategory;
window.filterCategories = filterCategories;