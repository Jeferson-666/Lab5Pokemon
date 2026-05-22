-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2026 a las 18:42:49
-- Versión del servidor: 5.7.17
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lab05pokemon`
--
CREATE DATABASE IF NOT EXISTS `lab05pokemon` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `lab05pokemon`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `sp_delete_pokemon_por_nombre`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_pokemon_por_nombre` (IN `p_nombre` VARCHAR(255))  BEGIN
    DELETE FROM pokemones WHERE nombre = p_nombre;
END$$

DROP PROCEDURE IF EXISTS `sp_insertar_pokemon`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insertar_pokemon` (IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(255), IN `p_habilidad` VARCHAR(255), IN `p_primer_movimiento` VARCHAR(255))  BEGIN

    INSERT INTO pokemon (
        nombre,
        tipo,
        habilidad,
        primer_movimiento
    )
    VALUES (
        p_nombre,
        p_tipo,
        p_habilidad,
        p_primer_movimiento
    );

END$$

DROP PROCEDURE IF EXISTS `sp_obtener_pokemon_por_nombre`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_pokemon_por_nombre` (IN `p_nombre` VARCHAR(255))  BEGIN
    SELECT * FROM pokemones WHERE nombre = p_nombre;
END$$

DROP PROCEDURE IF EXISTS `sp_update_pokemon_por_nombre`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_pokemon_por_nombre` (IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(255), IN `p_habilidad` VARCHAR(255), IN `p_primer_movimiento` VARCHAR(255))  BEGIN
    UPDATE pokemones
    SET tipo = p_tipo, habilidad = p_habilidad, primer_movimiento = p_primer_movimiento
    WHERE nombre = p_nombre;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pokemones`
--

DROP TABLE IF EXISTS `pokemones`;
CREATE TABLE `pokemones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `habilidad` varchar(255) NOT NULL,
  `primer_movimiento` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pokemones`
--

INSERT INTO `pokemones` (`id`, `nombre`, `tipo`, `habilidad`, `primer_movimiento`) VALUES
(1, 'Pikachu', 'Electrico', 'Pararrayos', 'Impactrueno'),
(2, 'charmeleon', 'fire', 'blaze', 'mega-punch');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pokemones`
--
ALTER TABLE `pokemones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pokemones`
--
ALTER TABLE `pokemones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
