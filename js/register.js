import API_BASE_URL from './urlHelper.js';
import { listUsers } from './gestionarUsuarios.js';

   // Obtener el JWT del localStorage
   const token = localStorage.getItem("jwt");
   
   function submitForm() {
    const form = document.getElementById("userForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Limpiar mensajes de error anteriores
    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    // Mostrar loader
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
            // Reproducir sonido de éxito
            new Audio('../../songs/success.mp3').play().catch(console.error);
            showNotification("Usuario registrado exitosamente", "bg-green-500");
            form.reset();
            listUsers();
        } else {
            // Reproducir sonido de error
            new Audio('../../songs/error.mp3').play().catch(console.error);

            if (data.errors) {
                // Mostrar errores en los campos correspondientes
                Object.entries(data.errors).forEach(([field, messages]) => {
                    const input = document.querySelector(`[name="${field}"]`);
                    if (input) {
                        const errorDiv = document.createElement("div");
                        errorDiv.className = "text-red-500 text-sm mt-1 error-message";
                        errorDiv.textContent = messages[0];
                        input.parentElement.appendChild(errorDiv);
                    }
                });
            } else {
                showNotification(data.message || "Error al registrar usuario", "bg-red-500");
            }
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        new Audio('../../songs/error.mp3').play().catch(console.error);
        showNotification("Error en la solicitud", "bg-red-500");
    })
    .finally(() => {
        // Ocultar loader
        document.getElementById("loadingScreen").classList.add("hidden");
    });
}

// Función para mostrar la notificación
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// register.js (añadir el siguiente código al final)

document.addEventListener("DOMContentLoaded", () => {
    // Obtener los elementos de nombre, apellidos y username
    const nombresInput = document.getElementById("nombres");
    const apellidosInput = document.getElementById("apellidos");
    const usernameInput = document.getElementById("username");

    // Función para generar el username basado en nombres y apellidos
    function generateUsername() {
        const nombres = nombresInput.value.trim();
        const apellidos = apellidosInput.value.trim().split(" ");
        
        if (nombres && apellidos.length >= 2) {
            const primerNombre = nombres.substring(0, 2).toUpperCase(); // Primeras dos letras del primer nombre
            const apellidoPaterno = apellidos[0].toUpperCase();         // Apellido paterno completo
            const inicialApellidoMaterno = apellidos[1][0].toUpperCase(); // Primera letra del apellido materno
            usernameInput.value = `${primerNombre}${apellidoPaterno}${inicialApellidoMaterno}`;
        } else {
            usernameInput.value = ""; // Limpiar si los campos no son válidos
        }
    }

    // Asignar el evento input para actualizar el username mientras se escribe
    nombresInput.addEventListener("input", generateUsername);
    apellidosInput.addEventListener("input", generateUsername);
});


// Export function to be available globally
window.submitForm = submitForm;
