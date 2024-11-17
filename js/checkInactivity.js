// logout.js
import { logout } from './logout.js';

// Variables de tiempo y de modal
let tiempoInactividad = 0;
let sesionCerrada = false;
let modalMostrado = false;
let modalTimeout;

// Función para mostrar el modal con fondo difuminado y reproducir sonido
function mostrarModal() {
    // Mostrar el modal
    document.getElementById("inactivityModalOverlay").style.display = "block";
    modalMostrado = true;

    // Reproducir el sonido
    var sonido = new Audio('../../songs/notificacion_inactivity.mp3'); // Asegúrate de que la ruta sea correcta
    sonido.play().catch(function(error) {
        console.error("Error al reproducir el sonido:", error);
    });

    // Configura el tiempo para cerrar sesión si no hay respuesta
    modalTimeout = setTimeout(() => {
        cerrarSesionPorInactividad();
    }, 10000); // 10 segundos para responder
}

// Función para ocultar el modal y restablecer tiempo de inactividad
function ocultarModal() {
    document.getElementById("inactivityModalOverlay").style.display = "none";
    modalMostrado = false;
    clearTimeout(modalTimeout); // Cancela el cierre automático del modal
    tiempoInactividad = 0; // Reinicia el tiempo de inactividad
}

// Función para cerrar sesión por inactividad
function cerrarSesionPorInactividad() {
    if (!sesionCerrada) {
        sesionCerrada = true;
        logout(); // Llamar a la función logout importada
    }
}

// Incrementar el tiempo de inactividad y mostrar el modal si llega a 30 segundos
setInterval(() => {
    tiempoInactividad += 1;
    if (tiempoInactividad >= 120 && !modalMostrado) {
        mostrarModal(); // Mostrar el modal después de 30 segundos de inactividad
    }
}, 1000); // Incrementa cada segundo

// Detectar actividad del usuario y reiniciar el tiempo de inactividad solo si el modal no está mostrado
function reiniciarTiempoInactividad() {
    if (!modalMostrado) {
        tiempoInactividad = 0; // Reinicia el tiempo solo si el modal no está activo
    }
}

// Escuchar eventos de movimiento y reiniciar el tiempo de inactividad
document.addEventListener("mousemove", reiniciarTiempoInactividad);
document.addEventListener("keydown", reiniciarTiempoInactividad);
document.addEventListener("click", reiniciarTiempoInactividad);

// Escuchar los botones del modal
document.getElementById("stayLoggedIn").addEventListener("click", () => {
    ocultarModal(); // Oculta el modal solo cuando el usuario hace clic en "Sí"
});

document.getElementById("logOutNow").addEventListener("click", () => {
    cerrarSesionPorInactividad();
});