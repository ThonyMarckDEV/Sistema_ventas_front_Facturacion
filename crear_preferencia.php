<?php
// Desactiva la notificación de errores deprecados en PHP
error_reporting(~E_DEPRECATED);

// Permite solicitudes desde cualquier origen (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Verifica que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Carga el autoload de Composer para gestionar dependencias
require_once __DIR__ . '/vendor/autoload.php';

// Importa las clases necesarias del SDK de Mercado Pago
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

// Agrega credenciales ACCESS_TOKEN
MercadoPagoConfig::setAccessToken("APP_USR-7428563255110106-111613-f53e67b7257e288706f3b6f5f4e8a291-2099203345");

// Obtiene los datos enviados desde el frontend
$input = json_decode(file_get_contents('php://input'), true);

// Verifica que se hayan recibido los datos necesarios
if (!isset($input['idPedido'], $input['detalles'], $input['total'], $input['correo'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$idPedido = $input['idPedido'];
$detalles = $input['detalles'];
$total = $input['total'];
$correo = $input['correo'];

// Crea una instancia del cliente de preferencias de Mercado Pago
$client = new PreferenceClient();

// URL base actual (dinámica)
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST']; // Obtiene el dominio actual
$currentUrlBase = $protocol . $host; // Combina protocolo y host

$backUrls = [
    "success" => "{$currentUrlBase}/PHP/CLIENTEPHP/pedidos.php?status=approved&external_reference={$idPedido}&payment_type=online",
    "failure" => "{$currentUrlBase}/PHP/CLIENTEPHP/pedidos.php?status=failure",
    "pending" => "{$currentUrlBase}/PHP/CLIENTEPHP/pedidos.php?status=pending"
];

// Crear los ítems a partir de los detalles del pedido
$items = [];
foreach ($detalles as $detalle) {
    $items[] = [
        "id" => $detalle['idProducto'],
        "title" => $detalle['nombreProducto'],
        "quantity" => (int)$detalle['cantidad'],
        "unit_price" => (float)$detalle['precioUnitario'],
        "currency_id" => "PEN" // Ajusta según tu moneda
    ];
}

// Configura la preferencia con los datos necesarios
$preferenceData = [
    "items" => $items,
    "payer" => [
        "email" => $correo
    ],
    "back_urls" => $backUrls,
    "auto_return" => "approved",
    "binary_mode" => true,
    "external_reference" => $idPedido
];

try {
    // Crea la preferencia
    $preference = $client->create($preferenceData);

    // Verifica si se creó la preferencia correctamente
    if (isset($preference->id)) {
        echo json_encode(['success' => true, 'init_point' => $preference->init_point]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear la preferencia en Mercado Pago']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al crear la preferencia: ' . $e->getMessage()]);
}
?>
