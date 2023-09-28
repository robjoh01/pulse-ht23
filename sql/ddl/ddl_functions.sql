--
-- Create functions
--

DROP FUNCTION IF EXISTS get_user_id;
DROP FUNCTION IF EXISTS get_user_password;

DELIMITER ;;

CREATE FUNCTION get_user_id(
    arg_username VARCHAR(16)
)
RETURNS CHAR(36)
BEGIN
    DECLARE user_id CHAR(36);
    
    SELECT `id` INTO user_id
    FROM `user`
    WHERE
        `username` = arg_username
    ;
    
    RETURN user_id;
END;;

CREATE FUNCTION get_user_password(
    arg_id CHAR(36)
)
RETURNS VARCHAR(128)
BEGIN
    DECLARE user_password VARCHAR(128);
    
    SELECT `password` INTO user_password
    FROM `user`
    WHERE
        `id` = arg_id
    ;
    
    RETURN user_password;
END;;

DELIMITER ;

source ./ddl/functions/ddl_functions_user.sql
source ./ddl/functions/ddl_functions_project.sql
