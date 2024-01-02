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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`grupos`
--

/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
INSERT INTO `grupos` (`idgrupo`,`descripcion`,`created`) VALUES 
 (1,'Abrojos','2023-12-13 11:55:41'),
 (2,'Anilinas y quitamanchas','2023-12-13 12:33:50'),
 (3,'Agujas y alfileres','2023-12-13 12:33:51'),
 (4,'Apliques','2023-12-13 12:36:17'),
 (5,'Bies','2023-12-13 12:36:17'),
 (6,'Botones y broches','2023-12-13 12:36:17'),
 (7,'Cierres y deslizadores','2023-12-13 12:36:25'),
 (8,'Cintas','2023-12-15 10:35:03'),
 (9,'CORDONES Y CUERDAS','2023-12-15 10:36:35'),
 (10,'Elásticos','2023-12-15 10:37:06'),
 (11,'FLISELINAS','2023-12-15 13:12:38'),
 (12,'GALONES Y PASAMANERIAS','2023-12-15 13:13:23'),
 (13,'Hilos','2023-12-15 13:14:33'),
 (14,'PEGAMENTOS Y ADHESIVOS','2023-12-15 13:15:33'),
 (15,'PITUCONES Y REPARADORES','2023-12-15 13:17:57'),
 (16,'PUNTILLAS Y BRODERIES','2023-12-15 13:19:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`precios`
--

/*!40000 ALTER TABLE `precios` DISABLE KEYS */;
INSERT INTO `precios` (`idprecio`,`precio`,`vigente`,`created`) VALUES 
 (1,123,2,'2023-12-22 07:23:03'),
 (2,500,2,'2023-12-22 07:23:03'),
 (3,1000,2,'2023-12-22 07:23:03'),
 (4,505,2,'2023-12-22 07:23:39'),
 (5,124.23,2,'2023-12-22 07:23:39'),
 (6,1010,2,'2023-12-22 07:23:39'),
 (7,510.05,1,'2023-12-22 07:30:47'),
 (8,125.472,1,'2023-12-22 07:30:47'),
 (9,1020.1,1,'2023-12-22 07:30:47');
/*!40000 ALTER TABLE `precios` ENABLE KEYS */;


--
-- Table structure for table `merceria`.`productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `idproducto` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(15) NOT NULL DEFAULT '',
  `idgrupo` int(10) unsigned NOT NULL DEFAULT 0,
  `idsubgrupo` int(10) unsigned NOT NULL DEFAULT 0,
  `idproductometa` int(10) unsigned NOT NULL DEFAULT 0,
  `idprecio` int(10) unsigned DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`productos`
--

/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` (`idproducto`,`codigo`,`idgrupo`,`idsubgrupo`,`idproductometa`,`idprecio`,`created`) VALUES 
 (1,'5141.20',1,2,1,8,'2023-12-14 11:42:58'),
 (2,'5140.50.25',1,1,2,7,'2023-12-14 13:26:36'),
 (3,'5140.20F',1,1,3,9,'2023-12-14 13:47:44');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`productos_meta`
--

/*!40000 ALTER TABLE `productos_meta` DISABLE KEYS */;
INSERT INTO `productos_meta` (`id`,`descripcion`,`created`) VALUES 
 (1,'CINTA ABROJO AUTOADHESIVO 20MM X 10MTS','2023-12-14 12:20:57'),
 (2,'CINTA ABROJO 50MM X 25MTS','2023-12-14 13:26:11'),
 (3,'CINTA ABROJO FLUO 20MM X 10MTS','2023-12-14 13:47:16');
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
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `merceria`.`subgrupos`
--

/*!40000 ALTER TABLE `subgrupos` DISABLE KEYS */;
INSERT INTO `subgrupos` (`idsubgrupo`,`idgrupo`,`descripcion`,`created`) VALUES 
 (1,1,'PARA COSER','2023-12-14 07:10:14'),
 (2,1,'AUTOADHESIVO','2023-12-14 08:13:48'),
 (122,1,'Prueba','2023-12-15 14:01:57');
/*!40000 ALTER TABLE `subgrupos` ENABLE KEYS */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
