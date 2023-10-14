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
    IN arg_status_id INT,
    IN arg_category_id INT,
    OUT success BOOLEAN,
    OUT report_id INT
)
BEGIN
    -- Insert into report table
    INSERT INTO `report` (`employee_id`, `project_id`, `creation_date`, `text`, `status_id`, `category_id`)
        VALUES (arg_employee_id, arg_project_id, NOW(), arg_text, arg_status_id, arg_category_id);

    -- Get the last inserted report ID
    SET report_id = LAST_INSERT_ID();

    SET success = TRUE;
END;;

CREATE PROCEDURE review_report(
    IN arg_project_manager_id CHAR(36),
    IN arg_report_id INT,
    IN arg_comment MEDIUMTEXT,
    IN arg_status_id INT,
    OUT success BOOLEAN
)
BEGIN
    DECLARE managerExists INT DEFAULT 0;

    -- Check if the project manager exists
    SELECT COUNT(*) INTO managerExists FROM `project_manager` WHERE `id` = arg_project_manager_id;

    -- Update the report if the project manager exists
    IF managerExists = 1 THEN
        -- Update the report status and modified_date
        UPDATE `report`
        SET
            `status_id` = arg_status_id
        WHERE
            `id` = arg_report_id;

        -- Insert the comment into the report_history table
        INSERT INTO `report_history` (`user_id`, `creation_date`, `report_id`, `comment`)
            VALUES (arg_project_manager_id, NOW(), arg_report_id, arg_comment)
        ;

        SET success = TRUE;
    ELSE
        SET success = FALSE;
    END IF;
END;;

DELIMITER ;
