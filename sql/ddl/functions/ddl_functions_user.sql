--
-- Create functions for user related tables
--

DROP FUNCTION IF EXISTS does_user_exist;

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

DELIMITER ;
