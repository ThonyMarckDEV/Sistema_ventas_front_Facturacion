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
            console.error('Error al cargar las direcciones:', errorData.message || 'Error desconocido');
            return;
        }

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

    const response = await fetch(`${API_BASE_URL}/api/setDireccionUsando/${idDireccion}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.ok) {
        alert("Dirección establecida como 'usando'");
        loadDirecciones();
    }
}

async function eliminarDireccion(idDireccion) {
    await verificarYRenovarToken();

    const response = await fetch(`${API_BASE_URL}/api/eliminarDireccion/${idDireccion}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.ok) {
        alert("Dirección eliminada");
        loadDirecciones();
    }
}

// Cargar las direcciones al cargar la página
loadDirecciones();
window.verMapa = verMapa;
window.closeMapModal = closeMapModal;
window.setUsando = setUsando;
window.eliminarDireccion = eliminarDireccion;
