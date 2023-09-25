-- MariaDB dump 10.19  Distrib 10.6.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: ROBIN-LAPTOP.local    Database: pulse
-- ------------------------------------------------------
-- Server version	10.6.11-MariaDB

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
  `name` varchar(26) DEFAULT NULL,
  `employee_id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `report_frequency` int(11) DEFAULT NULL,
  PRIMARY KEY (`employee_id`,`project_id`),
  KEY `project_id` (`project_id`),
  KEY `report_frequency` (`report_frequency`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `assignment_ibfk_3` FOREIGN KEY (`report_frequency`) REFERENCES `report_frequency` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES ('Assignment G','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','1650f7ca-9b08-4907-af57-671342a219a2','2023-09-25',3),('Assignment C','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','38a3315d-fe13-4692-b001-872d6656689a','2023-09-25',3),('Assignment E','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','445390fb-509e-4e3b-985a-f20df536512c','2023-09-25',1),('Assignment A','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','4e658238-d50c-4812-84f2-be58e8be308a','2023-09-25',1),('Assignment H','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9','2023-09-25',4),('Assignment B','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','ba28b243-6889-4c54-a138-ff72333186a2','2023-09-25',2),('Assignment D','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','bf23b742-a36b-4251-84d1-4db5fb30248d','2023-09-25',4),('Assignment F','c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','d615786c-4610-4558-b2b6-113348aa5dac','2023-09-25',2);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
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
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES ('1650f7ca-9b08-4907-af57-671342a219a2','Project E','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL),('38a3315d-fe13-4692-b001-872d6656689a','Project A','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL),('445390fb-509e-4e3b-985a-f20df536512c','Project C','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL),('4e658238-d50c-4812-84f2-be58e8be308a','Quirky Quarters','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL),('6e885bbc-6d26-411e-b978-2962acae4bdd','Sharp Suits','Lorem Ipsum','2020-08-22','2023-09-11','2023-12-31',NULL,NULL),('8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9','Project F','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL),('ba28b243-6889-4c54-a138-ff72333186a2','Modern Maven','Lorem Ipsum','2021-08-22','2023-09-11','2023-12-31',NULL,NULL),('bf23b742-a36b-4251-84d1-4db5fb30248d','Project B','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL),('d615786c-4610-4558-b2b6-113348aa5dac','Project D','Lorem Ipsum','2019-08-22','2023-10-11','2023-12-31',NULL,NULL);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
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
  `employee_id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `creation_date` date NOT NULL,
  `text` longtext DEFAULT NULL,
  PRIMARY KEY (`employee_id`,`project_id`,`creation_date`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `report_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES ('c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9','2023-12-24','Hello, World!'),('c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','ba28b243-6889-4c54-a138-ff72333186a2','2000-09-25','Hello, World!'),('c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','bf23b742-a36b-4251-84d1-4db5fb30248d','2023-09-25','Hello, World!');
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_frequency`
--

DROP TABLE IF EXISTS `report_frequency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_frequency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` char(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_frequency`
--

LOCK TABLES `report_frequency` WRITE;
/*!40000 ALTER TABLE `report_frequency` DISABLE KEYS */;
INSERT INTO `report_frequency` VALUES (1,'daily'),(2,'weekly'),(3,'fortnightly'),(4,'monthly');
/*!40000 ALTER TABLE `report_frequency` ENABLE KEYS */;
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
  `logout_date` date DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('2e889992-6993-42c2-9366-cf9249a1e61b','admin','$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa','John Doe','johndoe@example.com','555-XXXX','https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg','2023-09-25',NULL,NULL),('c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef','johnnyDoe','$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa','John Doe','johndoe@example.com','555-XXXX','https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg','2023-09-25',NULL,NULL);
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
  1 AS `id`,
  1 AS `project_name`,
  1 AS `project_id`,
  1 AS `report_frequency`,
  1 AS `creation_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_assignments_extend`
--

DROP TABLE IF EXISTS `v_assignments_extend`;
/*!50001 DROP VIEW IF EXISTS `v_assignments_extend`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_assignments_extend` AS SELECT
 1 AS `employee_username`,
  1 AS `employee_id`,
  1 AS `project_name`,
  1 AS `project_id`,
  1 AS `creation_date`,
  1 AS `project_description`,
  1 AS `project_creation_date`,
  1 AS `project_modified_date`,
  1 AS `project_due_date`,
  1 AS `report_frequency` */;
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
  1 AS `creation_date`,
  1 AS `modified_date`,
  1 AS `due_date` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_reports`
--

DROP TABLE IF EXISTS `v_reports`;
/*!50001 DROP VIEW IF EXISTS `v_reports`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_reports` AS SELECT
 1 AS `assignment_name`,
  1 AS `creation_date`,
  1 AS `project_name`,
  1 AS `project_id`,
  1 AS `employee_name`,
  1 AS `employee_id`,
  1 AS `text` */;
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
  1 AS `logout_date` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_assignments`
--

/*!50001 DROP VIEW IF EXISTS `v_assignments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_assignments` AS select `u`.`username` AS `username`,`e`.`id` AS `id`,`p`.`name` AS `project_name`,`p`.`id` AS `project_id`,`rf`.`type` AS `report_frequency`,`a`.`creation_date` AS `creation_date` from ((((`assignment` `a` join `employee` `e` on(`a`.`employee_id` = `e`.`id`)) join `user` `u` on(`u`.`id` = `e`.`id`)) join `project` `p` on(`a`.`project_id` = `p`.`id`)) join `report_frequency` `rf` on(`a`.`report_frequency` = `rf`.`id`)) group by `u`.`id`,`a`.`project_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_assignments_extend`
--

/*!50001 DROP VIEW IF EXISTS `v_assignments_extend`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_assignments_extend` AS select `u`.`username` AS `employee_username`,`e`.`id` AS `employee_id`,`p`.`name` AS `project_name`,`p`.`id` AS `project_id`,`a`.`creation_date` AS `creation_date`,`p`.`description` AS `project_description`,`p`.`creation_date` AS `project_creation_date`,`p`.`modified_date` AS `project_modified_date`,`p`.`due_date` AS `project_due_date`,`rf`.`type` AS `report_frequency` from ((((`assignment` `a` join `employee` `e` on(`a`.`employee_id` = `e`.`id`)) join `user` `u` on(`u`.`id` = `e`.`id`)) join `project` `p` on(`a`.`project_id` = `p`.`id`)) join `report_frequency` `rf` on(`a`.`report_frequency` = `rf`.`id`)) group by `a`.`employee_id`,`a`.`project_id` */;
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
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_projects` AS select `p`.`id` AS `id`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`creation_date` AS `creation_date`,`p`.`modified_date` AS `modified_date`,`p`.`due_date` AS `due_date` from `project` `p` group by `p`.`id` order by `p`.`modified_date` desc,`p`.`creation_date` desc */;
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
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_reports` AS select `a`.`name` AS `assignment_name`,`r`.`creation_date` AS `creation_date`,`p`.`name` AS `project_name`,`p`.`id` AS `project_id`,`u`.`username` AS `employee_name`,`e`.`id` AS `employee_id`,`r`.`text` AS `text` from ((((`report` `r` join `assignment` `a` on(`r`.`project_id` = `a`.`project_id` and `r`.`employee_id` = `a`.`employee_id`)) join `employee` `e` on(`a`.`employee_id` = `e`.`id`)) join `user` `u` on(`u`.`id` = `e`.`id`)) join `project` `p` on(`r`.`project_id` = `p`.`id`)) group by `r`.`project_id`,`r`.`employee_id`,`r`.`creation_date` order by `r`.`creation_date` desc */;
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
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`dbadm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_users` AS select `u`.`id` AS `id`,`u`.`username` AS `username`,`u`.`display_name` AS `display_name`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`image_url` AS `image_url`,`u`.`creation_date` AS `creation_date`,`u`.`logout_date` AS `logout_date` from `user` `u` group by `u`.`id` */;
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

-- Dump completed on 2023-09-25 12:31:25
