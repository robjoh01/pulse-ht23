--
-- Create functions for user related tables
--

DROP FUNCTION IF EXISTS does_user_exists;
DROP FUNCTION IF EXISTS is_user_employee;
DROP FUNCTION IF EXISTS is_user_activated;

DELIMITER ;;

CREATE FUNCTION does_user_exists(
    arg_username VARCHAR(16),
    arg_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE user_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `user` 
        WHERE `id` = arg_id OR `username` = arg_username
    ) INTO user_exists;

    RETURN user_exists;
END;;

CREATE FUNCTION is_user_employee(
    arg_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE employee_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `employee` 
        WHERE `id` = arg_id
    ) INTO employee_exists;

    RETURN employee_exists;
END;;

CREATE FUNCTION is_user_activated(
    arg_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE user_status BOOLEAN;
    
    -- Get the status of the user
    SELECT
        `activated` INTO user_status
    FROM `user`
    WHERE
        `id` = arg_id
    ;
    
    RETURN user_status;
END;;

DELIMITER ;
