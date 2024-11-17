import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

// Obtener el token JWT desde localStorage
const token = localStorage.getItem('jwt');

// Función para cargar datos de la API con autenticación
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        showNotification("Error al cargar los datos de reportes.", "bg-red-500");
    }
}

// Función para cargar cantidad de pagos completados
async function fetchCantidadPagosCompletados() {
    const response = await fetchData('reportes/pagos-completados');
    return response.cantidadPagosCompletados;
}

// Generar los gráficos
async function generarReportes() {
    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    // Cargar datos desde las APIs
    const ventasData = await fetchData('reportes/total-ingresos');
    const pedidosData = await fetchData('reportes/total-pedidos-completados');
    const clientesData = await fetchData('reportes/total-clientes');
    const productosData = await fetchData('reportes/total-productos');
    const bajoStockData = await fetchData('reportes/productos-bajo-stock');
    const cantidadPagosCompletados = await fetchCantidadPagosCompletados();

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

// Llamar a la función para generar reportes
generarReportes();
