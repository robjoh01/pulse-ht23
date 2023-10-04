--
-- Create functions for project related tables
--

DROP FUNCTION IF EXISTS does_report_exists;

DELIMITER ;;

CREATE FUNCTION does_report_exists(
    arg_id INT(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE report_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `report` 
        WHERE `id` = arg_id
    ) INTO report_exists;

    RETURN report_exists;
END;;

DELIMITER ;
