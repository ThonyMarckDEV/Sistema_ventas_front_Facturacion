<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Dirección</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        #map {
            width: 100%;
            height: 300px;
            border-radius: 8px;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex">

    <!-- Notificación -->
    <div id="notification" class="hidden fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md z-50"></div>
        

    <!-- Sidebar -->
    <?php include 'sidebarCLIENTE.php'; ?>

     <!-- Contenido Principal -->
     <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full lg:w-full mx-auto">
        
        <!-- Encabezado -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
                <h1 class="text-2xl font-bold">Dirección</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Dirección</span> &gt; <span>Agregar Direccion</span>
                </nav>
            </div>
        </div>

        <!-- Contenedor centrado para el formulario -->
        <div class="flex justify-center">
            <!-- Formulario -->
            <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4 text-center">Detalles de la Dirección</h2>
                
                <form id="direccionForm" class="space-y-4">
                    <input type="hidden" name="idUsuario" value="1" /> <!-- ID de usuario temporal -->
                    
                    <div>
                        <label class="block text-gray-700">Región:</label>
                        <input type="text" name="region" class="w-full p-2 border rounded" required>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700">Provincia:</label>
                        <input type="text" name="provincia" class="w-full p-2 border rounded" required>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700">Dirección:</label>
                        <input type="text" name="direccion" class="w-full p-2 border rounded" required>
                    </div>

                    <div id="map" class="mb-4"></div>
                    <input type="hidden" name="latitud" id="latitud">
                    <input type="hidden" name="longitud" id="longitud">

                    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Agregar Dirección</button>
                </form>
            </div>
        </div>

    </div>

    <!-- Script para inicializar Google Maps -->
    <script>
        // Definir initMap como una función global para que Google Maps la reconozca
        let map, marker;
        const initialPosition = { lat: -12.0464, lng: -77.0428 }; // Posición predeterminada (Lima, Perú)

        window.initMap = function() {
            // Crear el mapa en la posición inicial
            map = new google.maps.Map(document.getElementById("map"), {
                center: initialPosition,
                zoom: 13,
            });

            // Crear un marcador en la posición inicial
            marker = new google.maps.Marker({
                position: initialPosition,
                map: map,
                draggable: true, // Permitir mover el marcador
            });

            // Intentar obtener la ubicación del usuario
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userPosition = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        // Centrar el mapa en la ubicación del usuario y mover el marcador
                        map.setCenter(userPosition);
                        marker.setPosition(userPosition);

                        // Actualizar los campos de latitud y longitud en el formulario
                        document.getElementById('latitud').value = userPosition.lat;
                        document.getElementById('longitud').value = userPosition.lng;
                    },
                    () => {
                        alert("No se pudo obtener la ubicación. Se usará la posición predeterminada.");
                    }
                );
            } else {
                alert("Geolocalización no soportada por el navegador.");
            }

            // Obtener coordenadas al mover el marcador manualmente
            marker.addListener('dragend', function () {
                const position = marker.getPosition();
                document.getElementById('latitud').value = position.lat();
                document.getElementById('longitud').value = position.lng();
            });

            // Obtener coordenadas al hacer clic en el mapa
            map.addListener('click', function (event) {
                marker.setPosition(event.latLng);
                document.getElementById('latitud').value = event.latLng.lat();
                document.getElementById('longitud').value = event.latLng.lng();
            });
        };

        // Función para restablecer el formulario y el marcador a su posición inicial
        function resetForm() {
            document.getElementById('direccionForm').reset();
            marker.setPosition(initialPosition);
            map.setCenter(initialPosition);
            document.getElementById('latitud').value = initialPosition.lat;
            document.getElementById('longitud').value = initialPosition.lng;
        }
    </script>

    <!-- Cargar el SDK de Google Maps y llamar a initMap -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBuzNFKH6HmqIQngXaLmeOzLAq83kf8EEA&callback=initMap" async defer></script>

    <!-- Script para manejar el envío del formulario -->
    <script>
        // Función para decodificar el JWT y obtener el payload
        function parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error("Error al decodificar el JWT:", error);
                return null;
            }
        }

        // Manejar el envío del formulario
        document.getElementById('direccionForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            formData.set('latitud', document.getElementById('latitud').value);
            formData.set('longitud', document.getElementById('longitud').value);

            // Obtener el token y decodificarlo
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("Token no encontrado. Inicia sesión nuevamente.");
                return;
            }

            // Decodificar el token y obtener el idUsuario
            const decoded = parseJwt(token);
            if (!decoded || !decoded.idUsuario) {
                alert("No se pudo obtener el ID del usuario desde el token. Revisa el token.");
                return;
            }

            // Agregar idUsuario al formulario
            formData.set('idUsuario', decoded.idUsuario);

            const API_BASE_URL = 'http://127.0.0.1:8000'; // Reemplaza con la URL de tu API

            try {
                const response = await fetch(`${API_BASE_URL}/api/agregarDireccion`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                alert('Dirección agregada con éxito');
                console.log(data);

                // Restablecer el formulario y el marcador
                resetForm();

            } catch (error) {
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>