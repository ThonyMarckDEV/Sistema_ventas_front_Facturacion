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

    // Posición inicial por defecto
    const defaultPosition = [-12.0464, -77.0428];
    let initialPosition = defaultPosition; // Se actualizará con la ubicación del dispositivo si está disponible.

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

    // Intentar obtener la ubicación del dispositivo
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPosition = [position.coords.latitude, position.coords.longitude];
                initialPosition = userPosition;
                map.setView(userPosition, 13);
                marker.setLatLng(userPosition);
                document.getElementById('latitud').value = userPosition[0];
                document.getElementById('longitud').value = userPosition[1];
            },
            () => {
                alert('No se pudo obtener la ubicación del dispositivo. Usa el marcador manualmente.');
                document.getElementById('latitud').value = defaultPosition[0];
                document.getElementById('longitud').value = defaultPosition[1];
            }
        );
    } else {
        alert('Geolocalización no soportada. Usa el marcador manualmente.');
        document.getElementById('latitud').value = defaultPosition[0];
        document.getElementById('longitud').value = defaultPosition[1];
    }

    // Manejar el envío del formulario
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

        // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

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
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); 
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            showNotification("Direccion agregada exitosamente", "bg-green-500");
            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");

            const data = await response.json();
            console.log(data);
            resetForm();

        } catch (error) {
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3'); 
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });
             showNotification("Error al agregar direccion ", "bg-red-500");
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    });


    function resetForm() {
        document.getElementById('direccionForm').reset();
        marker.setLatLng(initialPosition);
        map.setView(initialPosition, 13);
        document.getElementById('latitud').value = initialPosition[0];
        document.getElementById('longitud').value = initialPosition[1];
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


});
