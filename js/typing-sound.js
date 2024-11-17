// assets/scripts/typing-sound.js

document.addEventListener('DOMContentLoaded', () => {
    // Crear objeto Audio para el sonido de tipeo
    const typingSound = new Audio('../../songs/type.mp3');
    typingSound.volume = 0.2; // Ajusta el volumen (0.0 a 1.0)
    typingSound.preload = 'auto'; // Pre-cargar el sonido

    // Función para reproducir el sonido de tipeo con límite de frecuencia
    let lastTypingSoundTime = 0;
    const typingSoundDelay = 100; // milisegundos

    const playTypingSound = () => {
        const currentTime = Date.now();
        if (currentTime - lastTypingSoundTime > typingSoundDelay) {
            typingSound.currentTime = 0; // Reiniciar sonido para tipeos rápidos
            typingSound.play().catch(error => {
                console.error('Error al reproducir el sonido de tipeo:', error);
            });
            lastTypingSoundTime = currentTime;
        }
    };

    // Seleccionar campos de entrada
    const inputSelectors = 'input[type="text"], input[type="email"], input[type="password"], textarea';
    const inputElements = document.querySelectorAll(inputSelectors);

    // Asignar evento de keydown a cada campo de entrada
    inputElements.forEach(element => {
        element.addEventListener('keydown', (event) => {
            // Reproducir sonido para **cualquier tecla** presionada
            playTypingSound();
        });
    });

    // Observador para manejar campos de entrada añadidos dinámicamente
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches(inputSelectors)) {
                        node.addEventListener('keydown', (event) => {
                            playTypingSound();
                        });
                    }

                    // También busca dentro de los nodos añadidos
                    const nestedInputElements = node.querySelectorAll(inputSelectors);
                    nestedInputElements.forEach(nestedElement => {
                        nestedElement.addEventListener('keydown', (event) => {
                            playTypingSound();
                        });
                    });
                }
            });
        });
    });

    // Configurar el observador
    observer.observe(document.body, { childList: true, subtree: true });
});