<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedidos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen flex flex-col lg:flex-row">

    <!-- Notificación -->
    <div id="notification" class="hidden fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md z-50"></div>
    
    <!-- Sidebar -->
    <?php include 'sidebarADMIN.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full lg:w-full mx-auto">
        
        <!-- Encabezado -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
                <h1 class="text-2xl font-bold text-center lg:text-left">Pedidos</h1>
                <nav class="text-gray-500 text-sm text-center lg:text-left">
                    <span>Pedidos</span> &gt; <span>Ver Pedidos</span>
                </nav>
            </div>
        </div>

        <!-- Contenedor de Pedidos -->
        <div id="pedidosContainer" class="space-y-4">
            <!-- Los pedidos se cargarán aquí mediante JavaScript -->
        </div>

    </div>

    <!-- Modal para cambiar estado del pedido -->
    <div id="changeOrderStatusModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
        <div class="bg-white rounded-lg w-11/12 max-w-xs md:max-w-md p-6 relative">
            <button id="closeChangeOrderStatusModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="text-xl font-bold mb-4 text-center">Cambiar Estado del Pedido</h2>
            <div>
                <label for="orderStatusSelect" class="block mb-2 text-center md:text-left">Seleccione el nuevo estado:</label>
                <select id="orderStatusSelect" class="w-full p-2 border rounded">
                    <!-- Opciones se agregarán dinámicamente -->
                </select>
            </div>
            <div class="mt-4 flex flex-col space-y-2">
                <button id="confirmOrderStatusButton" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">Actualizar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Detalles del Pedido -->
    <div id="orderDetailsModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
        <div class="bg-white rounded-lg w-11/12 max-w-xs md:max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button id="closeOrderDetailsModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="text-xl font-bold mb-4 text-center">Detalles del Pedido</h2>
            <!-- Contenido del modal -->
            <div id="orderDetailsContent">
                <!-- Los detalles del pedido se cargarán aquí -->
            </div>
        </div>
    </div>

    <!-- Modal de Información de Pago -->
    <div id="paymentInfoModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
        <div class="bg-white rounded-lg w-11/12 max-w-xs md:max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button id="closePaymentInfoModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="text-xl font-bold mb-4 text-center">Información de Pago</h2>
            <!-- Contenido del modal -->
            <div id="paymentInfoContent">
                <!-- Los detalles del pago se cargarán aquí -->
            </div>
        </div>
    </div>

    <!-- Modal del Mapa -->
    <div id="mapModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden">
        <div class="bg-white rounded-lg shadow-lg p-4 max-w-full sm:max-w-lg w-full">
            <div id="map" class="h-64 w-full"></div>
            <button onclick="closeMapModal()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full">Cerrar</button>
        </div>
    </div>

    <!-- Script para cargar pedidos -->
    <script type="module" src="../../js/pedidosAdmin.js"></script>
</body>
</html>