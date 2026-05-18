<?php

class ProyectoModel
{
    protected $db;

    public function __construct()
    {
        // Cargar la clase de conexion y guardar la instancia de PDO.
        require 'libs/SPDO.php';
        $this->db = SPDO::singleton();
    } // fin __construct

    public function listar()
    {
        // Consultar todos los pokemones registrados.
        $consulta = $this->db->prepare('SELECT * FROM pokemones ORDER BY id ASC');
        $consulta->execute();
        $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
        $consulta->closeCursor();
        return $resultado;
    } // fin listar

    public function registrarPokemon($nombre, $tipo, $habilidad, $primerMovimiento)
    {
        // Preparar la insercion del nuevo pokemon.
        $consulta = $this->db->prepare(
            'INSERT INTO pokemones (nombre, tipo, habilidad, primer_movimiento) VALUES (?, ?, ?, ?)'
        );

        // Ejecutar la insercion con parametros seguros.
        $consulta->execute([$nombre, $tipo, $habilidad, $primerMovimiento]);
        $consulta->closeCursor();
    } // fin registrarPokemon

    public function eliminarPokemon($nombre)
    {
        // Ejecutar el procedimiento almacenado para eliminar por nombre.
        $consulta = $this->db->prepare('call sp_delete_pokemon_por_nombre(?)');
        $consulta->execute([$nombre]);
        $filasAfectadas = $consulta->rowCount() > 0;
        $consulta->closeCursor();
        return $filasAfectadas;
    } // fin eliminarPokemon

    public function buscarPokemon($nombre)
    {
        try {
            // Ejecutar el procedimiento almacenado para buscar por nombre.
            $consulta = $this->db->prepare('call sp_obtener_pokemon_por_nombre(?)');
            $consulta->execute([$nombre]);
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            $consulta->closeCursor();
            return $resultado;
        } catch (PDOException $e) {
            // Devolver falso si ocurre un error en la consulta.
            return false;
        }
    } // fin buscarPokemon

    public function actualizarPokemon($nombre, $tipo, $habilidad, $primerMovimiento)
    {
        try {
            // Ejecutar el procedimiento almacenado para actualizar por nombre.
            $consulta = $this->db->prepare('call sp_update_pokemon_por_nombre(?, ?, ?, ?)');
            $consulta->execute([$nombre, $tipo, $habilidad, $primerMovimiento]);
            $filasAfectadas = $consulta->rowCount() > 0;
            $consulta->closeCursor();
            return $filasAfectadas;
        } catch (PDOException $e) {
            // Devolver falso si ocurre un error en la actualizacion.
            return false;
        }
    } // fin actualizarPokemon
} // fin clase ProyectoModel
