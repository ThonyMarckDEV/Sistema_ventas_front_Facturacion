import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';

// Obtener el token JWT desde localStorage
const token = localStorage.getItem('jwt');

// Mostrar la pantalla de carga
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

// Ocultar la pantalla de carga
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// Función para procesar el pago
export async function procesarPago(idPedido, metodoPago = null) {
    showLoadingScreen(); // Mostrar pantalla de carga

    await verificarYRenovarToken(); // Verificar y renovar el token si es necesario

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/pagos/${idPedido}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                estado_pago: 'completado',
                metodo_pago: metodoPago
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        hideLoadingScreen(); // Ocultar pantalla de carga después del procesamiento

        if (data.success) {
            console.log('Pago procesado exitosamente:', data.message);
            return { success: true, message: data.message || 'Pago completado exitosamente.' };
        } else {
            console.error('Error al procesar el pago:', data.message);
            return { success: false, message: data.message || 'Error al procesar el pago.' };
        }
    } catch (error) {
        hideLoadingScreen(); // Ocultar pantalla de carga en caso de error
        console.error('Error en la solicitud:', error);
        return { success: false, message: 'Error al procesar el pago. Intenta nuevamente.' };
    }
}