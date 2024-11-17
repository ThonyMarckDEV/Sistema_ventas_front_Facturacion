<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- Cargar Chart.js -->

    <style>
        /* Ajustar la altura de los contenedores de gráficos */
        .chart-container {
            height: 250px; /* Ajusta la altura aquí */
            max-height: 250px;
        }
    </style>
</head>
<body class="bg-gray-100 flex">

    <!-- Sidebar -->
    <?php include 'sidebarADMIN.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full lg:w-full mx-auto">
        
        <!-- Encabezado -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
                <h1 class="text-2xl font-bold">Reportes</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Reportes</span> &gt; <span>Mis Reportes</span>
                </nav>
            </div>
        </div>

        <!-- Sección de Gráficos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-3 rounded-lg shadow chart-container">
                <canvas id="ventasChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container">
                <canvas id="pagosCompletadosChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container">
                <canvas id="pedidosChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container">
                <canvas id="clientesChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container">
                <canvas id="productosChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container">
                <canvas id="bajoStockChart"></canvas>
            </div>
            
        </div>

    </div>

    <script type="module" src="../../js/reportes.js"></script>
</body>
</html>
