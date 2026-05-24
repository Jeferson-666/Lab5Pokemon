CREATE DATABASE IF NOT EXISTS `lab05pokemon` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `lab05pokemon`;

DROP TABLE IF EXISTS `pokemones`;
CREATE TABLE `pokemones` (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  tipo VARCHAR(255) NOT NULL,
  habilidad VARCHAR(255) NOT NULL,
  primer_movimiento VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insertar_pokemon` (
    IN p_nombre VARCHAR(255),
    IN p_tipo VARCHAR(255),
    IN p_habilidad VARCHAR(255),
    IN p_primer_movimiento VARCHAR(255)
)
BEGIN
    IF(SELECT COUNT(*) FROM pokemones WHERE nombre = p_nombre) > 0 THEN
        SELECT false AS success, "El Pokemon ya existe" AS mensaje, null AS nuevo_id;
    ELSE
        INSERT INTO pokemones (nombre, tipo, habilidad, primer_movimiento)
        VALUES (p_nombre, p_tipo, p_habilidad, p_primer_movimiento);
        SELECT true AS success, "Pokemon guardado correctamente" AS mensaje, LAST_INSERT_ID() AS nuevo_id;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_pokemon_por_nombre` (
    IN p_nombre VARCHAR(255)
)
BEGIN
    SELECT * FROM pokemones WHERE nombre = p_nombre;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_pokemon_por_nombre` (
    IN p_nombre VARCHAR(255)
)
BEGIN
    DELETE FROM pokemones WHERE nombre = p_nombre;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_pokemon_por_nombre` (
    IN p_nombre VARCHAR(255),
    IN p_tipo VARCHAR(255),
    IN p_habilidad VARCHAR(255),
    IN p_primer_movimiento VARCHAR(255)
)
BEGIN
    UPDATE pokemones
    SET tipo = p_tipo, habilidad = p_habilidad, primer_movimiento = p_primer_movimiento
    WHERE nombre = p_nombre;
END$$
DELIMITER ;