<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Sistema_Ventas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .fade-in { animation: fadeIn 1s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .loader { 
            border-width: 4px; 
            border-style: solid; 
            border-color: gray transparent gray transparent; 
            border-radius: 50%; 
            width: 64px; 
            height: 64px; 
            animation: spin 1s linear infinite; 
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>

<body class="bg-gray-800 flex items-center justify-center min-h-screen">
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md fade-in">
        <h2 class="text-center text-2xl font-bold mb-6">Registro de Usuario - Sistema_Ventas</h2>
        
        <form id="userForm">
            <!-- Campos del formulario -->
            <div class="mb-4">
                <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres</label>
                <input 
                    type="text" 
                    id="nombres" 
                    name="nombres" 
                    class="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" 
                    title="Solo se permiten letras y espacios" 
                    oninput="this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');" 
                    required>
            </div>

            <div class="mb-4">
                <label for="apellidos" class="block text-sm font-medium text-gray-700">Apellidos</label>
                <input 
                    type="text" 
                    id="apellidos" 
                    name="apellidos" 
                    class="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" 
                    title="Solo se permiten letras y espacios" 
                    oninput="this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');" 
                    required>
            </div>

            <div class="mb-4">
                <label for="dni" class="block text-sm font-medium text-gray-700">DNI (8 dígitos)</label>
                <input 
                    type="text" 
                    id="dni" 
                    name="dni" 
                    class="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
                    pattern="\d{8}" 
                    title="El DNI debe contener exactamente 8 dígitos" 
                    inputmode="numeric" 
                    oninput="this.value = this.value.replace(/\D/g, '').slice(0, 8);" 
                    required>
            </div>

            <div class="mb-4">
                <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" id="correo" name="correo" class="w-full mt-1 p-2 border border-gray-300 rounded-lg" required>
            </div>

            <div class="mb-4">
                <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono (9 dígitos)</label>
                <input 
                    type="text" 
                    id="telefono" 
                    name="telefono" 
                    class="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
                    pattern="\d{9}" 
                    title="El número de teléfono debe contener exactamente 9 dígitos" 
                    inputmode="numeric" 
                    oninput="this.value = this.value.replace(/\D/g, '').slice(0, 9);" 
                    required>
            </div>

            <div class="mb-4">
                <label for="edad" class="block text-sm font-medium text-gray-700">Edad</label>
                <input 
                    type="number" 
                    id="edad" 
                    name="edad" 
                    class="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
                    min="0" 
                    max="120" 
                    oninput="this.value = this.value.replace(/[^0-9]/g, '');" 
                    required>
            </div>  

            <!-- Campo Contraseña -->
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Contraseña (Min. 8 Caracteres)</label>
                <input type="password" id="password" name="password" class="w-full mt-1 p-2 border border-gray-300 rounded-lg" required>
            </div>
            
            <!-- Campo Repetir Contraseña -->
            <div class="mb-4">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Repetir Contraseña</label>
                <input type="password" id="confirmPassword" name="confirmPassword" class="w-full mt-1 p-2 border border-gray-300 rounded-lg" required>
            </div>
            
            <!-- Botón de Registro -->
            <button type="submit" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Registrar</button>
        </form>
    </div>

    <!-- Loader -->
    <div id="loadingScreen" class="hidden fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="loader"></div>
    </div>

    <!-- Notificación -->
    <div id="notification" style="display: none;"></div>

    <!-- Scripts -->
    <script type="module" src="../js/registerUser.js"></script>
    <script type="module" src="../../js/click-sound.js"></script>
    <script type="module" src="../../js/typing-sound.js"></script>
</body>
</html>
