import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

// Obtener el token JWT del localStorage
const token = localStorage.getItem("jwt");

// Variable global para almacenar los usuarios
let usuarios = [];

// Función para listar usuarios
export async function listUsers() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarUsuarios`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        usuarios = data.data; // Guardar los usuarios en la variable global
        renderUserTable(usuarios); // Renderizar la tabla con todos los usuarios

        // Añadir evento al campo de búsqueda
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredUsers = usuarios.filter(user => {
                return (
                    user.username.toLowerCase().includes(searchTerm) ||
                    user.rol.toLowerCase().includes(searchTerm) ||
                    user.correo.toLowerCase().includes(searchTerm)
                );
            });
            renderUserTable(filteredUsers);
        });
    })
    .catch(error => {
        console.error("Error al cargar usuarios:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Función para renderizar la tabla de usuarios
function renderUserTable(users) {
    const userTableBody = document.getElementById("userTableBody");
    userTableBody.innerHTML = ""; // Limpiar el contenido existente en la tabla
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-3 border-b">${user.idUsuario}</td>
            <td class="p-3 border-b">
                <input type="text" value="${user.username}" class="border p-1 rounded-md w-full" id="username-${user.idUsuario}">
            </td>
            <td class="p-3 border-b">
                <input type="text" value="${user.rol}" class="border p-1 rounded-md w-full role-input" id="rol-${user.idUsuario}">
            </td>
            <td class="p-3 border-b">
                <input type="text" value="${user.correo}" class="border p-1 rounded-md w-full" id="correo-${user.idUsuario}">
            </td>
            <td class="p-3 border-b">
                <div class="actions flex md:flex-row flex-col gap-2">
                    <button onclick="updateUser(${user.idUsuario})" class="action-button bg-blue-500 text-white px-3 py-1 rounded">Actualizar</button>
                    <button onclick="deleteUser(${user.idUsuario})" class="action-button bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                </div>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Función para eliminar usuario con token
async function deleteUser(userId) {

        // Verificar y renovar el token antes de cualquier solicitud
        await verificarYRenovarToken();

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/eliminarUsuario/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
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
            showNotification("Usuario eliminado exitosamente", "bg-green-500");
            listUsers(); // Recargar la lista de usuarios
        } else {
            //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            showNotification(data.message || "Error al eliminar usuario", "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error al eliminar usuario:", error

    ))
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });;
}

// Función para actualizar usuario con token
async function updateUser(userId) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const username = document.getElementById(`username-${userId}`).value;
    const rol = document.getElementById(`rol-${userId}`).value;
    const correo = document.getElementById(`correo-${userId}`).value;

        // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/actualizarUsuario/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ username, rol, correo }),
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
            showNotification("Usuario actualizado exitosamente", "bg-green-500");
            listUsers();
        } else {
            showNotification(data.message || "Error al actualizar usuario", "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error al actualizar usuario:", error

    ))
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
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

// Cargar la lista de usuarios al iniciar la página
document.addEventListener("DOMContentLoaded", listUsers);

window.deleteUser = deleteUser;
window.updateUser = updateUser;
