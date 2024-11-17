import API_BASE_URL from './urlHelper.js';
import { listUsers } from './gestionarUsuarios.js';

import { verificarYRenovarToken } from './authToken.js';

// Obtener el JWT del localStorage
const token = localStorage.getItem("jwt");


const temporaryEmailDomains = [
    '10minutemail.com',
    'temp-mail.org',
    'mailinator.com',
    
];

function isTemporaryEmail(email) {
    const domain = email.split('@')[1].toLowerCase();
    return temporaryEmailDomains.includes(domain);
}

function isValidEmail(email) {

    const regex = /^[^\s@]+@gmail\.com$/i;
    return regex.test(email);
}

function validateFormData(data) {
   
    for (const [key, value] of Object.entries(data)) {
        if (!value.trim()) {
            showNotification(`El campo ${key} es obligatorio`, 'bg-red-500');
            return false;
        }
    }

    
    if (!isValidEmail(data.correo)) {
        showNotification('El correo electrónico debe ser una dirección de Gmail válida', 'bg-red-500');
        return false;
    }

    
    if (isTemporaryEmail(data.correo)) {
        showNotification('No se permiten correos temporales', 'bg-red-500');
        return false;
    }

    return true;
}

async function submitForm() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const form = document.getElementById("userForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    
    if (!validateFormData(data)) {
        return;
    }

  
    data.rol = 'cliente';

    //Mostrar loader de carga
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
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
            showNotification("Usuario registrado exitosamente", "bg-green-500");
            form.reset();
            listUsers(); 
        } else {
            
            var sonido = new Audio('../../songs/error.mp3');
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            showNotification(data.message || "Error al registrar usuario", "bg-red-500");
            form.reset();
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        showNotification("Error en la solicitud", "bg-red-500");
        
        var sonido = new Audio('../../songs/error.mp3');
        sonido.play().catch(function(error) {
            console.error("Error al reproducir el sonido:", error);
        });
        form.reset();
    })
    .finally(()=>{
        
         document.getElementById("loadingScreen").classList.add("hidden");
    });
}


function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}



document.addEventListener("DOMContentLoaded", () => {
    
    const nombresInput = document.getElementById("nombres");
    const apellidosInput = document.getElementById("apellidos");
    const usernameInput = document.getElementById("username");

    
    function generateUsername() {
        const nombres = nombresInput.value.trim();
        const apellidos = apellidosInput.value.trim().split(" ");
        
        if (nombres && apellidos.length >= 2) {
            const primerNombre = nombres.substring(0, 2).toUpperCase(); 
            const apellidoPaterno = apellidos[0].toUpperCase();         
            const inicialApellidoMaterno = apellidos[1][0].toUpperCase(); 
            usernameInput.value = `${primerNombre}${apellidoPaterno}${inicialApellidoMaterno}`;
        } else {
            usernameInput.value = ""; 
        }
    }

    
    nombresInput.addEventListener("input", generateUsername);
    apellidosInput.addEventListener("input", generateUsername);
});



window.submitForm = submitForm;
