<!-- resources/views/pedidos.php -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Pedidos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <script type="module">
        import { procesarPago } from '../../js/procesar_pago.js';
        import { fetchPedidos } from '../../js/pedido.js';

        document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            const idPedido = urlParams.get('external_reference');
            const metodoPago = urlParams.get('payment_type');

            if (status && idPedido) {
                // Mostrar pantalla de carga antes de procesar
                showLoadingScreen();

                try {
                    if (status === 'approved') {
                        const response = await procesarPago(idPedido, metodoPago);
                        if (response.success) {
                            fetchPedidos(); // Actualizar la tabla
                            showNotification(response.message, 'bg-green-500');
                        } else {
                            showNotification(response.message, 'bg-red-500');
                        }
                    } else {
                        showNotification(
                            status === 'failure' ? 'El pago ha fallado.' : 'El pago está pendiente.',
                            status === 'failure' ? 'bg-red-500' : 'bg-yellow-500'
                        );
                    }
                } catch (error) {
                    console.error('Error al procesar el pago:', error);
                    showNotification('Error al procesar el pago. Intenta nuevamente.', 'bg-red-500');
                } finally {
                    // Ocultar la pantalla de carga al finalizar
                    hideLoadingScreen();
                }
            }

            // Cargar pedidos iniciales
            fetchPedidos();
        });

        function showLoadingScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
            }
        }

        function hideLoadingScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }

        function showNotification(message, bgColor) {
            const notification = document.getElementById('notification');
            if (!notification) return;

            notification.textContent = message;
            notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md z-50`;
            notification.classList.remove('hidden');

            setTimeout(() => {
                notification.classList.add('hidden');
            }, 5000);
        }
    </script>


</head>
<body class="bg-gray-100 min-h-screen flex flex-col lg:flex-row">

    <!-- Notificación -->
    <div id="notification" class="hidden fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md z-50"></div>
    
    <!-- Sidebar -->
    <?php include 'sidebarCLIENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 w-full lg:w-full mx-auto">
        
        <!-- Encabezado -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
                <h1 class="text-2xl font-bold">Mis Pedidos</h1>
                <nav class="text-gray-500 text-sm">
                    <span>Pedidos</span> &gt; <span>Mis Pedidos</span>
                </nav>
            </div>
        </div>

        <!-- Tabla de Pedidos -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-3 px-6 text-left">ID Pedido</th>
                        <th class="py-3 px-6 text-left">Total</th>
                        <th class="py-3 px-6 text-left">Estado</th>
                        <th class="py-3 px-6 text-left">Acción</th>
                    </tr>
                </thead>
                <tbody id="pedidosTableBody" class="text-gray-700">
                    <!-- Las filas de pedidos serán insertadas aquí por JavaScript -->
                </tbody>
            </table>
        </div>

    </div>


<!-- Modal de detalles del pedido con overlay incluido -->
<div id="paymentModalOverlay" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative"> <!-- Ajuste de ancho aquí -->
        <!-- Botón de cierre -->
        <button id="closeModal" class="absolute top-2 right-2 text-gray-500 text-2xl font-bold hover:text-gray-700">
            &times;
        </button>
        
        <h2 class="text-xl font-bold mb-4">Detalles del Pedido</h2>
        
        <p><strong>ID Pedido:</strong> <span id="modalPedidoId"></span></p>
        <p><strong>Total:</strong> <span id="modalTotal"></span></p>
        
        <!-- Información de dirección -->
        <div id="modalDireccion" class="mb-4">
            <!-- Aquí se insertarán región, provincia y dirección del pedido -->
        </div>

       <!-- Contenedor de desplazamiento para la tabla -->
        <div class="overflow-x-auto">
            <!-- Tabla de detalles del pedido -->
            <table class="w-full border">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="px-4 py-2 border">ID Detalle</th>
                        <th class="px-4 py-2 border">ID Producto</th>
                        <th class="px-4 py-2 border">Producto</th>
                        <th class="px-4 py-2 border">Cantidad</th>
                        <th class="px-4 py-2 border">Precio Unitario</th>
                        <th class="px-4 py-2 border">Subtotal</th>
                    </tr>
                </thead>
                <tbody id="modalDetalles">
                    <!-- Detalles del pedido generados dinámicamente -->
                </tbody>
            </table>
        </div>
        
        <!-- Botón de acción para proceder al pago -->
        <div class="flex justify-end mt-4">
            <button id="proceedToPayment" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Proceder al Pago
            </button>
        </div>
    </div>
</div>
        
    <!-- Modal de Estado -->
    <div id="estadoModal" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg w-full max-w-xs md:max-w-md lg:max-w-lg p-4 md:p-6 relative overflow-y-auto">
            <button id="closeEstadoModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
            <h2 class="text-lg md:text-xl font-bold mb-4 text-center">Estado del Pedido</h2>
            
            <!-- Línea de Tiempo -->
            <div id="timeline" class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                <!-- Los estados de la línea de tiempo se generarán dinámicamente -->
            </div>
        </div>
    </div>

    <!-- Script para cargar pedidos -->
    <script type="module" src="../../js/pedido.js"></script>
</body>
</html>


<!-- Pantalla de carga -->
<div id="loading-screen" style="display: none;">
  <div class="loader"></div>
</div>

<style>
  #loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Asegura que esté por encima de otros elementos */
  }

  .loader {
    border: 16px solid #f3f3f3; /* Fondo claro */
    border-top: 16px solid #3498db; /* Color del borde superior */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite; /* Animación de giro */
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

<script>
    function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}
</script>
