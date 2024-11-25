<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- Cargar Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js"></script> <!-- Cargar interact.js -->

    <style>
        /* Ajustar la altura de los contenedores de gráficos */
        .chart-container {
            height: 200px;
            max-height: 250px;
        }

        @media (min-width: 1024px) {
            .chart-container {
                height: 400px; /* Aumentar tamaño en PC */
                max-height: 400px;
            }
        }

        .loader {
            border-top-color: #3498db;
            animation: spin 1s infinite linear;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

    </style>
</head>
<body class="bg-gray-100 flex">

    <!-- Spinner de carga -->
    <div id="loadingSpinner" class="fixed inset-0 bg-white flex justify-center items-center z-50 hidden">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>

    <!-- Sidebar -->
    <?php include 'sidebarADMIN.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full lg:w-full mx-auto lg:overflow-hidden">
        
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-hidden">
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart1">
                <canvas id="ventasChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart2">
                <h3>Pagos Completados</h3>
                <canvas id="pagosCompletadosChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart3">
                <h3>Ingresos por Mes</h3>
                <canvas id="ingresosPorMesChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart4">
                <h3>Pedidos Completados</h3>
                <canvas id="pedidosChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart5">
                <h3>Pedidos por Mes</h3>
                <canvas id="pedidosPorMesChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart6">
                <h3>Cantidad Total de Clientes</h3>
                <canvas id="clientesChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart7">
                <canvas id="productosChart"></canvas>
            </div>
            <div class="bg-white p-3 rounded-lg shadow chart-container" id="chart8">
                <h3>Productos stock menor a 10</h3>
                <canvas id="bajoStockChart"></canvas>
            </div>
        </div>
    </div>

    <script>
    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Hacer los contenedores de los gráficos arrastrables con interact.js
    if (!isMobile) {
        interact('.chart-container')
            .draggable({
                onmove(event) {
                    let target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    // Mover el gráfico visualmente
                    target.style.transform = `translate(${x}px, ${y}px)`;

                    // Guardar las posiciones actuales
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                onend(event) {
                    // Obtener todos los contenedores de gráficos
                    const allCharts = document.querySelectorAll('.chart-container');

                    // Verificar si el gráfico se superpone con otro
                    let closestChart = getClosestChart(event.target, allCharts);

                    if (closestChart) {
                        // Intercambiar los gráficos en el DOM
                        swapElements(event.target, closestChart);

                        // Resetear las transformaciones para que queden bien posicionados
                        resetTransform(event.target);
                        resetTransform(closestChart);
                    }
                },
                inertia: true
            });
    }

    // Función para obtener el contenedor más cercano que se superpone
    function getClosestChart(draggedElement, allCharts) {
        let closest = null;
        let minDistance = Number.MAX_VALUE;

        allCharts.forEach(chart => {
            if (chart !== draggedElement) {
                let draggedRect = draggedElement.getBoundingClientRect();
                let chartRect = chart.getBoundingClientRect();

                // Calcular distancia entre los centros de los elementos
                let distance = Math.sqrt(
                    Math.pow(draggedRect.left - chartRect.left, 2) +
                    Math.pow(draggedRect.top - chartRect.top, 2)
                );

                // Detectar si están lo suficientemente cerca para intercambiar
                if (distance < minDistance && isOverlapping(draggedRect, chartRect)) {
                    minDistance = distance;
                    closest = chart;
                }
            }
        });

        return closest;
    }

    // Función para verificar si dos rectángulos se superponen
    function isOverlapping(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    // Función para intercambiar elementos en el DOM
    function swapElements(element1, element2) {
        let parent1 = element1.parentNode;
        let parent2 = element2.parentNode;

        // Insertar los elementos en las posiciones intercambiadas
        if (parent1 && parent2) {
            const placeholder1 = document.createElement('div');
            const placeholder2 = document.createElement('div');

            parent1.replaceChild(placeholder1, element1);
            parent2.replaceChild(placeholder2, element2);

            parent1.replaceChild(element2, placeholder1);
            parent2.replaceChild(element1, placeholder2);
        }
    }

    // Función para resetear transformaciones y posiciones
    function resetTransform(element) {
        element.style.transform = 'none';
        element.removeAttribute('data-x');
        element.removeAttribute('data-y');
    }
</script>


    <script type="module" src="../../js/reportes.js"></script>
</body>
</html>
