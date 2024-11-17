<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💼Sistema_Ventas Landing-Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome para los Íconos Sociales -->
    <script src="https://kit.fontawesome.com/a076d05399.js"></script>
    <style>
        /* Efecto Parallax */
        .parallax {
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        /* Efecto Hover en Productos */
        .product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        /* Animación de Fade-in */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 1s forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="bg-white font-sans text-gray-800">
    <!-- Navegación -->
    <nav class="flex justify-between items-center p-4 lg:p-6 bg-gray-900 text-white">
        <a href="#" class="text-3xl font-bold text-white">💼Sistema_Ventas</a>
        <ul class="hidden lg:flex space-x-8 font-medium">
            <li><a href="index.php" class="hover:text-gray-400">Inicio</a></li>
            <li><a href="./PHP/nosotros.php" class="hover:text-gray-400">Sobre Nosotros</a></li>
            <li><a href="./PHP/servicios.php" class="hover:text-gray-400">Servicios</a></li>
            <li><a href="./PHP/contacto.php" class="hover:text-gray-400">Contacto</a></li>
        </ul>
        <button class="lg:hidden text-white font-bold" id="menuButton">☰</button>
    </nav>

    <!-- Menú móvil -->
    <div id="mobileMenu" class="hidden lg:hidden flex flex-col items-center space-y-4 bg-gray-800 text-white font-medium mt-4 p-4">
        <a href="index.php" class="hover:text-gray-400">Inicio</a>
        <a href="./PHP/nosotros.php" class="hover:text-gray-400">Sobre Nosotros</a>
        <a href="./PHP/servicios.php" class="hover:text-gray-400">Servicios</a>
        <a href="./PHP/contacto.php" class="hover:text-gray-400">Contacto</a>
    </div>

    <!-- Sección Principal -->
    <section class="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:px-24 py-12 lg:py-24 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <!-- Contenido de Texto Izquierdo -->
        <div class="text-center lg:text-left lg:max-w-md px-6">
            <h1 class="text-4xl lg:text-5xl font-bold leading-tight mb-4">Gestiona tus ventas</h1>
            <p class="text-lg mb-6">Un sistema eficiente para mejorar tus operaciones y aumentar la rentabilidad.</p>
            <div class="flex justify-center lg:justify-start space-x-4 mb-4">
                <a href="./PHP/login.php" class="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500">Comenzar</a>
            </div>
            <p class="font-medium">#Sistema_Ventas</p>
        </div>

        <!-- Contenido de Imagen Derecha -->
        <div class="mt-8 lg:mt-0 lg:max-w-lg relative px-4 fade-in">
            <img src="./img/sistema_ventas_logo.jpg" alt="Sistema de Ventas" class="rounded-lg shadow-md w-full lg:w-auto">
            <div class="absolute top-12 right-10 font-semibold text-2xl rotate-12 text-gray-200">Optimiza tus ventas</div>
        </div>
    </section>

<!-- Sección de Productos -->
<section class="flex flex-wrap justify-center gap-6 bg-gray-100 p-8">
    <div class="w-48 h-64 bg-gray-200 text-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center product-card fade-in transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gray-300" style="animation-delay: 0.1s;">
        <div class="w-24 h-32 mb-2 overflow-hidden">
            <img src="../../img/1.png" alt="Producto 1" class="w-full h-full object-contain">
        </div>
        <p class="font-semibold text-center">Fácil</p>
    </div>
    <div class="w-48 h-64 bg-gray-200 text-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center product-card fade-in transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gray-300" style="animation-delay: 0.2s;">
        <div class="w-24 h-32 mb-2 overflow-hidden">
            <img src="../../img/2.png" alt="Producto 2" class="w-full h-full object-contain">
        </div>
        <p class="font-semibold text-center">Rápido</p>
    </div>
    <div class="w-48 h-64 bg-gray-200 text-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center product-card fade-in transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gray-300" style="animation-delay: 0.3s;">
        <div class="w-24 h-32 mb-2 overflow-hidden">
            <img src="../../img/3.png" alt="Producto 3" class="w-full h-full object-contain">
        </div>
        <p class="font-semibold text-center">Eficaz</p>
    </div>
    <div class="w-48 h-64 bg-gray-200 text-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center product-card fade-in transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gray-300" style="animation-delay: 0.4s;">
        <div class="w-24 h-32 mb-2 overflow-hidden">
            <img src="../../img/4.png" alt="Producto 4" class="w-full h-full object-contain">
        </div>
        <p class="font-semibold text-center">Sencillo</p>
    </div>
</section>

    <!-- Sección de Video Mediano con Botón de Reproducción -->
    <section class="bg-gray-800 py-20 flex justify-center items-center">
        <div class="relative w-full max-w-3xl h-auto">
            <video id="sistemaVentasVideo" class="w-full h-auto rounded-lg shadow-2xl hidden" src="../../img/SistemaVentasVideo.mp4" controls></video>
            <div id="videoOverlay" class="w-full h-full bg-black rounded-lg flex items-center justify-center">
                <img src="../../img/vistaprevia.png" alt="Vista previa de video" class="w-full h-auto rounded-lg">
                <button id="playButton" class="absolute bg-gray-700 p-6 rounded-full transition-all flex items-center justify-center hover:bg-gray-600" style="top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px;">
                    <div class="play-icon" style="border-left: 15px solid white; border-top: 10px solid transparent; border-bottom: 10px solid transparent; margin-left: 5px;"></div>
                </button>
            </div>
        </div>
    </section>

    <!-- Íconos de Redes Sociales -->
    <footer class="flex justify-center space-x-4 text-gray-900 p-4 bg-gray-200">
        <a href="https://www.facebook.com/sistema_ventas" class="hover:text-gray-600"><i class="fab fa-facebook-f"></i> Facebook</a>
        <a href="#" class="hover:text-gray-600"><i class="fab fa-twitter"></i> Twitter</a>
        <a href="#" class="hover:text-gray-600"><i class="fab fa-instagram"></i> Instagram</a>
    </footer>

<!-- Scripts -->
<script>
    // Seleccionar elementos del DOM
    const video = document.getElementById('cpuraVideo');
    const playButton = document.getElementById('playButton');
    const videoOverlay = document.getElementById('videoOverlay');

    // Función para reproducir el video y ocultar el botón
    playButton.addEventListener('click', () => {
        videoOverlay.classList.add('hidden'); // Oculta la vista previa y el botón
        video.classList.remove('hidden'); // Muestra el video
        video.play(); // Reproduce el video
    });
</script>


    <!-- Incluir el script al final del body para mejorar la carga -->
    <script type="module" src="./js/click-sound.js"></script>
    <script type="module" src="./js/typing-sound.js"></script>
    
    <!-- Script de autenticación -->
    <script type="module" src="./js/checkStorageTokenINDEX.js"></script>
    
    <!-- Script para mostrar/ocultar el menú móvil -->
    <script>
        const menuButton = document.getElementById('menuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Scroll suave para el efecto parallax
        window.addEventListener("scroll", function() {
            const elements = document.querySelectorAll(".fade-in");
            const scrollTop = window.scrollY;

            elements.forEach((element) => {
                const elementTop = element.getBoundingClientRect().top + scrollTop;
                const delay = element.dataset.delay || 0;
                if (scrollTop + window.innerHeight - 100 > elementTop) {
                    element.style.animationDelay = `${delay}s`;
                    element.classList.add("fade-in");
                }
            });
        });
    </script>
</body>
</html>
