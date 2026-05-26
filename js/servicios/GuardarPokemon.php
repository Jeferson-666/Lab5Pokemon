<?php

header("Content-Type: application/json; charset=UTF-8");
mysqli_report(MYSQLI_REPORT_OFF);

function responder($success, $mensaje)
{
    echo json_encode([
        "success" => $success,
        "mensaje" => $mensaje
    ]);
    exit;
}

// Conexion
$conexion = new mysqli(
    "localhost",
    "root",
    "",
    "lab05pokemon"
);

// Verificar conexion
if ($conexion->connect_error) {
    responder(false, "Error de conexion a la base de datos");
}

$conexion->set_charset("utf8");

// Obtener datos enviados por POST
if (!isset($_POST["pokemon"])) {
    responder(false, "No se recibieron datos");
}

// Convertir JSON recibido a array
$data = json_decode($_POST["pokemon"], true);

// Validar JSON y campos obligatorios
if (!$data) {
    responder(false, "JSON invalido");
}

if (
    empty($data["nombre"]) ||
    empty($data["tipo"]) ||
    empty($data["habilidad"]) ||
    empty($data["primer_movimiento"])
) {
    responder(false, "Datos incompletos");
}

// Preparar insercion
$stmt = $conexion->prepare(
    "INSERT INTO pokemones (nombre, tipo, habilidad, primer_movimiento) VALUES (?, ?, ?, ?)"
);

if (!$stmt) {
    responder(false, "Error al preparar la consulta");
}

// Bind
if (!$stmt->bind_param(
    "ssss",
    $data["nombre"],
    $data["tipo"],
    $data["habilidad"],
    $data["primer_movimiento"]
)) {
    responder(false, "Error al preparar los datos");
}

if (!$stmt->execute()) {
    $mensaje = $stmt->errno === 1062
        ? "El Pokemon ya existe"
        : "Error al guardar el Pokemon";

    $stmt->close();
    $conexion->close();
    responder(false, $mensaje);
}

$stmt->close();
$conexion->close();
responder(true, "Pokemon guardado correctamente");
