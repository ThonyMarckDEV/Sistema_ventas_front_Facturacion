<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Carrito</title>
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
                <h1 class="text-2xl font-bold">Carrito</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Carrito</span> &gt; <span>Mi Carrito</span>
                </nav>
            </div>
        </div>

        <h2 class="text-xl font-bold mb-4">Productos en tu Carrito</h2>
    
           <!-- Contenedor de desplazamiento para la tabla -->
            <div class="overflow-auto max-w-full">
                <!-- Tabla de productos -->
                <table class="min-w-full bg-white border rounded shadow">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 border-b text-left">Producto</th>
                            <th class="py-2 px-4 border-b text-left">Cantidad</th>
                            <th class="py-2 px-4 border-b text-left">Precio Unitario</th>
                            <th class="py-2 px-4 border-b text-left">Subtotal</th>
                            <th class="py-2 px-4 border-b text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="cartTableBody">
                        <!-- Filas generadas dinámicamente -->
                    </tbody>
                </table>
            </div>

            
            <!-- Total del carrito -->
            <div class="flex justify-between items-center mt-6">
                <h3 class="text-lg font-semibold">Total:</h3>
                <span id="totalPrice" class="text-xl font-bold text-gray-800">$0.00</span>
            </div>

            <!-- Botón de proceder al pago -->
            <div class="mt-6 text-right">
                <button id="checkoutButton" class="bg-blue-500 text-white px-4 py-2 rounded">Hacer Pedido</button>
            </div>
            
        </div>

    </div>

    <!-- Script para cargar productos -->
    <script type="module" src="../../js/gestionarProductosCarrito.js"></script>
     <!-- Script para cargar productos -->
     <script type="module" src="../../js/proceedToCheckout.js"></script>
</body>
</html>
