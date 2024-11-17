<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Categoría</title>
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
                <h1 class="text-2xl font-bold">Categoría</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Agregar</span> &gt; <span>Agregar Categoría</span>
                </nav>
            </div>
        </div>

        <!-- Contenedor de formulario y tabla -->
        <div class="w-full bg-white p-8 rounded shadow">
            
            <!-- Formulario de Agregar Categoría -->
            <h2 class="text-2xl font-bold mb-4">Agregar Categoría</h2>
            <form id="categoryForm" class="grid grid-cols-1 gap-4 mb-8" onsubmit="event.preventDefault(); submitCategoryForm();">
                <div>
                    <label for="nombreCategoria" class="block font-semibold">Nombre de la Categoría:</label>
                    <input type="text" id="nombreCategoria" name="nombreCategoria" required class="w-full p-2 border rounded">
                </div>

                <div>
                    <label for="descripcion" class="block font-semibold">Descripción (opcional):</label>
                    <textarea id="descripcion" name="descripcion" class="w-full p-2 border rounded"></textarea>
                </div>

                <div class="col-span-1">
                    <button type="submit" class="w-full bg-black text-white py-2 rounded">Agregar Categoría</button>
                </div>
            </form>

            <!-- Campo de Búsqueda -->
            <div class="mb-4">
                <input type="text" id="searchInput" placeholder="Buscar categoría..." class="w-full p-2 border rounded" oninput="filterCategories()">
            </div>

            <!-- Encabezado de la Tabla de Categorías -->
            <h2 class="text-2xl font-bold mb-4">Lista de Categorías</h2>

            <!-- Contenedor Deslizable para la Tabla -->
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border rounded shadow">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 border-b">ID</th>
                            <th class="py-2 px-4 border-b">Nombre</th>
                            <th class="py-2 px-4 border-b">Descripción</th>
                            <th class="py-2 px-4 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="categoryTableBody">
                        <!-- Filas de categorías generadas dinámicamente -->
                    </tbody>
                </table>
            </div>


        </div>
    </div>

    <script type="module" src="../../js/gestionarCategorias.js"></script>
</body>
</html>