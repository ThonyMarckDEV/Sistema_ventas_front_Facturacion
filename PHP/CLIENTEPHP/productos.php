<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen flex flex-col lg:flex-row">

 <!-- Notificación -->
 <div id="notification" class="hidden fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>
    

    <!-- Sidebar -->
    <?php include 'sidebarCLIENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full lg:w-full mx-auto">
        
        <!-- Encabezado -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
                <h1 class="text-2xl font-bold">Catálogo</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Productos</span> &gt; <span>Listado</span>
                </nav>
            </div>
        </div>

        <!-- Tabla de Productos -->
        <div class="bg-white rounded-lg shadow-md p-4 lg:p-6">

            <!-- Barra de búsqueda y filtros -->
            <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
                <input type="text" id="searchInput" onkeyup="buscarProducto()" placeholder="Buscar" class="w-full md:w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <!-- Tabla responsive -->
            <div class="overflow-x-auto">
                <table id="productosTable" class="w-full min-w-full border-collapse">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Descripción</th>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Categoría</th>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Imagen</th>
                            <th class="p-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm">
                        <!-- Los datos de los productos se agregarán aquí dinámicamente -->
                    </tbody>
                </table>
            </div>

        </div>
    </div>
    
<!-- Modal agregar carrito -->
<div id="modal" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg w-80">
        <h2 id="modalProductName" class="text-xl font-bold mb-4">Producto</h2>
        <div class="flex items-center justify-center mb-4">
            <button id="decrementBtn" class="bg-gray-200 px-4 py-2 font-bold">-</button>
            <input id="cantidadInput" type="number" class="w-12 text-center border mx-2" min="1">
            <button id="incrementBtn" class="bg-gray-200 px-4 py-2 font-bold">+</button>
        </div>
        <button id="addToCartBtn" class="w-full bg-blue-500 text-white font-bold py-2 rounded">Agregar al Carrito</button>
        <button id="closeModalBtn" class="w-full bg-red-500 text-white font-bold py-2 rounded mt-2">Cerrar</button>
    </div>
</div>


    <!-- Script para cargar productos -->
    <script type="module" src="../../js/listarProductosCliente.js"></script>
</body>
</html>
