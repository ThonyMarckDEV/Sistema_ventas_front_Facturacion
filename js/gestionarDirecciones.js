import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';

// Obtener el token JWT desde localStorage
const token = localStorage.getItem('jwt');

// Función para decodificar el JWT y obtener el payload
function parseJwt(token) {
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

// Obtener el idUsuario del token JWT
const decodedToken = parseJwt(token);
const idUsuario = decodedToken ? decodedToken.idUsuario : null;

async function loadDirecciones() {
    await verificarYRenovarToken();

    if (!idUsuario) {
        console.error("idUsuario no encontrado en el token");
        return;
    }

        // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

    try {
        const response = await fetch(`${API_BASE_URL}/api/listarDireccion/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");
            console.error('Error al cargar las direcciones:', errorData.message || 'Error desconocido');
            return;
        }
         // // Ocultar el loader después de la operación
         document.getElementById("loadingScreen").classList.add("hidden");

        const direcciones = await response.json();
        console.log('Direcciones recibidas:', direcciones);

        const tableBody = document.getElementById('direccionesTableBody');
        tableBody.innerHTML = '';

        direcciones.forEach(direccion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${direccion.region}</td>
                <td class="px-4 py-2">${direccion.provincia}</td>
                <td class="px-4 py-2">${direccion.direccion}</td>
                <td class="px-4 py-2">${direccion.estado}</td>
                <td class="px-4 py-2">
                    <button onclick="verMapa(${direccion.latitud}, ${direccion.longitud})" class="text-blue-500 mr-2">Ver</button>
                    <button onclick="setUsando(${direccion.idDireccion})" class="text-green-500 mr-2">Usar</button>
                    <button onclick="eliminarDireccion(${direccion.idDireccion})" class="text-red-500">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
         // // Ocultar el loader después de la operación
         document.getElementById("loadingScreen").classList.add("hidden");
        console.error('Error al realizar la solicitud:', error);
    }
}

// Función para ver la dirección en el mapa con Leaflet
function verMapa(latitud, longitud) {
    document.getElementById('mapModal').classList.remove('hidden');
    const map = L.map('map').setView([latitud, longitud], 15);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Agregar marcador
    L.marker([latitud, longitud]).addTo(map);
}

// Función para cerrar el modal del mapa
function closeMapModal() {
    document.getElementById('mapModal').classList.add('hidden');
}

// Funciones `setUsando` y `eliminarDireccion` sin cambios, excepto los llamados a cargar direcciones
async function setUsando(idDireccion) {
    await verificarYRenovarToken();

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    const response = await fetch(`${API_BASE_URL}/api/setDireccionUsando/${idDireccion}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.ok) {
        loadDirecciones();
         // // Ocultar el loader después de la operación
         document.getElementById("loadingScreen").classList.add("hidden");
          // Reproducir el sonido success
           var sonido = new Audio('../../songs/success.mp3'); 
             sonido.play().catch(function(error) {
             console.error("Error al reproducir el sonido:", error);
            });
            showNotification("Direccion establecida como predeterminada exitosamente", "bg-green-500");
    }else{
         // // Ocultar el loader después de la operación
         document.getElementById("loadingScreen").classList.add("hidden");
          // Reproducir el sonido error
          var sonido = new Audio('../../songs/error.mp3'); 
          sonido.play().catch(function(error) {
              console.error("Error al reproducir el sonido:", error);
          });
          showNotification("Error al establecer direccion como predeterminada", "bg-red-500");
    }
}

async function eliminarDireccion(idDireccion) {
    await verificarYRenovarToken();

    // Mostrar el loader al enviar la solicitud
    document.getElementById("loadingScreen").classList.remove("hidden");

    try {
        const response = await fetch(`${API_BASE_URL}/api/eliminarDireccion/${idDireccion}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            }
        });

        // Leer la respuesta JSON
        const data = await response.json();

        if (response.ok) {
            // Acción exitosa
            loadDirecciones();

            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");

            // Reproducir el sonido de éxito
            const sonido = new Audio('../../songs/success.mp3');
            sonido.play().catch((error) => {
                console.error("Error al reproducir el sonido de éxito:", error);
            });

            // Mostrar la notificación de éxito
            showNotification(data.message || "Dirección eliminada exitosamente", "bg-green-500");
        } else {
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
            // Manejo de errores del servidor
            throw new Error(data.message || "Error desconocido del servidor");
        }
    } catch (error) {
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");

        // Reproducir el sonido de error
        const sonido = new Audio('../../songs/error.mp3');
        sonido.play().catch((error) => {
            console.error("Error al reproducir el sonido de error:", error);
        });

        // Mostrar la notificación de error con el mensaje recibido
        showNotification(error.message || "Error al eliminar la dirección", "bg-red-500");
    }
}

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

// Cargar las direcciones al cargar la página
loadDirecciones();
window.verMapa = verMapa;
window.closeMapModal = closeMapModal;
window.setUsando = setUsando;
window.eliminarDireccion = eliminarDireccion;
