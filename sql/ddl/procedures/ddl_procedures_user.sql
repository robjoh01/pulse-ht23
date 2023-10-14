--
-- Create procedures for user related tables
--

DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS update_user;
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS reactivate_user;
DROP PROCEDURE IF EXISTS deactivate_user;
DROP PROCEDURE IF EXISTS logout_user;

DELIMITER ;;

CREATE PROCEDURE create_user (
    IN arg_id CHAR(36),
    IN arg_is_employee BOOLEAN,
    IN arg_username VARCHAR(16),
    IN arg_password VARCHAR(128),
    IN arg_email_address VARCHAR(32),
    OUT success BOOLEAN
)
BEGIN
    DECLARE user_count INT;

    -- Check if the username, email_address, or employee_id already exists in the user table
    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE username = arg_username OR email_address = arg_email_address OR id = arg_id;

    -- If the username, email_address, or employee_id exists, return FALSE (user creation failed)
    IF user_count > 0 THEN
        SET success = FALSE;
    ELSE
        -- If the username, email_address, and employee_id don't exist, insert the new user
        INSERT INTO `user` (`id`, `username`, `password`, `email_address`)
            VALUES (arg_id, arg_username, arg_password, arg_email_address);
        
        -- Insert into the appropriate user type table based on arg_is_employee
        IF arg_is_employee THEN
            INSERT INTO `employee` (`id`)
            VALUES (arg_id);
        ELSE
            INSERT INTO `project_manager` (`id`)
            VALUES (arg_id);
        END IF;

        SET success = TRUE;
    END IF;
END;;

CREATE PROCEDURE update_user(
    IN arg_id CHAR(36),
    IN new_password VARCHAR(128),
    IN new_display_name VARCHAR(32),
    IN new_email_address VARCHAR(32),
    IN new_phone_number VARCHAR(32),
    IN new_image_url VARCHAR(128),
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
        `phone_number` = IFNULL(new_phone_number, `phone_number`),
        `image_url` = IFNULL(new_image_url, `image_url`),
        `modified_date` = NOW()
    WHERE `id` = arg_id;

    COMMIT;
    SET success = TRUE;
END;;

CREATE PROCEDURE delete_user (
    IN arg_id CHAR(36),
    OUT success BOOLEAN
)
BEGIN
    DECLARE user_count INT;

    -- Check if the employee_id exists in the user table
    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE `id` = arg_id;

    IF user_count > 0 THEN
        -- Disable foreign key checks temporarily
        SET FOREIGN_KEY_CHECKS = 0;

        -- Delete the user from user table
        DELETE FROM `user`
        WHERE `id` = arg_id;

        -- Re-enable foreign key checks
        SET FOREIGN_KEY_CHECKS = 1;

        SET success = TRUE; -- Deletion successful
    ELSE
        SET success = FALSE; -- Deletion failed (employee_id doesn't exist)
    END IF;
END;

CREATE PROCEDURE reactivate_user (
    IN arg_id CHAR(36),
    OUT success BOOLEAN
)
BEGIN
    UPDATE `user`
    SET `activated` = TRUE,
        `modified_date` = NOW()
    WHERE
        `id` = arg_id
    ;

    SET success = TRUE;
END;

CREATE PROCEDURE deactivate_user (
    IN arg_id CHAR(36),
    OUT success BOOLEAN
)
BEGIN
    UPDATE `user`
    SET `activated` = FALSE,
        `modified_date` = NOW()
    WHERE
        `id` = arg_id
    ;

    SET success = TRUE;
END;

CREATE PROCEDURE user_logout(
    IN arg_id CHAR(36)
)
BEGIN
    UPDATE `user`
    SET `logout_date` = NOW()
    WHERE `id` = arg_id
    ;
END;;

DELIMITER ;
