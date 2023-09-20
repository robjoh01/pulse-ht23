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
-- Table structure for table `access_level`
--

DROP TABLE IF EXISTS `access_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_level`
--

LOCK TABLES `access_level` WRITE;
/*!40000 ALTER TABLE `access_level` DISABLE KEYS */;
INSERT INTO `access_level` VALUES (1,'ownership'),(2,'edit'),(3,'comment'),(4,'view');
/*!40000 ALTER TABLE `access_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment` (
  `employee_id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `access_lvl` int(11) DEFAULT NULL,
  PRIMARY KEY (`employee_id`,`project_id`),
  KEY `project_id` (`project_id`),
  KEY `access_lvl` (`access_lvl`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `user` (`employee_id`),
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `assignment_ibfk_3` FOREIGN KEY (`access_lvl`) REFERENCES `access_level` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES ('2e889992-6993-42c2-9366-cf9249a1e61b','4e658238-d50c-4812-84f2-be58e8be308a',1),('2e889992-6993-42c2-9366-cf9249a1e61b','ba28b243-6889-4c54-a138-ff72333186a2',2);
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
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
  `creation_date` date DEFAULT NULL,
  `modified_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES ('4e658238-d50c-4812-84f2-be58e8be308a','Quirky Quarters','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31'),('6e885bbc-6d26-411e-b978-2962acae4bdd','Sharp Suits','Lorem Ipsum','2020-08-22','2023-09-11','2023-12-31'),('ba28b243-6889-4c54-a138-ff72333186a2','Modern Maven','Lorem Ipsum','2021-08-22','2023-09-11','2023-12-31');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `employee_id` char(36) NOT NULL,
  `username` varchar(16) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `display_name` varchar(32) DEFAULT NULL,
  `email_address` varchar(32) DEFAULT NULL,
  `phone_number` varchar(32) DEFAULT NULL,
  `image_url` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('2e889992-6993-42c2-9366-cf9249a1e61b','admin','$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa','John Doe','johndoe@example.com','555-XXXX','https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `v_assignments`
--

DROP TABLE IF EXISTS `v_assignments`;
/*!50001 DROP VIEW IF EXISTS `v_assignments`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_assignments` AS SELECT
 1 AS `username`,
  1 AS `employee_id`,
  1 AS `project_name`,
  1 AS `project_id`,
  1 AS `access_type` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_projects`
--

DROP TABLE IF EXISTS `v_projects`;
/*!50001 DROP VIEW IF EXISTS `v_projects`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_projects` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `description`,
  1 AS `due_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_users`
--

DROP TABLE IF EXISTS `v_users`;
/*!50001 DROP VIEW IF EXISTS `v_users`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_users` AS SELECT
 1 AS `employee_id`,
  1 AS `username`,
  1 AS `display_name`,
  1 AS `email_address`,
  1 AS `phone_number`,
  1 AS `image_url` */;
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
/*!50001 VIEW `v_assignments` AS select `u`.`username` AS `username`,`u`.`employee_id` AS `employee_id`,`p`.`name` AS `project_name`,`p`.`id` AS `project_id`,`al`.`type` AS `access_type` from (((`assignment` `a` join `user` `u` on(`a`.`employee_id` = `u`.`employee_id`)) join `project` `p` on(`a`.`project_id` = `p`.`id`)) join `access_level` `al` on(`a`.`access_lvl` = `al`.`id`)) group by `a`.`employee_id`,`a`.`project_id`,`al`.`type` */;
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
/*!50001 VIEW `v_projects` AS select `p`.`id` AS `id`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`due_date` AS `due_date` from `project` `p` group by `p`.`id` order by `p`.`modified_date` desc,`p`.`creation_date` desc */;
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
/*!50001 VIEW `v_users` AS select `u`.`employee_id` AS `employee_id`,`u`.`username` AS `username`,`u`.`display_name` AS `display_name`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`image_url` AS `image_url` from `user` `u` group by `u`.`employee_id` */;
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

-- Dump completed on 2023-09-20 13:45:07
