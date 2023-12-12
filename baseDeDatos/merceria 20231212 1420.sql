-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema merceria
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ merceria;
USE merceria;

--
-- Table structure for table `merceria`.`grupos`
--

DROP TABLE IF EXISTS `grupos`;
CREATE TABLE `grupos` (
  `idgrupo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idgrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`grupos`
--

/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupos` ENABLE KEYS */;


--
-- Table structure for table `merceria`.`precios`
--

DROP TABLE IF EXISTS `precios`;
CREATE TABLE `precios` (
  `idprecio` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `precio` float NOT NULL DEFAULT 0,
  `vigente` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT '1-Vigente, 2-obsoleto',
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idprecio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`precios`
--

/*!40000 ALTER TABLE `precios` DISABLE KEYS */;
/*!40000 ALTER TABLE `precios` ENABLE KEYS */;


--
-- Table structure for table `merceria`.`productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `idproducto` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idgrupo` int(10) unsigned NOT NULL DEFAULT 0,
  `idsubgrupo` int(10) unsigned NOT NULL DEFAULT 0,
  `idproductometa` int(10) unsigned NOT NULL DEFAULT 0,
  `idprecio` int(10) unsigned NOT NULL DEFAULT 0,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idproducto`),
  KEY `FK_productos_1` (`idgrupo`),
  KEY `FK_productos_2` (`idsubgrupo`),
  KEY `FK_productos_3` (`idproductometa`),
  KEY `FK_productos_4` (`idprecio`),
  CONSTRAINT `FK_productos_1` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_productos_2` FOREIGN KEY (`idsubgrupo`) REFERENCES `subgrupos` (`idsubgrupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_productos_3` FOREIGN KEY (`idproductometa`) REFERENCES `productos_meta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_productos_4` FOREIGN KEY (`idprecio`) REFERENCES `precios` (`idprecio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`productos`
--

/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;


--
-- Table structure for table `merceria`.`productos_meta`
--

DROP TABLE IF EXISTS `productos_meta`;
CREATE TABLE `productos_meta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(70) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`productos_meta`
--

/*!40000 ALTER TABLE `productos_meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos_meta` ENABLE KEYS */;


--
-- Table structure for table `merceria`.`subgrupos`
--

DROP TABLE IF EXISTS `subgrupos`;
CREATE TABLE `subgrupos` (
  `idsubgrupo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idgrupo` int(10) unsigned DEFAULT NULL,
  `descripcion` varchar(50) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idsubgrupo`),
  KEY `FK_subgrupos_grupos` (`idgrupo`),
  CONSTRAINT `FK_subgrupos_grupos` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`subgrupos`
--

/*!40000 ALTER TABLE `subgrupos` DISABLE KEYS */;
/*!40000 ALTER TABLE `subgrupos` ENABLE KEYS */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
