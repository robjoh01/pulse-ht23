DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `project`;
DROP TABLE IF EXISTS `assignment`;
DROP TABLE IF EXISTS `access_level`;

-- TODO: Create triggers and procedures
-- $ mysqldump --result-file=backup.sql pulse

--
-- Create tables
--

CREATE TABLE `access_level`
(
    `id` INT AUTO_INCREMENT,
    `type` VARCHAR(12),

    PRIMARY KEY (`id`)
);

CREATE TABLE `user`
(
    `employee_id` CHAR(36) NOT NULL,
    `username` VARCHAR(16),
    `password` VARCHAR(128),
    `display_name` VARCHAR(32),
    `email_address` VARCHAR(32),
    `phone_number` VARCHAR(32),
    `image_url` VARCHAR(128),

    PRIMARY KEY (`employee_id`)
);

CREATE TABLE `project`
(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(32),
    `description` VARCHAR(96),
    `creation_date` DATE,
    `modified_date` DATE,
    `due_date` DATE,

    PRIMARY KEY (`id`)
);

CREATE TABLE `assignment`
(
    `employee_id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `access_lvl` INT,

    FOREIGN KEY (`employee_id`) REFERENCES user(`employee_id`),
    FOREIGN KEY (`project_id`) REFERENCES project(`id`),
    FOREIGN KEY (`access_lvl`) REFERENCES access_level(`id`),
    PRIMARY KEY (`employee_id`, `project_id`)
);

SHOW TABLES;

--
-- Create views
--

DROP VIEW IF EXISTS v_users;
DROP VIEW IF EXISTS v_projects;
DROP VIEW IF EXISTS v_assignments;

CREATE VIEW v_users AS
SELECT
    u.employee_id,
    u.username,
    u.display_name,
    u.email_address,
    u.phone_number,
    u.image_url
FROM user AS u
GROUP BY u.employee_id
;

CREATE VIEW v_projects AS
SELECT
    p.id,
    p.name,
    p.description,
    p.due_date
FROM project AS p
GROUP BY p.id
ORDER BY p.modified_date DESC, p.creation_date DESC
;

CREATE VIEW v_assignments AS
SELECT
    u.username,
    u.employee_id,
    p.name AS `project_name`,
    p.id AS `project_id`,
    al.type AS `access_type`
FROM assignment AS a
    JOIN `user` AS u ON a.employee_id = u.employee_id
    JOIN project AS p ON a.project_id = p.id
    JOIN access_level AS al ON a.access_lvl = al.id
GROUP BY a.employee_id, a.project_id, al.type
;

--
-- Create procedures
--

DROP PROCEDURE IF EXISTS edit_user;

DELIMITER ;;

CREATE PROCEDURE edit_user(
    IN emp_id CHAR(36),
    IN new_password VARCHAR(128),
    IN new_display_name VARCHAR(32),
    IN new_email_address VARCHAR(32),
    IN new_phone_number VARCHAR(32),
    OUT success BOOLEAN
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET success = FALSE;
    END;

    START TRANSACTION;
    
    -- Update user details
    UPDATE `user`
    SET
        `password` = IFNULL(new_password, `password`),
        `display_name` = IFNULL(new_display_name, `display_name`),
        `email_address` = IFNULL(new_email_address, `email_address`),
        `phone_number` = IFNULL(new_phone_number, `phone_number`)
    WHERE `employee_id` = emp_id;

    COMMIT;
    SET success = TRUE;
END;;

DELIMITER ;

--
-- Create triggers
--

--
-- Create functions
--

DROP FUNCTION IF EXISTS generate_guid;

DROP FUNCTION IF EXISTS fetch_employee_id;
DROP FUNCTION IF EXISTS fetch_password;

DROP FUNCTION IF EXISTS does_user_exist;

DROP FUNCTION IF EXISTS create_user;
DROP FUNCTION IF EXISTS update_user;
DROP FUNCTION IF EXISTS delete_user;

DROP FUNCTION IF EXISTS create_project;
DROP FUNCTION IF EXISTS update_project;
DROP FUNCTION IF EXISTS delete_project;

DELIMITER ;;

CREATE FUNCTION generate_guid() RETURNS CHAR(36)
BEGIN
    DECLARE guid CHAR(36);
    SET guid = UUID();
    RETURN guid;
END;;

CREATE FUNCTION fetch_employee_id(
    arg_username VARCHAR(16)
)
RETURNS CHAR(36)
BEGIN
    DECLARE emp_id CHAR(36);
    
    SELECT `employee_id` INTO emp_id
    FROM `user`
    WHERE
        `username` = arg_username
    ;
    
    RETURN emp_id;
END;;

CREATE FUNCTION fetch_password (
    arg_employee_id CHAR(36)
)
RETURNS VARCHAR(128)
BEGIN
    DECLARE hashed_password VARCHAR(128);

    SELECT `password` INTO hashed_password
    FROM `user`
    WHERE
        `employee_id` = arg_employee_id
    ;

    RETURN hashed_password;
END;;

CREATE FUNCTION does_user_exist(
    username_arg VARCHAR(16),
    employee_id_arg CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE user_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `user` 
        WHERE `employee_id` = employee_id_arg OR `username` = username_arg
    ) INTO user_exists;

    RETURN user_exists;
END;;

CREATE FUNCTION create_user (
    arg_username VARCHAR(16),
    arg_password VARCHAR(128),
    arg_email_address VARCHAR(32)
)
RETURNS CHAR(36)
BEGIN
    DECLARE user_count INT;
    DECLARE new_employee_id CHAR(36);

    -- Check if the username, email_address, or employee_id already exists in the user table
    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE username = arg_username OR email_address = arg_email_address;

    -- If the username or email_address exists, return NULL (user creation failed)
    IF user_count > 0 THEN
        RETURN NULL;
    ELSE
        -- If the username and email_address don't exist, generate a new GUID and insert the new user
        SET new_employee_id = generate_guid();
        INSERT INTO `user` (`employee_id`, `username`, `password`, `email_address`)
            VALUES (new_employee_id, arg_username, arg_password, arg_email_address);
        RETURN new_employee_id; -- Return the generated GUID (employee_id)
    END IF;
END;;

CREATE FUNCTION update_user(
    employee_id_arg CHAR(36),
    new_display_name VARCHAR(32),
    new_email_address VARCHAR(32),
    new_phone_number VARCHAR(32),
    new_image_url VARCHAR(128)
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    UPDATE `user`
    SET
        `display_name` = new_display_name,
        `email_address` = new_email_address,
        `phone_number` = new_phone_number,
        `image_url` = new_image_url
    WHERE
        `employee_id` = employee_id_arg;

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

CREATE FUNCTION delete_user (
    arg_employee_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    -- Check if the employee_id exists in the user table
    DECLARE user_count INT;

    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE `employee_id` = arg_employee_id;

    IF user_count > 0 THEN
        -- Disable foreign key checks temporarily
        SET FOREIGN_KEY_CHECKS = 0;

        -- Delete the user's assignments from assignment table
        DELETE FROM `assignment`
        WHERE `employee_id` = arg_employee_id;

        -- Delete the user from user table
        DELETE FROM `user`
        WHERE `employee_id` = arg_employee_id;

        -- Re-enable foreign key checks
        SET FOREIGN_KEY_CHECKS = 1;

        RETURN TRUE; -- Deletion successful
    ELSE
        RETURN FALSE; -- Deletion failed (employee_id doesn't exist)
    END IF;
END;;

CREATE FUNCTION create_project(
    arg_id CHAR(36),
    arg_name VARCHAR(32),
    arg_description VARCHAR(96),
    arg_due_date DATE
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    INSERT INTO `project` (`id`, `name`, `description`, `creation_date`, `modified_date`, `due_date`)
        VALUES (arg_id, arg_name, arg_description, CURRENT_DATE(), NULL, arg_due_date);

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

CREATE FUNCTION update_project(
    arg_id CHAR(36),
    arg_name VARCHAR(32),
    arg_description VARCHAR(96),
    arg_due_date DATE
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    UPDATE `project`
    SET
        `name` = arg_name,
        `description` = arg_description,
        `due_date` = arg_due_date,
        `modified_date` = CURRENT_DATE()
    WHERE
        `id` = arg_id;

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

CREATE FUNCTION delete_project(
    arg_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    DELETE FROM `project`
    WHERE `id` = arg_id;

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

DELIMITER ;
