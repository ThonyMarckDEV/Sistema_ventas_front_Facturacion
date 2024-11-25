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

    // Validar contraseñas iguales
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password_confirmation').value;

    if (password !== passwordConfirmation) {
        new Audio('../../songs/error.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
        showNotification('Las contraseñas no coinciden', 'bg-red-500');
        return false;
    }

    // Si todo está bien
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
                if (errorData.errors) {
                    // Extraer y mostrar los errores debajo de los campos correspondientes
                    Object.keys(errorData.errors).forEach(field => {
                        const errorMessages = errorData.errors[field];
                        const errorField = document.getElementById(`${field}Error`);
                        if (errorField) {
                            errorField.textContent = errorMessages.join(", ");
                        }
                    });
                }
                new Audio('../../songs/error.mp3').play().catch(error => console.error("Error al reproducir el sonido:", error));
                showNotification('Error en la solicitud', 'bg-red-500');
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


function showNotification(messages, bgColor) {
    const notification = document.getElementById("notification");
    if (notification) {
        if (Array.isArray(messages)) {
            notification.innerHTML = messages.map(msg => `<div>${msg}</div>`).join(""); // Asegura que múltiples mensajes se muestren como lista.
        } else if (typeof messages === "object") {
            // Manejar errores en formato { campo: [mensaje1, mensaje2] }
            notification.innerHTML = Object.entries(messages)
                .map(([field, msgs]) => `<div><strong>${field}:</strong> ${msgs.join(", ")}</div>`)
                .join("");
        } else {
            notification.textContent = messages;
        }
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
