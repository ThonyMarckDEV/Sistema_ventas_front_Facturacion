<!-- loader.php -->
<div id="inactivityModalOverlay" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center" style="z-index: 99999;">
<div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 class="text-xl font-semibold mb-4">Sesión Inactiva</h2>
        <p class="mb-6">¿Deseas mantener tu sesión activa?</p>
        <div class="flex justify-center space-x-4">
            <button id="stayLoggedIn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Sí</button>
            <button id="logOutNow" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">No</button>
        </div>
    </div>
</div>
