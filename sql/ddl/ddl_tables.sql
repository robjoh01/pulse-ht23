--
-- Create tables
--

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `project_manager`;

DROP TABLE IF EXISTS `project`;
DROP TABLE IF EXISTS `project_archive`;
DROP TABLE IF EXISTS `assignment`;
DROP TABLE IF EXISTS `report`;

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
    `modified_date` DATE,
    `logout_date` DATE,

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
    `creation_date` DATE DEFAULT CURRENT_DATE(),
    `modified_date` DATE,
    `start_date` DATE,
    `end_date` DATE,

    PRIMARY KEY (`id`)
);

CREATE TABLE `project_archive`
(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(32),
    `description` VARCHAR(96),
    `creation_date` DATE DEFAULT CURRENT_DATE(),

    PRIMARY KEY (`id`)
);

CREATE TABLE `assignment`
(
    `employee_id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `creation_date` DATE,
    `report_frequency` ENUM('daily', 'weekly', 'fortnightly', 'monthly'),
    `report_custom_submission_date` DATE,

    PRIMARY KEY (`employee_id`, `project_id`),
    FOREIGN KEY (`employee_id`) REFERENCES employee(`id`),
    FOREIGN KEY (`project_id`) REFERENCES project(`id`)
);

CREATE TABLE `report`
(
    `employee_id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `creation_date` DATE,
    `text` LONGTEXT,
    `has_been_read` BOOLEAN,

    FOREIGN KEY (`employee_id`) REFERENCES employee(`id`),
    FOREIGN KEY (`project_id`) REFERENCES project(`id`),
    PRIMARY KEY (`employee_id`, `project_id`, `creation_date`)
);

SHOW TABLES;