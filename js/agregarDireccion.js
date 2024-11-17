import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';

// Función para decodificar el JWT y obtener el payload
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el JWT:", error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let map, marker;

    // Posición inicial (Lima, Perú)
    const initialPosition = [-12.0464, -77.0428];

    // Inicializar el mapa
    map = L.map('map').setView(initialPosition, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Agregar marcador arrastrable
    marker = L.marker(initialPosition, { draggable: true }).addTo(map);

    // Actualizar coordenadas al mover el marcador
    marker.on('dragend', function (event) {
        const position = event.target.getLatLng();
        document.getElementById('latitud').value = position.lat;
        document.getElementById('longitud').value = position.lng;
    });

    // Intentar obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPosition = [position.coords.latitude, position.coords.longitude];
                map.setView(userPosition, 13);
                marker.setLatLng(userPosition);
                document.getElementById('latitud').value = userPosition[0];
                document.getElementById('longitud').value = userPosition[1];
            },
            () => {
                alert('No se pudo obtener la ubicación. Usa el marcador manualmente.');
            }
        );
    }

    document.getElementById('direccionForm').addEventListener('submit', async function (e) {
        e.preventDefault();
    
        await verificarYRenovarToken();
    
        const token = localStorage.getItem("jwt");
        const decoded = parseJwt(token);
    
        if (!decoded || !decoded.idUsuario) {
            alert("No se pudo obtener el ID del usuario desde el token. Inicia sesión nuevamente.");
            return;
        }
    
        const idUsuario = decoded.idUsuario; // ID del usuario desde el token
        const formData = new FormData(e.target);
        formData.set('latitud', document.getElementById('latitud').value);
        formData.set('longitud', document.getElementById('longitud').value);
        formData.set('idUsuario', idUsuario); // Agregar idUsuario al formData
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/agregarDireccion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Error al enviar los datos');
            }
    
            const data = await response.json();
            alert('Dirección agregada con éxito');
            console.log(data);
    
            // Restablecer el formulario
            resetForm();
    
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo agregar la dirección');
        }
    });

    function resetForm() {
        document.getElementById('direccionForm').reset();
        marker.setLatLng(initialPosition);
        map.setView(initialPosition, 13);
        document.getElementById('latitud').value = initialPosition[0];
        document.getElementById('longitud').value = initialPosition[1];
    }
});
