--
-- Create functions for user related tables
--

DROP FUNCTION IF EXISTS does_user_exist;
DROP FUNCTION IF EXISTS is_user_employee;

DELIMITER ;;

CREATE FUNCTION does_user_exist(
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

DELIMITER ;
