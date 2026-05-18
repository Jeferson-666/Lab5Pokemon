<?php

header("Content-Type: application/json");

// Conexión a la base de datos
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

// Obtener JSON enviado desde JS
$data = json_decode(file_get_contents("php://input"), true);

// Validar datos
if (!$data) {
    echo json_encode([
        "success" => false,
        "mensaje" => "No se recibieron datos"
    ]);
    exit;
}

// Preparar SP
$stmt = $conexion->prepare("CALL sp_insertar_pokemon(?, ?, ?, ?)");

$stmt->bind_param(
    "ssss",
    $data["nombre"],
    $data["tipo"],
    $data["habilidad"],
    $data["primer_movimiento"]
);

// Ejecutar
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "mensaje" => "Pokémon guardado correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "mensaje" => "Error al guardar Pokémon"
    ]);
}

$stmt->close();
$conexion->close();
