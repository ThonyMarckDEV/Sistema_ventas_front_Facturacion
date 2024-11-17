<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto - Sistema_Ventas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Animaciones */
        .fade-in {
            animation: fadeIn 1s ease forwards;
        }

        .fade-out {
            animation: fadeOut 1s ease forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }

        /* Asegurar que el texto en el formulario sea legible */
        input[type="text"], input[type="email"], textarea {
            color: black;
            background-color: white;
        }
    </style>
</head>
<body class="bg-gray-800 text-white font-sans flex items-center justify-center min-h-screen">
    <!-- Contenedor Principal -->
    <section class="fade-in flex flex-col items-center lg:flex-row lg:justify-between lg:px-24 py-12 lg:py-24 space-y-8 lg:space-y-0">
        <!-- Contenido de Texto Izquierdo -->
        <div class="text-center lg:text-left lg:max-w-md px-6">
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-300 leading-tight mb-4">Contáctanos</h1>
            <p class="text-lg text-gray-200 mb-6">Nos encantaría saber de ti. Si tienes alguna pregunta o solicitud, no dudes en ponerte en contacto con nosotros.</p>
            <ul class="text-gray-400 space-y-2">
                <li>📞 Teléfono: +51 123 456 789</li>
                <li>📧 Email: contacto@sistemaventas.com</li>
                <li>🏢 Dirección: Calle Negocios 123, Lima</li>
            </ul>
        </div>
        
        <!-- Formulario de Contacto Derecho -->
        <div class="bg-white p-8 rounded-lg shadow-lg w-full lg:w-1/2 fade-in">
            <form id="contactForm" action="/send-message" method="POST">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" id="name" name="name" class="w-full p-2 border border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input type="email" id="email" name="email" class="w-full p-2 border border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label for="message" class="block text-sm font-medium text-gray-700">Mensaje</label>
                    <textarea id="message" name="message" rows="4" class="w-full p-2 border border-gray-300 rounded" style="color: black; background-color: white; pointer-events: auto;" required></textarea>
                </div>
                <button type="submit" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded">Enviar Mensaje</button>
            </form>
        </div>
    </section>
  
    <!-- Loader -->
    <?php include './loader.php'; ?>
    <!-- Incluir el script al final del body para mejorar la carga -->
    <script type="module" src="../js/click-sound.js"></script>
    <script type="module" src="../js/typing-sound.js"></script>

    <!-- Código JavaScript para la llamada AJAX -->
    <script type="module">

    import API_BASE_URL from '../js/urlHelper.js';

    document.getElementById('contactForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Captura los datos del formulario
        const formData = new FormData(this);

        // Mostrar loader de carga
        document.getElementById("loadingScreen").classList.remove("hidden");

        try {
            // Envía la solicitud a la API Laravel
            const response = await fetch(`${API_BASE_URL}/api/send-message`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'Accept': 'application/json'
                },
                body: formData
            });

            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");

            if (response.ok) {
                alert('Mensaje enviado correctamente.');
                document.getElementById('contactForm').reset(); // Limpia el formulario
            } else {
                // Maneja los errores de validación u otros errores
                const errorData = await response.json();
                console.error('Error al enviar el mensaje:', errorData);
                alert('Error al enviar el mensaje. Por favor, revisa los datos ingresados.');
                document.getElementById('contactForm').reset(); // Limpia el formulario
            }
        } catch (error) {
            console.error('Hubo un problema con la solicitud:', error);
            alert('Hubo un problema al enviar el mensaje. Inténtalo de nuevo.');
            document.getElementById('contactForm').reset(); // Limpia el formulario
            // Ocultar el loader después de la operación
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    });
    </script>

</body>
</html>
