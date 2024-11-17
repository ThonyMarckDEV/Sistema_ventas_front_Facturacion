<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Producto</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen flex flex-col lg:flex-row">

    <!-- Notificación -->
    <div id="notification" class="hidden fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>
    
    <!-- Sidebar -->
    <!-- <?php include 'sidebarADMIN.php'; ?> -->

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full">
        
        <!-- Encabezado -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
                <h1 class="text-2xl font-bold">Productos</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Agregar</span> &gt; <span>Agregar Producto</span>
                </nav>
            </div>
        </div>

        <!-- Contenedor de formulario y tabla -->
        <div class="w-full bg-white p-8 rounded shadow">

            <!-- Formulario de Agregar Producto -->
            <h2 class="text-2xl font-bold mb-4">Agregar Producto</h2>
            <form id="productForm" class="grid grid-cols-2 gap-4" onsubmit="event.preventDefault(); submitProductForm();">
                <div>
                    <label for="nombreProducto" class="block font-semibold">Nombre del Producto:</label>
                    <input type="text" id="nombreProducto" name="nombreProducto" required class="w-full p-2 border rounded">
                </div>

                <div>
                    <label for="descripcion" class="block font-semibold">Descripción:</label>
                    <textarea id="descripcion" name="descripcion" class="w-full p-2 border rounded"></textarea>
                </div>

                <div>
                    <label for="precio" class="block font-semibold">Precio:</label>
                    <input type="number" id="precio" name="precio" required class="w-full p-2 border rounded" step="0.01">
                </div>

                <div>
                    <label for="stock" class="block font-semibold">Stock:</label>
                    <input type="number" id="stock" name="stock" required class="w-full p-2 border rounded">
                </div>

                <div>
                    <label for="imagen" class="block font-semibold">Imagen (URL):</label>
                    <input type="file" id="imagen" name="imagen" class="w-full p-2 border rounded">
                </div>

                <div>
                    <label for="idCategoria" class="block font-semibold">Categoría:</label>
                    <select id="idCategoria" name="idCategoria" required class="w-full p-2 border rounded">
                        <!-- Opciones de categorías cargadas dinámicamente -->
                    </select>
                </div>

                <div class="col-span-2">
                    <button type="submit" class="w-full bg-black text-white py-2 rounded">Agregar Producto</button>
                </div>
            </form>

            <br>
            <!-- Formulario de Agregar Producto -->
            <h2 class="text-2xl font-bold mb-4">Listado Productos</h2>

             <!-- Barra de búsqueda y filtros -->
             <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
                <input type="text" id="searchInput" onkeyup="buscarProducto()" placeholder="Buscar" class="w-full md:w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
           <!-- Contenedor Deslizable para la Tabla -->
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border rounded shadow">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 border-b">ID</th>
                            <th class="py-2 px-4 border-b">Nombre</th>
                            <th class="py-2 px-4 border-b">Descripción</th>
                            <th class="py-2 px-4 border-b">Precio</th>
                            <th class="py-2 px-4 border-b">Stock</th>
                            <th class="py-2 px-4 border-b">Imagen</th>
                            <th class="py-2 px-4 border-b">Categoría</th> <!-- Nueva columna para el nombre de la categoría -->
                            <th class="py-2 px-4 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody">
                        <!-- Filas de productos generadas dinámicamente -->
                    </tbody>
                </table>
            </div>

        </div>
    </div>

    <script type="module" src="../../js/gestionarProductos.js"></script>
</body>
</html>
