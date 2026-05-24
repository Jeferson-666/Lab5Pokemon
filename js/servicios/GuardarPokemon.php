<?php

// Conexión
$conexion = new mysqli(
    "localhost",
    "root",
    "root",
    "lab05pokemon"
);

// Verificar conexión
if ($conexion->connect_error) {
    die(json_encode([
        "success" => false,
        "mensaje" => "Error de conexión"
    ]));
}

// Obtener datos enviados por POST
if (!isset($_POST["pokemon"])) {
    echo json_encode([
        "success" => false,
        "mensaje" => "No se recibieron datos"
    ]);
    exit;
}

// Convertir JSON recibido a array
$data = json_decode($_POST["pokemon"], true);

// Validar JSON
if (!$data) {
    echo json_encode([
        "success" => false,
        "mensaje" => "JSON inválido"
    ]);
    exit;
}

// Preparar SP
$stmt = $conexion->prepare(
    "CALL sp_insertar_pokemon(?, ?, ?, ?)"
);

// Bind
$stmt->bind_param(
    "ssss",
    $data["nombre"],
    $data["tipo"],
    $data["habilidad"],
    $data["primer_movimiento"]
);

$stmt->execute();
$resultado = $stmt->get_result();

while ($fila = $resultado->fetch_assoc()) {
    if ($fila["success"] == 1) {
        echo '{"success": true, "mensaje": "' . $fila["mensaje"] . '"}';
    } else {
        echo '{"success": false, "mensaje": "' . $fila["mensaje"] . '"}';
    }

}

$stmt->close();
$conexion->close();
