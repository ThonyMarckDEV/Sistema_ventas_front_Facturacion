<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial de Compras</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 flex">

    <!-- Sidebar -->
    <?php include 'sidebarCLIENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64">
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold">Bienvenido,Cliente <span id="usernameDisplay"></span></h2>
            <p class="mt-2">Aquí puedes ver tus pedidos y detalles relacionados.</p>
        </div>

        <!-- Historial de Pedidos -->
        <div class="bg-white p-4 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-semibold mb-4">🛒 Historial de Pedidos</h3>
            <div id="orderHistory" class="overflow-auto max-h-96">
                <p class="text-center text-gray-600">Cargando datos...</p>
            </div>
        </div>

        <!-- Productos Más Comprados -->
        <div class="bg-white p-4 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-semibold mb-4">🔥 Productos Más Comprados</h3>
            <div id="productosMasComprados" class="overflow-auto max-h-96">
                <p class="text-center text-gray-600">Cargando datos...</p>
            </div>
        </div>
    </div>

    <!-- Archivos JavaScript -->
    <script type="module" src="../../js/historialCompras.js"></script>
    <script type="module" src="../../js/productosMasComprados.js"></script>
</body>
</html>
