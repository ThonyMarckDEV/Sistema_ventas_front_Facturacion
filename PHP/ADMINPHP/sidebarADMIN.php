<!-- sidebar.php -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<!-- Incluir jwt-decode desde el CDN -->
<script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
<div id="sidebar" class="w-64 h-screen bg-white shadow-lg fixed top-0 left-0 p-4 border-r border-gray-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out z-50">
    <h1 class="text-xl font-bold mb-6">💼Sistema_Ventas</h1>
    <nav>
        <ul>

            <li class="flex items-center mb-6">
                <span class="mr-3 text-gray-500"><i class="fas fa-home"></i></span>
                <a href="Admin.php" class="text-gray-700 font-semibold hover:bg-gray-200 hover:text-gray-900 p-2 rounded w-full">Escritorio</a>
            </li>

            <li class="flex items-center mb-6 relative">
                <span class="mr-3 text-gray-500"><i class="fas fa-box"></i></span>
                <a href="pedidosAdmin.php" class="text-gray-700 font-semibold hover:bg-gray-200 hover:text-gray-900 p-2 rounded w-full flex items-center">
                    Pedidos
                    <!-- Contador de notificaciones al lado de Pedidos -->
                    <span id="pedidosCantidad" class="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full hidden">
                        0
                    </span>
                </a>
            </li>


            <li class="flex items-center mb-6">
                <span class="mr-3 text-gray-500"><i class="fas fa-chart-bar"></i></span>
                <a href="reportes.php" class="text-gray-700 font-semibold hover:bg-gray-200 hover:text-gray-900 p-2 rounded w-full">Reportes</a>
            </li>


            <li class="mb-6">
                <div class="flex items-center justify-between cursor-pointer text-gray-700 font-semibold" onclick="toggleDropdown('agregarDropdown', 'usuariosArrow')">
                    <span>Usuarios</span>
                    <span id="usuariosArrow" class="text-gray-500 transform transition-transform duration-300"><i class="fas fa-chevron-down"></i></span>
                </div>

                <ul id="agregarDropdown" class="pl-8 mt-2 hidden">
                    <li class="flex items-center mb-2">
                        <a href="agregarUsuario.php" class="text-gray-600 flex justify-between w-full hover:bg-gray-200 hover:text-gray-900 p-2 rounded cursor-pointer">
                            <span>Agregar Usuarios</span>
                        </a>
                    </li>
                </ul>
            
            </li>


            <li class="mb-6">
                <div class="flex items-center justify-between cursor-pointer text-gray-700 font-semibold" onclick="toggleDropdown('agregarCategoriaDropdown', 'categoriaArrow')">
                    <span>Categoria</span>
                    <span id="categoriaArrow" class="text-gray-500 transform transition-transform duration-300"><i class="fas fa-chevron-down"></i></span>
                </div>

                <ul id="agregarCategoriaDropdown" class="pl-8 mt-2 hidden">
                    <li class="flex items-center mb-2">
                        <a href="agregarCategoria.php" class="text-gray-600 flex justify-between w-full hover:bg-gray-200 hover:text-gray-900 p-2 rounded cursor-pointer">
                            <span>Agregar Categoria</span>
                        </a>
                    </li>
                </ul>
            
            </li>


            <li class="mb-6">
                <div class="flex items-center justify-between cursor-pointer text-gray-700 font-semibold" onclick="toggleDropdown('agregarProductosDropdown', 'productosArrow')">
                    <span>Productos</span>
                    <span id="productosArrow" class="text-gray-500 transform transition-transform duration-300"><i class="fas fa-chevron-down"></i></span>
                </div>

                <ul id="agregarProductosDropdown" class="pl-8 mt-2 hidden">
                    <li class="flex items-center mb-2">
                        <a href="agregarProducto.php" class="text-gray-600 flex justify-between w-full hover:bg-gray-200 hover:text-gray-900 p-2 rounded cursor-pointer">
                            <span>Agregar Productos</span>
                        </a>
                    </li>
                </ul>
            
            </li>


            <li>
                <a onclick="logout()" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded cursor-pointer">
                    <img src="../../img/logout.png" alt="Cerrar Sesión" class="w-5 h-5">
                    <span>Cerrar Sesión</span>
                </a>
            </li>
        </ul>
    </nav>
</div>


<!-- Botón de menú para dispositivos móviles -->
<button id="menuButton" class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full" onclick="toggleSidebar()">
    <i class="fas fa-bars"></i>
</button>

<script>
    function toggleDropdown(dropdownId, arrowId) {
        const dropdown = document.getElementById(dropdownId);
        const arrow = document.getElementById(arrowId);
        
        dropdown.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180'); // Rota la flecha 180 grados
    }

    function toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle("-translate-x-full"); // Ocultar o mostrar el sidebar en móviles
    }
</script>

  <!-- Loader -->
  <?php include '../loader.php'; ?>
  
<!-- Cargar el archivo JavaScript en todas las páginas -->
<!-- <script type="module" src="../../js/checkTokenInterval.js"></script> -->

<!-- Overlay de Carga Fijo -->
<div id="loadingOverlay" class="fixed inset-0 flex items-center justify-center bg-white hidden z-50" style="width: 100vw; height: 100vh;">
        <img src="../../img/carga.gif" alt="Cargando..." class="w-20 h-20"> <!-- Tamaño fijo del GIF -->
</div>

<script src="../../js/loadingOverlay.js"></script>
<!-- Incluir el script de autenticación y el script para el botón de menú -->
<script type="module" src="../../js/checkRoleandtokenInterval.js"></script>
<!-- Script para manejar el cierre de sesión -->
<script type="module" src="../../js/logout.js"></script>
<!-- Cargar el archivo JavaScript en todas las páginas -->
<script type="module" src="../../js/lastActivity.js"></script>
<!-- Incluir el script al final del body para mejorar la carga -->
<script type="module" src="../../js/click-sound.js"></script>
<!-- Incluir el script al final del body para mejorar la carga -->
<script type="module" src="../../js/typing-sound.js"></script>
<!-- Incluir el Modal de Inactividad -->
<?php include '../inactivity.php'; ?>
<!-- <script Checka inactyividad Usuario></script> -->
<script type="module" src="../../js/checkInactivity.js"></script>
<script type="module" src="../../js/contadorPedidosAdmin.js"></script>