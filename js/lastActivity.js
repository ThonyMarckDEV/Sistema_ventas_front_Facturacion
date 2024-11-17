import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

const token = localStorage.getItem('jwt'); 

async function updateLastActivity() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    if (token) {
        const decoded = jwt_decode(token);
        const userId = decoded.idUsuario; 

        fetch(`${API_BASE_URL}/api/update-activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Last activity updated:', data.message);
        })
        .catch(error => {
            console.error('Error updating last activity:', error);
        });
    }
}

// Llamar a la función inmediatamente cuando se carga el archivo
updateLastActivity();

// Configurar el intervalo para ejecutar cada 30 sec
setInterval(updateLastActivity, 30000);
