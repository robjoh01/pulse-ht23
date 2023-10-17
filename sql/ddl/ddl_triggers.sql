--
-- Create triggers
--

DROP TRIGGER IF EXISTS user_before_insert;
DROP TRIGGER IF EXISTS project_before_insert;

DROP TRIGGER IF EXISTS project_before_update;

DROP TRIGGER IF EXISTS user_before_delete;
DROP TRIGGER IF EXISTS project_before_delete;
DROP TRIGGER IF EXISTS project_archive_before_delete;

DROP TRIGGER IF EXISTS report_before_delete;
DROP TRIGGER IF EXISTS report_after_insert;

DELIMITER ;;

CREATE TRIGGER user_before_insert
BEFORE INSERT ON `user`
FOR EACH ROW
BEGIN
    SET NEW.creation_date = NOW();
    SET NEW.modified_date = NOW();
END;;

CREATE TRIGGER project_before_insert
BEFORE INSERT ON `project`
FOR EACH ROW
BEGIN
    SET NEW.creation_date = NOW();
    SET NEW.modified_date = NOW();
END;;

CREATE TRIGGER project_before_update
BEFORE UPDATE ON project
FOR EACH ROW
BEGIN
    SET NEW.modified_date = NOW();
END;;

CREATE TRIGGER user_before_delete
BEFORE DELETE ON user
FOR EACH ROW
BEGIN
    -- Ensure that when a user is deleted, their assignments are appropriately handled
    DELETE FROM assignment WHERE `employee_id` = OLD.id;
    DELETE FROM report WHERE `employee_id` = OLD.id;
    DELETE FROM employee WHERE `id` = OLD.id;
    DELETE FROM project_manager WHERE `id` = OLD.id;
END;;

CREATE TRIGGER project_before_delete
BEFORE DELETE ON project
FOR EACH ROW
BEGIN
    -- Disable foreign key checks temporarily
    SET FOREIGN_KEY_CHECKS = 0;

    -- Delete the assignments associated with the project
    DELETE FROM assignment WHERE `project_id` = OLD.id;

    -- Insert the project into the project_archive table
    INSERT INTO project_archive (`id`, `name`, `description`, `creation_date`)
        SELECT
            `id`,
            `name`,
            `description`,
            `creation_date`
    FROM project
    WHERE
        `id` = OLD.id
    ;

    -- Re-enable foreign key checks
    SET FOREIGN_KEY_CHECKS = 1;
END;;

CREATE TRIGGER project_archive_before_delete
BEFORE DELETE ON `project_archive`
FOR EACH ROW
BEGIN
    -- Ensure that when a project_archive is deleted, their assignments are appropriately handled
    DELETE FROM `report` WHERE `project_id` = OLD.id;
END;;

CREATE TRIGGER report_before_delete
BEFORE DELETE ON `report`
FOR EACH ROW
BEGIN
    -- Delete related comments from report_history
    DELETE FROM `report_history` WHERE `report_id` = OLD.id;
END;;

CREATE TRIGGER report_after_insert
AFTER INSERT ON `report`
FOR EACH ROW
BEGIN
    -- Check if the report is related to an assignment
    IF (SELECT COUNT(*) FROM `assignment` WHERE employee_id = NEW.employee_id AND project_id = NEW.project_id) > 0 THEN
        -- Remove the assignment
        DELETE FROM `assignment` WHERE employee_id = NEW.employee_id AND project_id = NEW.project_id;
    END IF;

    -- Insert into report_history table
    INSERT INTO `report_history` (`user_id`, `creation_date`, `report_id`, `comment`)
        VALUES (NEW.employee_id, NOW(), NEW.id, NEW.text);
END;;

DELIMITER ;
