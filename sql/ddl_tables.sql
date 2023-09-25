--
-- Create tables
--

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `project_manager`;
DROP TABLE IF EXISTS `project`;
DROP TABLE IF EXISTS `assignment`;
DROP TABLE IF EXISTS `report`;
DROP TABLE IF EXISTS `report_frequency`;

CREATE TABLE `report_frequency`
(
    `id` INT AUTO_INCREMENT,
    `type` CHAR(16),

    PRIMARY KEY (`id`)
);

CREATE TABLE `user`
(
    `id` CHAR(36) NOT NULL,
    `username` VARCHAR(16),
    `password` VARCHAR(128),
    `display_name` VARCHAR(32),
    `email_address` VARCHAR(32),
    `phone_number` VARCHAR(32),
    `image_url` VARCHAR(128),
    `creation_date` DATE,
    `logout_date` DATE,
    `role` INT,

    PRIMARY KEY (`id`)
);

CREATE TABLE `employee`
(
    `id` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`id`) REFERENCES `user`(`id`)
);

CREATE TABLE `project_manager`
(
    `id` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`id`) REFERENCES `user`(`id`)
);

CREATE TABLE `project`
(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(32),
    `description` VARCHAR(96),
    `creation_date` DATE,
    `modified_date` DATE,
    `due_date` DATE,
    `start_date` DATE,
    `end_date` DATE,

    PRIMARY KEY (`id`)
);

CREATE TABLE `assignment`
(
    `name` VARCHAR(26),
    `employee_id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `creation_date` DATE,
    `report_frequency`INT,

    FOREIGN KEY (`employee_id`) REFERENCES employee(`id`),
    FOREIGN KEY (`project_id`) REFERENCES project(`id`),
    FOREIGN KEY (`report_frequency`) REFERENCES report_frequency(`id`),
    PRIMARY KEY (`employee_id`, `project_id`)
);

CREATE TABLE `report`
(
    `employee_id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `creation_date` DATE,
    `text` LONGTEXT,

    FOREIGN KEY (`employee_id`) REFERENCES employee(`id`),
    FOREIGN KEY (`project_id`) REFERENCES project(`id`),
    PRIMARY KEY (`employee_id`, `project_id`, `creation_date`)
);

SHOW TABLES;