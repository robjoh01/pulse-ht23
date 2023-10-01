-- MySQL dump 10.19  Distrib 10.3.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: DESKTOP-ROBIN.local    Database: pulse
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment` (
  `employee_id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `report_frequency` enum('daily','weekly','fortnightly','monthly') DEFAULT NULL,
  `report_custom_submission_date` date DEFAULT NULL,
  PRIMARY KEY (`employee_id`,`project_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `text` longtext DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` char(36) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `description` varchar(96) DEFAULT NULL,
  `creation_date` date DEFAULT curdate(),
  `modified_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`category`) REFERENCES `project_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES ('4e658238-d50c-4812-84f2-be58e8be308a','Quirky Quarters','Lorem Ipsum','2023-10-01','0000-00-00','2022-10-28','2023-10-28',NULL),('6e885bbc-6d26-411e-b978-2962acae4bdd','Sharp Suits','Lorem Ipsum','2023-10-01','0000-00-00','2022-10-28','2023-10-28',NULL),('ba28b243-6889-4c54-a138-ff72333186a2','Modern Maven','Lorem Ipsum','2023-10-01','0000-00-00','2022-10-28','2023-10-28',NULL);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbadm`@`%`*/ /*!50003 TRIGGER project_before_insert
BEFORE INSERT ON `project`
FOR EACH ROW
BEGIN
    SET NEW.creation_date = CURRENT_DATE();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbadm`@`%`*/ /*!50003 TRIGGER project_before_update
BEFORE UPDATE ON project
FOR EACH ROW
BEGIN
    SET NEW.modified_date = CURRENT_DATE();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbadm`@`%`*/ /*!50003 TRIGGER project_before_delete
BEFORE DELETE ON project
FOR EACH ROW
BEGIN
    
    SET FOREIGN_KEY_CHECKS = 0;

    
    DELETE FROM assignment WHERE `project_id` = OLD.id;

    
    INSERT INTO project_archive (`id`, `name`, `description`, `creation_date`)
        SELECT
            `id`,
            `name`,
            `description`,
            `creation_date`
    FROM project
    WHERE
        `id` = OLD.id
    ;

    
    SET FOREIGN_KEY_CHECKS = 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `project_archive`
--

DROP TABLE IF EXISTS `project_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_archive` (
  `id` char(36) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `description` varchar(96) DEFAULT NULL,
  `creation_date` date DEFAULT curdate(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_archive`
--

LOCK TABLES `project_archive` WRITE;
/*!40000 ALTER TABLE `project_archive` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_archive` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbadm`@`%`*/ /*!50003 TRIGGER archive_project_before_delete
BEFORE DELETE ON project_archive
FOR EACH ROW
BEGIN
    
    DELETE FROM report WHERE `project_id` = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `project_category`
--

DROP TABLE IF EXISTS `project_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(28) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_category`
--

LOCK TABLES `project_category` WRITE;
/*!40000 ALTER TABLE `project_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_manager`
--

DROP TABLE IF EXISTS `project_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_manager` (
  `id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `project_manager_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_manager`
--

LOCK TABLES `project_manager` WRITE;
/*!40000 ALTER TABLE `project_manager` DISABLE KEYS */;
INSERT INTO `project_manager` VALUES ('2e889992-6993-42c2-9366-cf9249a1e61b');
/*!40000 ALTER TABLE `project_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `text` longtext DEFAULT NULL,
  `has_been_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `report_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` char(36) NOT NULL,
  `username` varchar(16) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `display_name` varchar(32) DEFAULT NULL,
  `email_address` varchar(32) DEFAULT NULL,
  `phone_number` varchar(32) DEFAULT NULL,
  `image_url` varchar(128) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `modified_date` date DEFAULT NULL,
  `logout_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('2e889992-6993-42c2-9366-cf9249a1e61b','admin','$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa','John Doe','johndoe@example.com','555-XXXX','https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg','2023-10-01',NULL,NULL),('c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','johnnyDoe','$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa','John Doe','johndoe@example.com','555-XXXX','https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg','2023-10-01',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbadm`@`%`*/ /*!50003 TRIGGER user_before_insert
BEFORE INSERT ON `user`
FOR EACH ROW
BEGIN
    SET NEW.creation_date = CURRENT_DATE();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbadm`@`%`*/ /*!50003 TRIGGER user_before_delete
BEFORE DELETE ON user
FOR EACH ROW
BEGIN
    
    DELETE FROM assignment WHERE `employee_id` = OLD.id;
    DELETE FROM report WHERE `employee_id` = OLD.id;
    DELETE FROM employee WHERE `id` = OLD.id;
    DELETE FROM project_manager WHERE `id` = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary table structure for view `v_assignments`
--

DROP TABLE IF EXISTS `v_assignments`;
/*!50001 DROP VIEW IF EXISTS `v_assignments`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_assignments` AS SELECT
 1 AS `employee_id`,
  1 AS `project_id`,
  1 AS `creation_date`,
  1 AS `report_frequency`,
  1 AS `report_custom_submission_date`,
  1 AS `project_name`,
  1 AS `project_start_date`,
  1 AS `project_end_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_employees`
--

DROP TABLE IF EXISTS `v_employees`;
/*!50001 DROP VIEW IF EXISTS `v_employees`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_employees` AS SELECT
 1 AS `employee_id`,
  1 AS `username`,
  1 AS `display_name`,
  1 AS `email_address`,
  1 AS `phone_number`,
  1 AS `image_url`,
  1 AS `creation_date`,
  1 AS `logout_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_project_archives`
--

DROP TABLE IF EXISTS `v_project_archives`;
/*!50001 DROP VIEW IF EXISTS `v_project_archives`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_project_archives` AS SELECT
 1 AS `project_id`,
  1 AS `name`,
  1 AS `description`,
  1 AS `creation_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_project_managers`
--

DROP TABLE IF EXISTS `v_project_managers`;
/*!50001 DROP VIEW IF EXISTS `v_project_managers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_project_managers` AS SELECT
 1 AS `project_manager_id`,
  1 AS `username`,
  1 AS `display_name`,
  1 AS `email_address`,
  1 AS `phone_number`,
  1 AS `image_url`,
  1 AS `creation_date`,
  1 AS `logout_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_projects`
--

DROP TABLE IF EXISTS `v_projects`;
/*!50001 DROP VIEW IF EXISTS `v_projects`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_projects` AS SELECT
 1 AS `project_id`,
  1 AS `name`,
  1 AS `description`,
  1 AS `creation_date`,
  1 AS `modified_date`,
  1 AS `start_date`,
  1 AS `end_date`,
  1 AS `severity` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_reports`
--

DROP TABLE IF EXISTS `v_reports`;
/*!50001 DROP VIEW IF EXISTS `v_reports`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_reports` AS SELECT
 1 AS `employee_id`,
  1 AS `project_id`,
  1 AS `creation_date`,
  1 AS `text`,
  1 AS `has_been_read` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_users`
--

DROP TABLE IF EXISTS `v_users`;
/*!50001 DROP VIEW IF EXISTS `v_users`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_users` AS SELECT
 1 AS `id`,
  1 AS `username`,
  1 AS `display_name`,
  1 AS `email_address`,
  1 AS `phone_number`,
  1 AS `image_url`,
  1 AS `creation_date`,
  1 AS `logout_date`,
  1 AS `is_employee` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_assignments`
--

/*!50001 DROP VIEW IF EXISTS `v_assignments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_assignments` AS select `a`.`employee_id` AS `employee_id`,`a`.`project_id` AS `project_id`,`a`.`creation_date` AS `creation_date`,`a`.`report_frequency` AS `report_frequency`,`a`.`report_custom_submission_date` AS `report_custom_submission_date`,`p`.`name` AS `project_name`,`p`.`start_date` AS `project_start_date`,`p`.`end_date` AS `project_end_date` from ((`assignment` `a` join `employee` `e` on(`a`.`employee_id` = `e`.`id`)) join `project` `p` on(`a`.`project_id` = `p`.`id`)) group by `a`.`employee_id`,`a`.`project_id` order by `a`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_employees`
--

/*!50001 DROP VIEW IF EXISTS `v_employees`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_employees` AS select `e`.`id` AS `employee_id`,`u`.`username` AS `username`,`u`.`display_name` AS `display_name`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`image_url` AS `image_url`,`u`.`creation_date` AS `creation_date`,`u`.`logout_date` AS `logout_date` from (`employee` `e` join `user` `u` on(`u`.`id` = `e`.`id`)) group by `e`.`id` order by `u`.`logout_date` desc,`u`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_project_archives`
--

/*!50001 DROP VIEW IF EXISTS `v_project_archives`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_project_archives` AS select `p`.`id` AS `project_id`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`creation_date` AS `creation_date` from `project_archive` `p` group by `p`.`id` order by `p`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_project_managers`
--

/*!50001 DROP VIEW IF EXISTS `v_project_managers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_project_managers` AS select `pm`.`id` AS `project_manager_id`,`u`.`username` AS `username`,`u`.`display_name` AS `display_name`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`image_url` AS `image_url`,`u`.`creation_date` AS `creation_date`,`u`.`logout_date` AS `logout_date` from (`project_manager` `pm` join `user` `u` on(`u`.`id` = `pm`.`id`)) group by `pm`.`id` order by `u`.`logout_date` desc,`u`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_projects`
--

/*!50001 DROP VIEW IF EXISTS `v_projects`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_projects` AS select `p`.`id` AS `project_id`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`creation_date` AS `creation_date`,`p`.`modified_date` AS `modified_date`,`p`.`start_date` AS `start_date`,`p`.`end_date` AS `end_date`,case when to_days(`p`.`end_date`) - to_days(curdate()) <= 7 then 'high' when to_days(`p`.`end_date`) - to_days(curdate()) <= 30 then 'mid' else 'low' end AS `severity` from `project` `p` group by `p`.`id` order by `p`.`modified_date` desc,`p`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_reports`
--

/*!50001 DROP VIEW IF EXISTS `v_reports`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_reports` AS select `r`.`employee_id` AS `employee_id`,`r`.`project_id` AS `project_id`,`r`.`creation_date` AS `creation_date`,`r`.`text` AS `text`,`r`.`has_been_read` AS `has_been_read` from (`report` `r` join `employee` `e` on(`r`.`employee_id` = `e`.`id`)) group by `r`.`employee_id`,`r`.`project_id` order by `r`.`has_been_read` desc,`r`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_users`
--

/*!50001 DROP VIEW IF EXISTS `v_users`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_users` AS select `u`.`id` AS `id`,`u`.`username` AS `username`,`u`.`display_name` AS `display_name`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`image_url` AS `image_url`,`u`.`creation_date` AS `creation_date`,`u`.`logout_date` AS `logout_date`,case when `e`.`id` is not null then 1 when `pm`.`id` is not null then 0 else -1 end AS `is_employee` from ((`user` `u` left join `employee` `e` on(`u`.`id` = `e`.`id`)) left join `project_manager` `pm` on(`u`.`id` = `pm`.`id`)) group by `u`.`id` order by `u`.`logout_date` desc,`u`.`creation_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-01 21:30:47
