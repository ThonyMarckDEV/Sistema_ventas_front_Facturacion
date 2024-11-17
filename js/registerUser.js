import API_BASE_URL from './urlHelper.js';

function generateUsername(nombres, apellidos) {
    const primerNombre = nombres.trim().substring(0, 2).toUpperCase();
    const apellidoPaterno = apellidos.trim().split(" ")[0].toUpperCase();
    const inicialApellidoMaterno = apellidos.trim().split(" ")[1]?.[0]?.toUpperCase() || "";
    return `${primerNombre}${apellidoPaterno}${inicialApellidoMaterno}`;
}

// Lista de dominios de correos temporales conocidos
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
        new Audio('../../songs/error.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
        showNotification('El correo electrónico debe ser una dirección de Gmail válida', 'bg-red-500');
        return false;
    }

    if (isTemporaryEmail(data.correo)) {
        new Audio('../../songs/error.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
        showNotification('No se permiten correos temporales', 'bg-red-500');
        return false;
    }

    if (data.password !== data.confirmPassword) {
        new Audio('../../songs/error.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
        showNotification('Las contraseñas no coinciden', 'bg-red-500');
        return false;
    }

    return true;
}

async function submitRegisterForm() {

    const form = document.getElementById("userForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Llamar a la función de validación
    if (!validateFormData(data)) {
        return;
    }

    // Generar username automáticamente y establecer el rol
    data.username = generateUsername(data.nombres, data.apellidos);
    data.rol = 'cliente';

    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/registerUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error("Errores de validación del servidor:", errorData.errors);
                throw new Error(errorData.message || 'Error en la solicitud');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            new Audio('../../songs/success.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
            showNotification("Usuario registrado exitosamente", "bg-green-500");
            form.reset();
            setTimeout(() => {
                window.location.href = 'login.php';
            }, 1700);
        } else {
            new Audio('../../songs/error.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
            showNotification(data.message || "Error al registrar usuario", "bg-red-500");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showNotification(error.message || "Error en la solicitud", "bg-red-500");
    })
    .finally(() => {
        loadingScreen.classList.add("hidden");
    });
}


function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    if (notification) {
        notification.textContent = message;
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 5000);
    } else {
        console.error("No se encontró el elemento de notificación.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userForm").addEventListener("submit", event => {
        event.preventDefault();
        submitRegisterForm();
    });
});

window.submitRegisterForm = submitRegisterForm;
