--
-- Create procedures
--

DROP PROCEDURE IF EXISTS edit_user;
DROP PROCEDURE IF EXISTS user_update_password;
DROP PROCEDURE IF EXISTS user_logout;

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

CREATE PROCEDURE user_update_password(
    IN emp_id CHAR(36),
    IN new_password VARCHAR(128)
)
BEGIN
    UPDATE `user`
    SET `password` = new_password
    WHERE `employee_id` = emp_id;
END;;

CREATE PROCEDURE user_logout(
    IN emp_id CHAR(36)
)
BEGIN
    UPDATE `user`
    SET `logout_date` = CURRENT_DATE()
    WHERE `employee_id` = emp_id;
END;;

DELIMITER ;
