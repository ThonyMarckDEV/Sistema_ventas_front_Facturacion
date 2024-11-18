<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Dirección</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
    <style>
         #map {
            width: 100%;
            height: 300px;
            border-radius: 8px;
            z-index: 10;
        }


        @media (max-width: 768px) {
            #map {
                height: 200px;
            }
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
                    <span>Dirección</span> &gt; <span>Agregar Dirección</span>
                </nav>
            </div>
        </div>

        <!-- Contenedor centrado para el formulario -->
        <div class="flex justify-center">
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

                     <!-- Contenedor del mapa -->
                     <div>
                        <label class="block text-gray-700 mb-2">Ubicación:</label>
                        <div id="map" class="mb-4"></div>
                        <input type="hidden" name="latitud" id="latitud">
                        <input type="hidden" name="longitud" id="longitud">
                    </div>

                    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Agregar Dirección</button>
                </form>
            </div>
        </div>
    </div>

    <script src="../../js/agregarDireccion.js" type="module"></script>
</body>
</html>
