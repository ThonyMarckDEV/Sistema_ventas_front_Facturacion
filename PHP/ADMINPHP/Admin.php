<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cliente</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    </head>
    <body class="bg-gray-100 flex">

        <!-- Sidebar -->
        <?php include 'sidebarADMIN.php'; ?>

        <!-- Contenido Principal -->
        <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64"> <!-- Ajuste de margen izquierdo en pantallas grandes -->
            <!-- Bloque con fondo para el texto de bienvenida -->
            <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold">Bienvenido, <span id="usernameDisplay"></span></h2>
                <p class="mt-2">Has ingresado al panel de Administrador.</p>
            </div>
        </div>

    </body>
</html>
