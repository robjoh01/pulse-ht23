--
-- Create procedures for project related tables
--

DROP PROCEDURE IF EXISTS create_project;
DROP PROCEDURE IF EXISTS update_project;
DROP PROCEDURE IF EXISTS archive_project;
DROP PROCEDURE IF EXISTS delete_archive_project;
DROP PROCEDURE IF EXISTS assign_to_project;

DELIMITER ;;

CREATE PROCEDURE create_project(
    IN arg_id CHAR(36),
    IN arg_name VARCHAR(32),
    IN arg_description VARCHAR(96),
    IN arg_due_date DATE,
    OUT success BOOLEAN
)
BEGIN
    DECLARE project_exists BOOLEAN;

    -- Check if the project already exists based on its ID
    SELECT EXISTS(
        SELECT 1 
        FROM `project` 
        WHERE `id` = arg_id
    ) INTO project_exists;

    -- If the project already exists, return FALSE (project creation failed)
    IF project_exists THEN
        SET success = FALSE;
    ELSE
        -- Insert the new project with the provided details
        INSERT INTO `project` (`id`, `name`, `description`, `due_date`)
        VALUES (arg_id, arg_name, arg_description, arg_due_date);

        SET success = TRUE;
    END IF;
END;;

CREATE PROCEDURE update_project (
    IN arg_id CHAR(36),
    IN arg_name VARCHAR(32),
    IN arg_description VARCHAR(96),
    IN arg_due_date DATE,
    OUT success BOOLEAN
)
BEGIN
    DECLARE rows_affected INT;

    UPDATE `project`
    SET
        `name` = arg_name,
        `description` = arg_description,
        `due_date` = arg_due_date
    WHERE
        `id` = arg_id;

    SET rows_affected = ROW_COUNT();

    SET success = rows_affected > 0;
END;;

CREATE PROCEDURE archive_project (
    IN arg_id CHAR(36),
    OUT success BOOLEAN
)
BEGIN
    -- Declare a variable to store the count of archived projects
    DECLARE rows_affected INT;

    -- Delete the project from the project table
    DELETE FROM project WHERE id = arg_id;

    -- Check the number of affected rows after deletion
    SET rows_affected = ROW_COUNT();

    -- Set success based on the number of affected rows
    SET success = (rows_affected > 0);
END;;

CREATE PROCEDURE delete_archive_project(
    IN arg_id CHAR(36),
    OUT success BOOLEAN
)
BEGIN
    DECLARE rows_affected INT;

    -- Delete the archived project
    DELETE FROM project_archive WHERE `id` = arg_id;

    SET rows_affected = ROW_COUNT();

    SET success = rows_affected > 0;
END;;

CREATE PROCEDURE assign_to_project(
    IN arg_project_id CHAR(36),
    IN arg_employee_id CHAR(36),
    IN arg_report_frequency ENUM('daily', 'weekly', 'fortnightly', 'monthly'),
    IN arg_report_custom_submission_date DATE,
    OUT success BOOLEAN
)
BEGIN
    -- Check if the assignment already exists
    DECLARE assignment_exists INT;
    SELECT COUNT(*) INTO assignment_exists
    FROM assignment
    WHERE
        project_id = arg_project_id AND employee_id = arg_employee_id
    ;
    
    IF assignment_exists > 0 THEN
        -- Assignment already exists, set success to false
        SET success = FALSE;
    ELSE
        -- Assignment doesn't exist, create a new assignment
        INSERT INTO assignment (`employee_id`, `project_id`, `creation_date`, `report_frequency`, `report_custom_submission_date`)
        VALUES (arg_employee_id, arg_project_id, CURRENT_DATE(), arg_report_frequency, arg_report_custom_submission_date)
        ;
        
        -- Set success to true
        SET success = TRUE;
    END IF;
END;;

DELIMITER ;
