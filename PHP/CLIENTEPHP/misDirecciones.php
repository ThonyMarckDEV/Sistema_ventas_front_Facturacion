<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Direcciones</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
                <h1 class="text-2xl font-bold">Mis Direcciones</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Dirección</span> &gt; <span>Mis Direcciones</span>
                </nav>
            </div>
        </div>

        <!-- Tabla de Direcciones -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg shadow">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left">Región</th>
                        <th class="px-4 py-2 text-left">Provincia</th>
                        <th class="px-4 py-2 text-left">Dirección</th>
                        <th class="px-4 py-2 text-left">Estado</th>
                        <th class="px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody id="direccionesTableBody">
                    <!-- Las direcciones se cargarán aquí por JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal para ver la dirección en el mapa -->
    <div id="mapModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-4 rounded-lg w-full max-w-md relative">
            <h2 class="text-xl font-semibold mb-4">Ver Dirección en el Mapa</h2>
            <div id="map" style="width:100%; height:300px;" class="rounded-lg"></div>
            <button onclick="closeMapModal()" class="absolute top-2 right-2 text-gray-500">Cerrar</button>
        </div>
    </div>
   <!-- Gestioanr direcciones js -->
   <script type="module" src="../../js/gestionarDirecciones.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBuzNFKH6HmqIQngXaLmeOzLAq83kf8EEA" async defer></script>
</body>
</html>
