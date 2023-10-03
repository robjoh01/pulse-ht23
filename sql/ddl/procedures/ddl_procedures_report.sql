--
-- Create procedures for report related tables
--

DROP PROCEDURE IF EXISTS create_report;
DROP PROCEDURE IF EXISTS review_report;

DELIMITER ;;

CREATE PROCEDURE create_report(
    IN arg_employee_id CHAR(36),
    IN arg_project_id CHAR(36),
    IN arg_text LONGTEXT,
    OUT success BOOLEAN
)
BEGIN
    DECLARE projectExists INT DEFAULT 0;
    DECLARE employeeExists INT DEFAULT 0;

    -- Check if the project exists
    SELECT COUNT(*) INTO projectExists FROM `project` WHERE `id` = arg_project_id;

    -- Check if the employee exists
    SELECT COUNT(*) INTO employeeExists FROM `employee` WHERE `id` = arg_employee_id;

    -- Insert the report if both employee and project exist
    IF projectExists = 1 AND employeeExists = 1 THEN
        INSERT INTO `report` (`employee_id`, `project_id`, `creation_date`, `text`, `status`)
        VALUES (arg_employee_id, arg_project_id, CURRENT_DATE(), arg_text, 'pending');
        SET success = TRUE;
    ELSE
        SET success = FALSE;
    END IF;
END;;

CREATE PROCEDURE review_report(
    IN arg_project_manager_id CHAR(36),
    IN arg_report_id INT,
    IN arg_comment MEDIUMTEXT,
    IN arg_marked_as_read BOOLEAN,
    OUT success BOOLEAN
)
BEGIN
    DECLARE managerExists INT DEFAULT 0;
    DECLARE currentStatus TINYTEXT;

    -- Check if the project manager exists
    SELECT COUNT(*) INTO managerExists FROM `project_manager` WHERE `id` = arg_project_manager_id;

    -- Calculate the status based on arg_marked_as_read
    SET currentStatus = CASE 
        WHEN arg_marked_as_read THEN 'submitted'
        ELSE 'pending'
    END;

    -- Update the report if the project manager exists
    IF managerExists = 1 THEN
        -- Update the report status and modified_date
        UPDATE `report`
        SET
            `status` = currentStatus
        WHERE
            `id` = arg_report_id;

        -- Insert the comment into the report_comment table
        INSERT INTO `report_comment` (`project_manager_id`, `creation_date`, `report_id`, `comment`, `status`)
            VALUES (arg_project_manager_id, NOW(), arg_report_id, arg_comment, currentStatus)
        ;

        SET success = TRUE;
    ELSE
        SET success = FALSE;
    END IF;
END;;

DELIMITER ;
