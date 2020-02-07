-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.14 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for todo
CREATE DATABASE IF NOT EXISTS `todo` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;
USE `todo`;

-- Dumping structure for table todo.todo
CREATE TABLE IF NOT EXISTS `todo` (
  `todoId` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `todoListId` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  `dueDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isComplete` bit(1) NOT NULL,
  `sortOrder` smallint(6) NOT NULL,
  PRIMARY KEY (`todoId`),
  KEY `todoListId` (`todoListId`),
  KEY `userId` (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table todo.todoList
CREATE TABLE IF NOT EXISTS `todoList` (
  `todoListId` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`todoListId`),
  KEY `userId` (`userId`),
  KEY `name` (`name`),
  KEY `userId_name` (`userId`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table todo.user
CREATE TABLE IF NOT EXISTS `user` (
  `userId` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`),
  KEY `username_password` (`username`,`password`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
