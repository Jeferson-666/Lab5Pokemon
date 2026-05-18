<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'libs/configuration.php';
require_once 'model/ProyectoModel.php';

// Crear el modelo que realiza las operaciones con la tabla pokemones.
$model = new ProyectoModel();

// Obtener el metodo HTTP usado por Postman o por el cliente.
$metodo = $_SERVER['REQUEST_METHOD'];

// Obtener el nombre enviado por parametro en la URL, si existe.
$nombreParam = isset($_GET['nombre']) ? $_GET['nombre'] : null;

switch ($metodo) {
    case 'GET':
        // Accion GET: buscar un pokemon por nombre o listar todos.
        if ($nombreParam) {
            // Buscar un pokemon especifico usando el nombre recibido.
            $resultado = $model->buscarPokemon($nombreParam);

            // Responder con el pokemon encontrado.
            if ($resultado) {
                echo json_encode($resultado);
            } else {
                // Responder con error 404 si no existe el pokemon.
                http_response_code(404);
                echo json_encode(["mensaje" => "Pokemon no encontrado"]);
            }
        } else {
            // Responder con la lista completa de pokemones.
            echo json_encode($model->listar());
        }
        break;

    case 'POST':
        // Accion POST: registrar un nuevo pokemon.
        $datos = json_decode(file_get_contents("php://input"), true);

        // Validar que el JSON tenga todos los campos requeridos.
        if (
            !empty($datos['nombre']) &&
            !empty($datos['tipo']) &&
            !empty($datos['habilidad']) &&
            !empty($datos['primer_movimiento'])
        ) {
            // Insertar el pokemon con los datos recibidos.
            $model->registrarPokemon(
                $datos['nombre'],
                $datos['tipo'],
                $datos['habilidad'],
                $datos['primer_movimiento']
            );

            // Responder con estado 201 cuando el registro fue creado.
            http_response_code(201);
            echo json_encode(["mensaje" => "Pokemon creado con exito"]);
        } else {
            // Responder con error 400 cuando faltan datos obligatorios.
            http_response_code(400);
            echo json_encode(["mensaje" => "Datos incompletos"]);
        }
        break;

    case 'PUT':
        // Accion PUT: actualizar un pokemon existente por nombre.
        $datos = json_decode(file_get_contents("php://input"), true);

        // Validar que el JSON tenga los datos necesarios para actualizar.
        if (
            !empty($datos['nombre']) &&
            !empty($datos['tipo']) &&
            !empty($datos['habilidad']) &&
            !empty($datos['primer_movimiento'])
        ) {
            // Actualizar el pokemon usando el nombre como identificador.
            $actualizado = $model->actualizarPokemon(
                $datos['nombre'],
                $datos['tipo'],
                $datos['habilidad'],
                $datos['primer_movimiento']
            );

            // Responder segun el resultado de la actualizacion.
            if ($actualizado) {
                echo json_encode(["mensaje" => "Pokemon actualizado"]);
            } else {
                // Responder con error 404 si no se pudo actualizar.
                http_response_code(404);
                echo json_encode(["mensaje" => "No se pudo actualizar o no hubo cambios"]);
            }
        } else {
            // Responder con error 400 si faltan parametros.
            http_response_code(400);
            echo json_encode(["mensaje" => "Faltan parametros para actualizar"]);
        }
        break;

    case 'DELETE':
        // Accion DELETE: pokemon por nombre.
        if ($nombreParam) {
            // Eliminar el pokemon usando el nombre recibido por URL.
            $eliminado = $model->eliminarPokemon($nombreParam);

            // Responder segun el resultado del eliminar.
            if ($eliminado) {
                echo json_encode(["mensaje" => "Pokemon eliminado"]);
            } else {
                // Si no existe con el código 404.
                http_response_code(404);
                echo json_encode(["mensaje" => "El pokemon no existe"]);
            }
        } else {
            // Responder con error 400 si no se envio el nombre.
            http_response_code(400);
            echo json_encode(["mensaje" => "Se requiere el nombre del pokemon"]);
        }
        break;

    default:
        // Si la accions esta  permitida: responder si el metodo HTTP no esta soportado.
        http_response_code(405);
        echo json_encode(["mensaje" => "Metodo no permitido"]);
        break;
}
