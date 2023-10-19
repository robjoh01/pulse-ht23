--
-- Create functions
--

DROP FUNCTION IF EXISTS get_user_id;
DROP FUNCTION IF EXISTS get_user_password;
DROP FUNCTION IF EXISTS adjust_date;
DROP FUNCTION IF EXISTS midnight_date;

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

CREATE FUNCTION adjust_date(date_to_adjust DATE) RETURNS DATE
BEGIN
    DECLARE adjusted_date DATE;

    -- Check if the provided date is a Saturday or Sunday
    CASE DAYOFWEEK(date_to_adjust)
        WHEN 1 THEN
            -- Adjust to the nearest Friday
            SET adjusted_date = date_to_adjust - INTERVAL 2 DAY;
        WHEN 7 THEN
            -- Adjust to the nearest Friday
            SET adjusted_date = date_to_adjust - INTERVAL 1 DAY;
        ELSE
            SET adjusted_date = date_to_adjust;
    END CASE;

    RETURN adjusted_date;
END;;

CREATE FUNCTION midnight_date(date_to_adjust DATE) RETURNS DATETIME
BEGIN
    DECLARE adjusted_datetime DATETIME;
    
    -- Set the adjusted date to the provided date with midnight time
    SET adjusted_datetime = DATE_ADD(DATE_ADD(date_to_adjust, INTERVAL 1 DAY), INTERVAL -1 SECOND);
    
    RETURN adjusted_datetime;
END;;

DELIMITER ;

source ./ddl/functions/ddl_functions_user.sql
source ./ddl/functions/ddl_functions_project.sql
source ./ddl/functions/ddl_functions_report.sql
