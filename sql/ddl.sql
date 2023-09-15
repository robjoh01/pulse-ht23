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

    PRIMARY KEY (`employee_id`)
);

CREATE TABLE `project`
(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(20),
    `description` VARCHAR(20),
    `creation_date` DATE,
    `modified_date` DATE,
    `deadline_date` DATE,

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
    u.phone_number
FROM user AS u
GROUP BY u.employee_id
;

CREATE VIEW v_projects AS
SELECT
    p.id,
    p.name,
    p.description,
    p.deadline_date
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

DROP FUNCTION IF EXISTS create_user;
DROP FUNCTION IF EXISTS login_user;
DROP FUNCTION IF EXISTS fetch_employee_id;
DROP FUNCTION IF EXISTS fetch_password;
DROP FUNCTION IF EXISTS delete_user;

DELIMITER ;;

CREATE FUNCTION generate_guid() RETURNS CHAR(36)
BEGIN
    DECLARE guid CHAR(36);
    SET guid = UUID();
    RETURN guid;
END;;

CREATE FUNCTION create_user (
    arg_username VARCHAR(16),
    arg_password VARCHAR(128)
)
RETURNS BOOLEAN
BEGIN
    DECLARE user_count INT;

    -- Check if the username already exists in the user table
    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE username = arg_username;

    -- If the username exists, return FALSE (user creation failed)
    IF user_count > 0 THEN
        RETURN FALSE;
    ELSE
        -- If the username doesn't exist, insert the new user with a generated GUID
        INSERT INTO `user` (`employee_id`, `username`, `password`)
            VALUES (generate_guid(), arg_username, arg_password);
        RETURN TRUE; -- User creation successful
    END IF;
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
    arg_username VARCHAR(16)
)
RETURNS VARCHAR(128)
BEGIN
    DECLARE hashed_password VARCHAR(128);

    SELECT `password` INTO hashed_password
    FROM `user`
    WHERE
        `username` = arg_username
    ;

    RETURN hashed_password;
END;;

CREATE FUNCTION login_user (
    arg_username VARCHAR(16),
    arg_password VARCHAR(128)
)
RETURNS BOOLEAN
BEGIN
    DECLARE stored_password VARCHAR(128);

    -- Check if the username exists in the user table
    SELECT `password` INTO stored_password
    FROM `user`
        WHERE username = arg_username
    ;

    -- If the username exists, check if the provided password matches the stored password
    IF stored_password = arg_password THEN
        RETURN TRUE; -- Login successful
    ELSE
        RETURN FALSE; -- Login failed
    END IF;
END;;

CREATE FUNCTION delete_user (
    arg_username VARCHAR(16),
    arg_password VARCHAR(128)
)
RETURNS BOOLEAN
BEGIN
    DECLARE stored_password VARCHAR(128);

    -- Check if the username exists in the user table
    SELECT `password` INTO stored_password
    FROM `user`
    WHERE
        username = arg_username
    ;

   -- If the username exists, check if the provided password (if provided) matches the stored password
    IF (arg_password IS NULL OR stored_password = arg_password) THEN
        -- Disable foreign key checks temporarily
        SET FOREIGN_KEY_CHECKS = 0;

        -- Delete the user's assignments from assignment table
        DELETE FROM `assignment`
        WHERE `employee_id` = (SELECT `employee_id` FROM `user` WHERE `username` = arg_username);

        -- Delete the user from user table
        DELETE FROM `user`
        WHERE `username` = arg_username;

        -- Re-enable foreign key checks
        SET FOREIGN_KEY_CHECKS = 1;

        RETURN TRUE; -- Deletion successful
    ELSE
        RETURN FALSE; -- Deletion failed (either username doesn't exist or incorrect password)
    END IF;
END;;

DELIMITER ;
