import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';

const token = localStorage.getItem('jwt');

// Mostrar spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

// Ocultar spinner
function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

// Ajustar gráficos para móviles
function adjustMobileLayout() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.classList.add('overflow-x-auto', 'sm:overflow-visible');
    });
}

// Llamar a showLoading antes de cargar los datos
async function fetchData(endpoint) {
     // Verificar y renovar el token antes de cualquier solicitud
     await verificarYRenovarToken();
    try {
        const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud a ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        showNotification("Error al cargar los datos.", "bg-red-500");
    }
}


// Función para cargar datos de la cantidad de pedidos por mes
async function fetchPedidosPorMes() {
    const response = await fetchData('reportes/pedidos-por-mes');
    return response; // Array de objetos con { mes, cantidad }
}

// Función para cargar datos de ingresos por mes
async function fetchIngresosPorMes() {
    const response = await fetchData('reportes/ingresos-por-mes');
    return response; // Array de objetos con { mes, total_ingresos }
}

// Función para cargar cantidad de pagos completados
async function fetchCantidadPagosCompletados() {
    const response = await fetchData('reportes/pagos-completados');
    return response.cantidadPagosCompletados;
}

// Generar gráficos
async function generarReportes() {
    showLoading();
     // Verificar y renovar el token antes de cualquier solicitud
     await verificarYRenovarToken();
    try {
        const etiquetasMeses = obtenerEtiquetasMeses();
        const pedidosMesData = await fetchData('reportes/pedidos-por-mes');
        const ingresosMesData = await fetchData('reportes/ingresos-por-mes');

        // Alinear datos con los meses
        const datosPedidosPorMes = alinearDatosPorMes(pedidosMesData, 'cantidad');
        const datosIngresosPorMes = alinearDatosPorMes(ingresosMesData, 'total_ingresos');
        const ventasData = await fetchData('reportes/total-ingresos');
        const pedidosData = await fetchData('reportes/total-pedidos-completados');
        const clientesData = await fetchData('reportes/total-clientes');
        const productosData = await fetchData('reportes/total-productos');
        const bajoStockData = await fetchData('reportes/productos-bajo-stock');
        const cantidadPagosCompletados = await fetchCantidadPagosCompletados();

        
         // Gráfico Ingresos
    new Chart(document.getElementById('ventasChart'), {
        type: 'doughnut',
        data: {
            labels: ['Ingresos'],
            datasets: [{
                label: 'Ingresos S/.',
                data: [ventasData.totalVentas],
                backgroundColor: ['#4CAF50'],
            }],
        },
    });

        // Gráfico Cantidad de Pedidos por Mes
        new Chart(document.getElementById('pedidosPorMesChart'), {
            type: 'line',
            data: {
                labels: etiquetasMeses,
                datasets: [{
                    label: 'Cantidad de Pedidos',
                    data: datosPedidosPorMes,
                    borderColor: '#42A5F5',
                    fill: false,
                }],
            },
        });

        // Gráfico Ingresos por Mes
        new Chart(document.getElementById('ingresosPorMesChart'), {
            type: 'line',
            data: {
                labels: etiquetasMeses,
                datasets: [{
                    label: 'Ingresos S/.',
                    data: datosIngresosPorMes,
                    borderColor: '#66BB6A',
                    fill: false,
                }],
            },
        });

        // Gráfico Total Pedidos
        new Chart(document.getElementById('pedidosChart'), {
            type: 'bar',
            data: {
                labels: ['Pedidos Completados'],
                datasets: [{
                    label: 'Total de Pedidos Completados',
                    data: [pedidosData.totalPedidos],
                    backgroundColor: ['#2196F3'],
                }],
            },
        });

        // Gráfico Pagos Completados
        new Chart(document.getElementById('pagosCompletadosChart'), {
            type: 'bar',
            data: {
                labels: ['Pagos Completados'],
                datasets: [{
                    label: 'Cantidad de Pagos Completados',
                    data: [cantidadPagosCompletados],
                    backgroundColor: ['#4A90E2'],
                }],
            },
        });

        // Gráfico Total Clientes
        new Chart(document.getElementById('clientesChart'), {
            type: 'bar',
            data: {
                labels: ['Clientes'],
                datasets: [{
                    label: 'Total de Clientes',
                    data: [clientesData.totalClientes],
                    backgroundColor: ['#FFC107'],
                }],
            },
        });

        // Gráfico Total Productos
        new Chart(document.getElementById('productosChart'), {
            type: 'pie',
            data: {
                labels: ['Productos en Inventario'],
                datasets: [{
                    label: 'Total de Productos',
                    data: [productosData.totalProductos],
                    backgroundColor: ['#FF5722'],
                }],
            },
        });

        // Gráfico Productos Bajo Stock
        new Chart(document.getElementById('bajoStockChart'), {
            type: 'bar',
            data: {
                labels: bajoStockData.productosBajoStock.map(p => p.nombreProducto),
                datasets: [{
                    label: 'Stock',
                    data: bajoStockData.productosBajoStock.map(p => p.stock),
                    backgroundColor: '#F44336',
                }],
            },
        });

    } finally {
        hideLoading();
    }
}

// Función para generar etiquetas de meses
function obtenerEtiquetasMeses() {
    return [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
}

// Función para alinear los datos con los meses (llenar con ceros si no hay datos)
function alinearDatosPorMes(datos, propiedad) {
    const meses = Array(12).fill(0); // Inicializa un array de 12 meses con valores 0
    datos.forEach(item => {
        const indiceMes = item.mes - 1; // Meses en datos están en formato numérico (1-12)
        meses[indiceMes] = item[propiedad];
    });
    return meses;
}


// Mostrar una notificación de error en caso de fallo
function showNotification(message, bgColor) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Inicia ajustes móviles y generación de reportes
window.addEventListener('DOMContentLoaded', () => {
    adjustMobileLayout();
    generarReportes();
});