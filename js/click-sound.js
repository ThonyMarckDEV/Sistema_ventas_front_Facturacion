// click-sound.js

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear un objeto Audio para el sonido de clic
    const clickSound = new Audio('../../songs/click.mp3'); // Asegúrate de que la ruta sea correcta

    // Opcional: Pre-cargar el sonido
    clickSound.preload = 'auto';

    // Añadir un listener para todos los eventos de clic en el documento
    document.addEventListener('click', (event) => {
        // Reproducir el sonido de clic
        clickSound.currentTime = 0; // Reiniciar el sonido en caso de clics rápidos
        clickSound.play().catch((error) => {
            console.error('Error al reproducir el sonido de clic:', error);
        });
    });
});
