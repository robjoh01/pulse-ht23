DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `project`;
DROP TABLE IF EXISTS `assignment`;

--
-- Create table: user
--
CREATE TABLE `user`
(
    `employee_id` CHAR(3),
    `name` VARCHAR(20),
    `email_address` VARCHAR(20),
    `mobile_number` VARCHAR(20),

    PRIMARY KEY (`employee_id`)
);

--
-- Create table: project
--
CREATE TABLE `project`
(
    `id` CHAR(3),
    `name` VARCHAR(20),
    `description` VARCHAR(20),
    `creation_date` DATE,
    `modified_date` DATE,
    `deadline_date` DATE,

    PRIMARY KEY (`id`)
);

--
-- Create table: assignment
--
CREATE TABLE `assignment`
(
    `employee_id` CHAR(3),
    `project_id` CHAR(3),
    `access_lvl` VARCHAR(20),

    FOREIGN KEY (`employee_id`) REFERENCES user(employee_id),
    FOREIGN KEY (`project_id`) REFERENCES project(id),
    PRIMARY KEY (`employee_id`, `project_id`),
);

SHOW TABLES;