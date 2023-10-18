--
-- Create functions for project related tables
--

DROP FUNCTION IF EXISTS does_project_exists;
DROP FUNCTION IF EXISTS does_assignment_exists;

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

CREATE FUNCTION does_assignment_exists(
    arg_employee_id CHAR(36),
    arg_project_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE assignment_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `assignment` 
        WHERE `employee_id` = arg_employee_id AND `project_id` = arg_project_id
    ) INTO assignment_exists;

    RETURN assignment_exists;
END;;

DELIMITER ;
