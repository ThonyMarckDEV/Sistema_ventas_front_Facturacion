import API_BASE_URL from './urlHelper.js';
import { actualizarCantidadPedidosAdmin } from './contadorPedidosAdmin.js';

import { verificarYRenovarToken } from './authToken.js';

// Obtener el token JWT desde localStorage
const token = localStorage.getItem('jwt');

// Decodificar el JWT para obtener el idUsuario (si es necesario)
let idUsuario = null;

// Decodificar el JWT
function decodeJWT(token) {
    try {
        const payloadBase64 = token.split('.')[1];
        const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
    } catch (error) {
        console.error('Error al decodificar el JWT:', error);
        return null;
    }
}

if (token) {
    const decoded = decodeJWT(token);
    if (decoded && decoded.idUsuario) {
        idUsuario = decoded.idUsuario;
    } else {
        showNotification('Token inválido o no contiene idUsuario.', 'bg-red-500');
    }
} else {
    showNotification('No se encontró el token de autenticación.', 'bg-red-500');
}

// Elementos del DOM
const pedidosContainer = document.getElementById('pedidosContainer');
const notification = document.getElementById('notification');

// Modales
const orderDetailsModal = document.getElementById('orderDetailsModal');
const closeOrderDetailsModalButton = document.getElementById('closeOrderDetailsModal');
const orderDetailsContent = document.getElementById('orderDetailsContent');

const paymentInfoModal = document.getElementById('paymentInfoModal');
const closePaymentInfoModalButton = document.getElementById('closePaymentInfoModal');
const paymentInfoContent = document.getElementById('paymentInfoContent');

// Modales para cambiar estado
const changeOrderStatusModal = document.getElementById('changeOrderStatusModal');
const closeChangeOrderStatusModal = document.getElementById('closeChangeOrderStatusModal');
const orderStatusSelect = document.getElementById('orderStatusSelect');
const confirmOrderStatusButton = document.getElementById('confirmOrderStatusButton');

// Nuevo modal para la imagen del comprobante
const imageModal = document.getElementById('imageModal');
const imageModalContent = document.getElementById('imageModalContent');
const closeImageModalButton = document.getElementById('closeImageModal');

// Variables para guardar el pedido o pago seleccionado
let selectedPedido = null;
let selectedPago = null;

// Función para mostrar notificaciones
function showNotification(message, bgColor) {
    if (!notification) return;
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Función para obtener todos los pedidos desde la API
async function fetchPedidos() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    //Mostrar Pantalla Carga
    document.getElementById("loadingScreen").classList.remove("hidden");

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/pedidos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.success) {
            renderPedidos(data.orders);
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
        } else {
            showNotification(data.message, 'bg-red-500');
             // Ocultar el loader después de la operación
             document.getElementById("loadingScreen").classList.add("hidden");
        }
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
         // Ocultar el loader después de la operación
         document.getElementById("loadingScreen").classList.add("hidden");
        showNotification('Error al obtener los pedidos. Intenta nuevamente.', 'bg-red-500');
    }
}

async function renderPedidos(pedidos) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    pedidosContainer.innerHTML = '';

    for (const pedido of pedidos) {
        const pedidoCard = document.createElement('div');
        pedidoCard.className = 'bg-white rounded-lg shadow-md p-6 mb-4';

        const nombreCliente = pedido.usuario && pedido.usuario.nombres && pedido.usuario.apellidos
            ? `${pedido.usuario.nombres} ${pedido.usuario.apellidos}`
            : 'N/A';

        // Llamada a la API para obtener dirección
        const direccion = await obtenerDireccionPedido(pedido.idPedido);
        const region = direccion ? direccion.region : 'N/A';
        const provincia = direccion ? direccion.provincia : 'N/A';
        const direccionTexto = direccion ? direccion.direccion : 'N/A';
        const latitud = direccion ? direccion.latitud : null;
        const longitud = direccion ? direccion.longitud : null;

        // Información del pedido
        const pedidoInfo = document.createElement('div');
        pedidoInfo.innerHTML = `
            <h2 class="text-xl font-bold mb-2">Pedido ID: ${pedido.idPedido}</h2>
            <p><strong>Cliente:</strong> ${nombreCliente}</p>
            <p><strong>Región:</strong> ${region}</p>
            <p><strong>Provincia:</strong> ${provincia}</p>
            <p><strong>Dirección:</strong> ${direccionTexto}</p>
            <p><strong>Total:</strong> S/${Number(pedido.total).toFixed(2)}</p>
            <p><strong>Estado:</strong> ${capitalizeFirstLetter(pedido.estado)}</p>
        `;

        // Botones de acción
        const actionButtons = document.createElement('div');
        actionButtons.className = 'mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4';

        // Botón "Ver Detalles"
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.textContent = 'Ver Detalles';
        viewDetailsButton.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
        viewDetailsButton.addEventListener('click', () => viewOrderDetails(pedido));

        // Botón "Ver Pago"
        const viewPaymentButton = document.createElement('button');
        viewPaymentButton.textContent = 'Ver Pago';
        viewPaymentButton.className = 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600';
        viewPaymentButton.addEventListener('click', () => viewPaymentInfo(pedido));

        // Botón "Cambiar Estado del Pedido"
        const changeOrderStatusButton = document.createElement('button');
        changeOrderStatusButton.textContent = 'Cambiar Estado del Pedido';
        changeOrderStatusButton.className = 'px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600';
        changeOrderStatusButton.addEventListener('click', () => changeOrderStatus(pedido));

        // Botón "Ver Mapa"
        const viewMapButton = document.createElement('button');
        viewMapButton.textContent = 'Ver Mapa';
        viewMapButton.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
        if (latitud && longitud) {
            viewMapButton.addEventListener('click', () => {
                window.open(`https://maps.google.com/?q=${latitud},${longitud}`, '_blank');
            });
        } else {
            viewMapButton.disabled = true;
            viewMapButton.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Botón "Eliminar Pedido"
        const deleteOrderButton = document.createElement('button');
        deleteOrderButton.textContent = 'Eliminar Pedido';
        deleteOrderButton.className = 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600';
        deleteOrderButton.addEventListener('click', () => deleteOrder(pedido));

        // Verificar el estado del pago y habilitar o deshabilitar los botones según sea necesario
        let estadoPago = 'pendiente'; // Valor por defecto
        if (pedido.pagos && pedido.pagos.length > 0) {
            estadoPago = pedido.pagos[0].estado_pago.toLowerCase();
        }

        // Habilitar/deshabilitar botones en función del estado de pago
        if (estadoPago === 'completado') {
            changeOrderStatusButton.disabled = false; // Habilitar "Cambiar Estado del Pedido"

        } else {
            changeOrderStatusButton.disabled = true; // Deshabilitar "Cambiar Estado del Pedido"
            changeOrderStatusButton.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Agregar todos los botones al contenedor de botones
        actionButtons.appendChild(viewDetailsButton);
        actionButtons.appendChild(viewPaymentButton); // Siempre habilitado
        actionButtons.appendChild(changeOrderStatusButton);
        actionButtons.appendChild(viewMapButton);
        actionButtons.appendChild(deleteOrderButton);

        // Agregar información del pedido y botones al contenedor del pedido
        pedidoCard.appendChild(pedidoInfo);
        pedidoCard.appendChild(actionButtons);
        pedidosContainer.appendChild(pedidoCard);
    }
}


async function deleteOrder(pedido) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    if (confirm(`¿Estás seguro de que deseas eliminar el pedido ${pedido.idPedido}? Esta acción no se puede deshacer.`)) {

        document.getElementById("loadingScreen").classList.remove("hidden");

        fetch(`${API_BASE_URL}/api/admin/pedidos/${pedido.idPedido}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Reproducir el sonido success
                var sonido = new Audio('../../songs/success.mp3'); 
                sonido.play().catch(function(error) {
                    console.error("Error al reproducir el sonido:", error);
                });
                 // Ocultar el loader después de la operación
                 document.getElementById("loadingScreen").classList.add("hidden");
                showNotification('Pedido eliminado correctamente', 'bg-green-500');
                fetchPedidos(); // Actualizar la lista de pedidos
                actualizarCantidadPedidosAdmin();
            } else {
                 // Reproducir el sonido error
                 var sonido = new Audio('../../songs/error.mp3'); 
                 sonido.play().catch(function(error) {
                     console.error("Error al reproducir el sonido:", error);
                 });
                  // Ocultar el loader después de la operación
                  document.getElementById("loadingScreen").classList.add("hidden");
                showNotification(data.message, 'bg-red-500');
            }
        })
        .catch(error => {
              // Reproducir el sonido error
              var sonido = new Audio('../../songs/error.mp3'); 
              sonido.play().catch(function(error) {
                  console.error("Error al reproducir el sonido:", error);
              });
               // Ocultar el loader después de la operación
               document.getElementById("loadingScreen").classList.add("hidden");
            console.error('Error al eliminar el pedido:', error);
            showNotification('Error al eliminar el pedido', 'bg-red-500');
        });
    }
}

function capitalizeFirstLetter(string) {
    if (!string) return ''; // Si la cadena es nula o indefinida, devuelve una cadena vacía.
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function viewOrderDetails(pedido) {
    orderDetailsContent.innerHTML = '';

    const nombreCliente = pedido.usuario && pedido.usuario.nombres && pedido.usuario.apellidos
        ? `${pedido.usuario.nombres} ${pedido.usuario.apellidos}`
        : 'N/A';

    // Obtener dirección del pedido
    const direccion = await obtenerDireccionPedido(pedido.idPedido);
    const region = direccion ? direccion.region : 'N/A';
    const provincia = direccion ? direccion.provincia : 'N/A';
    const direccionTexto = direccion ? direccion.direccion : 'N/A';

    // Mostrar la información del pedido
    const pedidoInfo = document.createElement('div');
    pedidoInfo.innerHTML = `
        <p><strong>ID Pedido:</strong> ${pedido.idPedido}</p>
        <p><strong>Cliente:</strong> ${nombreCliente}</p>
        <p><strong>Región:</strong> ${region}</p>
        <p><strong>Provincia:</strong> ${provincia}</p>
        <p><strong>Dirección:</strong> ${direccionTexto}</p>
        <p><strong>Total:</strong> S/${Number(pedido.total).toFixed(2)}</p>
        <p><strong>Estado:</strong> ${capitalizeFirstLetter(pedido.estado)}</p>
        <h3 class="text-lg font-bold mt-4 mb-2">Detalles:</h3>
    `;

    const detallesTable = document.createElement('table');
    detallesTable.className = 'min-w-full bg-white rounded-lg overflow-hidden';

    const thead = document.createElement('thead');
    thead.className = 'bg-gray-200';
    thead.innerHTML = `
        <tr>
            <th class="py-2 px-4 text-left">Producto</th>
            <th class="py-2 px-4 text-left">Cantidad</th>
            <th class="py-2 px-4 text-left">Precio Unitario</th>
            <th class="py-2 px-4 text-left">Subtotal</th>
        </tr>
    `;
    detallesTable.appendChild(thead);

    const tbody = document.createElement('tbody');

    pedido.detalles.forEach((detalle) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border">${detalle.producto.nombreProducto}</td>
            <td class="py-2 px-4 border">${detalle.cantidad}</td>
            <td class="py-2 px-4 border">S/${Number(detalle.precioUnitario).toFixed(2)}</td>
            <td class="py-2 px-4 border">S/${Number(detalle.subtotal).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    detallesTable.appendChild(tbody);
    orderDetailsContent.appendChild(pedidoInfo);
    orderDetailsContent.appendChild(detallesTable);

    orderDetailsModal.classList.remove('hidden');
}

// Cerrar el modal de detalles del pedido
if (closeOrderDetailsModalButton) {
    closeOrderDetailsModalButton.addEventListener('click', () => {
        orderDetailsModal.classList.add('hidden');
    });
}

// Función para ver información de pago
function viewPaymentInfo(pedido) {
    paymentInfoContent.innerHTML = '';

    if (pedido.pagos && pedido.pagos.length > 0) {
        const pago = pedido.pagos[0];
        const rutaComprobante = pago.ruta_comprobante;
        const comprobanteURL = `${API_BASE_URL}/storage/${rutaComprobante}`;

        const pagoInfo = document.createElement('div');
        pagoInfo.innerHTML = `
            <p><strong>ID Pago:</strong> ${pago.idPago}</p>
            <p><strong>Monto:</strong> S/${Number(pago.monto).toFixed(2)}</p>
            <p><strong>Método de Pago:</strong> ${capitalizeFirstLetter(pago.metodo_pago)}</p>
            <p><strong>Estado de Pago:</strong> ${capitalizeFirstLetter(pago.estado_pago)}</p>
        `;
 
        paymentInfoContent.appendChild(pagoInfo);

    } else {
        paymentInfoContent.innerHTML = '<p>No hay información de pago para este pedido.</p>';
    }

    paymentInfoModal.classList.remove('hidden');
}


// Cerrar el modal de información de pago
if (closePaymentInfoModalButton) {
    closePaymentInfoModalButton.addEventListener('click', () => {
        paymentInfoModal.classList.add('hidden');
    });
}


// Función para cambiar el estado del pedido
function changeOrderStatus(pedido) {
    selectedPedido = pedido;
    orderStatusSelect.innerHTML = '';
    const estados = ['en preparacion', 'enviado', 'completado'];

    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = capitalizeFirstLetter(estado);
        if (estado === pedido.estado.toLowerCase()) {
            option.selected = true;
        }
        orderStatusSelect.appendChild(option);
    });

    changeOrderStatusModal.classList.remove('hidden');
}

// Evento para cerrar el modal de cambiar estado del pedido
if (closeChangeOrderStatusModal) {
    closeChangeOrderStatusModal.addEventListener('click', () => {
        changeOrderStatusModal.classList.add('hidden');
    });
}

// Evento para confirmar el cambio de estado del pedido
if (confirmOrderStatusButton) {
    confirmOrderStatusButton.addEventListener('click', async () => {

        // Verificar y renovar el token antes de cualquier solicitud
        await verificarYRenovarToken();

        const newEstado = orderStatusSelect.value;
        if (newEstado && newEstado !== selectedPedido.estado.toLowerCase()) {

            //Mostrar laoder loading screen
            document.getElementById("loadingScreen").classList.remove("hidden");

            fetch(`${API_BASE_URL}/api/admin/pedidos/${selectedPedido.idPedido}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: newEstado })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Reproducir el sonido success
                    var sonido = new Audio('../../songs/success.mp3'); 
                    sonido.play().catch(function(error) {
                        console.error("Error al reproducir el sonido:", error);
                    });
                    // Ocultar el loader después de la operación
                    document.getElementById("loadingScreen").classList.add("hidden");
                    showNotification('Estado del pedido actualizado', 'bg-green-500');
                    changeOrderStatusModal.classList.add('hidden');
                    fetchPedidos();
                    actualizarCantidadPedidosAdmin();
                } else {
                    // Reproducir el sonido error
                    var sonido = new Audio('../../songs/error.mp3'); 
                    sonido.play().catch(function(error) {
                        console.error("Error al reproducir el sonido:", error);
                    });
                    // Ocultar el loader después de la operación
                    document.getElementById("loadingScreen").classList.add("hidden");
                    showNotification(data.message, 'bg-red-500');
                }
            })
            .catch(error => {
                 // Reproducir el sonido error
                 var sonido = new Audio('../../songs/error.mp3'); 
                 sonido.play().catch(function(error) {
                     console.error("Error al reproducir el sonido:", error);
                 });
                 // Ocultar el loader después de la operación
                 document.getElementById("loadingScreen").classList.add("hidden");
                console.error('Error al actualizar el estado del pedido:', error);
                showNotification('Error al actualizar el estado del pedido', 'bg-red-500');
            });
        } else {
            changeOrderStatusModal.classList.add('hidden');
        }
    });
}

async function obtenerDireccionPedido(idPedido) {

        // Verificar y renovar el token antes de cualquier solicitud
        await verificarYRenovarToken();
        
    try {
        const response = await fetch(`${API_BASE_URL}/api/obtenerDireccionPedido/${idPedido}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.success) {
            return data.direccion;
        } else {
            console.error(data.message);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la dirección del pedido:', error);
        return null;
    }
}

// Inicializar la carga de pedidos al cargar la página
document.addEventListener('DOMContentLoaded', fetchPedidos);
