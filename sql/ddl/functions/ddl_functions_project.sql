--
-- Create functions for project related tables
--

DROP FUNCTION IF EXISTS does_project_exists;

DELIMITER ;;

CREATE FUNCTION does_project_exists(
    arg_name VARCHAR(32),
    arg_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE project_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `project` 
        WHERE `id` = arg_id OR `name` = arg_name
    ) INTO project_exists;

    RETURN project_exists;
END;;

DELIMITER ;
