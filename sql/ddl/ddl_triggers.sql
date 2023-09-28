--
-- Create triggers
--

DROP TRIGGER IF EXISTS user_before_insert;
DROP TRIGGER IF EXISTS project_before_insert;

DROP TRIGGER IF EXISTS project_before_update;

DROP TRIGGER IF EXISTS user_before_delete;
DROP TRIGGER IF EXISTS project_before_delete;
DROP TRIGGER IF EXISTS archive_project_before_delete;

DELIMITER ;;

CREATE TRIGGER user_before_insert
BEFORE INSERT ON `user`
FOR EACH ROW
BEGIN
    SET NEW.creation_date = CURRENT_DATE();
END;;

CREATE TRIGGER project_before_insert
BEFORE INSERT ON `project`
FOR EACH ROW
BEGIN
    SET NEW.creation_date = CURRENT_DATE();
END;;

CREATE TRIGGER project_before_update
BEFORE UPDATE ON project
FOR EACH ROW
BEGIN
    SET NEW.modified_date = CURRENT_DATE();
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

CREATE TRIGGER archive_project_before_delete
BEFORE DELETE ON project_archive
FOR EACH ROW
BEGIN
    -- Ensure that when a project_archive is deleted, their assignments are appropriately handled
    DELETE FROM report WHERE `project_id` = OLD.id;
END;;

DELIMITER ;
