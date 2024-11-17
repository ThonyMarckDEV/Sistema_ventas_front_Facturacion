// Script de Overlay de Carga
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('a'); // Selecciona todos los enlaces
    const loadingOverlay = document.getElementById("loadingOverlay");

    links.forEach(link => {
        // Excluir el enlace de logout (si tiene el atributo "onclick")
        if (link.hasAttribute("onclick")) {
            return; // Ignora este enlace
        }

        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetUrl = link.href;

            // Muestra el overlay
            loadingOverlay.classList.remove("hidden");

            // Espera 1.5 segundos antes de redirigir a la nueva URL
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1500);
        });
    });

    // Escuchar cambios de visibilidad y el evento pageshow para ocultar el overlay si volvemos a la página
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            loadingOverlay.classList.add("hidden"); // Oculta el overlay
        }
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) { // Detecta si es una visita de caché (por ejemplo, con retroceso)
            loadingOverlay.classList.add("hidden"); // Oculta el overlay
        }
    });
});
