--
-- Create functions
--

DROP FUNCTION IF EXISTS generate_guid;

DROP FUNCTION IF EXISTS fetch_employee_id;
DROP FUNCTION IF EXISTS fetch_password;

DROP FUNCTION IF EXISTS does_user_exist;
DROP FUNCTION IF EXISTS create_user;
DROP FUNCTION IF EXISTS update_user;
DROP FUNCTION IF EXISTS delete_user;

DROP FUNCTION IF EXISTS does_project_exist;
DROP FUNCTION IF EXISTS create_project;
DROP FUNCTION IF EXISTS update_project;
DROP FUNCTION IF EXISTS delete_project;

DELIMITER ;;

CREATE FUNCTION generate_guid() RETURNS CHAR(36)
BEGIN
    DECLARE guid CHAR(36);
    SET guid = UUID();
    RETURN guid;
END;;

CREATE FUNCTION fetch_employee_id(
    arg_username VARCHAR(16)
)
RETURNS CHAR(36)
BEGIN
    DECLARE emp_id CHAR(36);
    
    SELECT `employee_id` INTO emp_id
    FROM `user`
    WHERE
        `username` = arg_username
    ;
    
    RETURN emp_id;
END;;

CREATE FUNCTION fetch_password (
    arg_employee_id CHAR(36)
)
RETURNS VARCHAR(128)
BEGIN
    DECLARE hashed_password VARCHAR(128);

    SELECT `password` INTO hashed_password
    FROM `user`
    WHERE
        `employee_id` = arg_employee_id
    ;

    RETURN hashed_password;
END;;

CREATE FUNCTION does_user_exist(
    username_arg VARCHAR(16),
    employee_id_arg CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE user_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `user` 
        WHERE `employee_id` = employee_id_arg OR `username` = username_arg
    ) INTO user_exists;

    RETURN user_exists;
END;;

CREATE FUNCTION create_user (
    arg_id CHAR(36),
    arg_username VARCHAR(16),
    arg_password VARCHAR(128),
    arg_email_address VARCHAR(32)
)
RETURNS CHAR(36)
BEGIN
    DECLARE user_count INT;

    -- Check if the username, email_address, or employee_id already exists in the user table
    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE username = arg_username OR email_address = arg_email_address;

    -- If the username or email_address exists, return NULL (user creation failed)
    IF user_count > 0 THEN
        RETURN FALSE;
    ELSE
        -- If the username and email_address don't exist, and insert the new user
        INSERT INTO `user` (`employee_id`, `username`, `password`, `email_address`, `creation_date`)
            VALUES (arg_id, arg_username, arg_password, arg_email_address, CURRENT_DATE());
        RETURN TRUE;
    END IF;
END;;

CREATE FUNCTION update_user(
    employee_id_arg CHAR(36),
    new_display_name VARCHAR(32),
    new_email_address VARCHAR(32),
    new_phone_number VARCHAR(32),
    new_image_url VARCHAR(128)
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    UPDATE `user`
    SET
        `display_name` = new_display_name,
        `email_address` = new_email_address,
        `phone_number` = new_phone_number,
        `image_url` = new_image_url
    WHERE
        `employee_id` = employee_id_arg;

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

CREATE FUNCTION delete_user (
    arg_employee_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    -- Check if the employee_id exists in the user table
    DECLARE user_count INT;

    SELECT COUNT(*) INTO user_count
    FROM `user`
    WHERE `employee_id` = arg_employee_id;

    IF user_count > 0 THEN
        -- Disable foreign key checks temporarily
        SET FOREIGN_KEY_CHECKS = 0;

        -- Delete the user's assignments from assignment table
        DELETE FROM `assignment`
        WHERE `employee_id` = arg_employee_id;

        -- Delete the user from user table
        DELETE FROM `user`
        WHERE `employee_id` = arg_employee_id;

        -- Re-enable foreign key checks
        SET FOREIGN_KEY_CHECKS = 1;

        RETURN TRUE; -- Deletion successful
    ELSE
        RETURN FALSE; -- Deletion failed (employee_id doesn't exist)
    END IF;
END;;

CREATE FUNCTION create_project(
    arg_employee_id CHAR(36),
    arg_name VARCHAR(32),
    arg_description VARCHAR(96),
    arg_due_date DATE
)
RETURNS CHAR(36)
BEGIN
    DECLARE new_project_id CHAR(36);
    DECLARE admin_employee_id CHAR(36);

    -- Generate a new GUID for the project ID
    SET new_project_id = generate_guid();

    -- Fetch admin's employee_id based on the username
    SELECT `employee_id` INTO admin_employee_id
    FROM `user`
    WHERE `username` = 'admin';

    -- Insert the new project with the generated GUID
    INSERT INTO `project` (`id`, `name`, `description`, `creation_date`, `modified_date`, `due_date`)
        VALUES (new_project_id, arg_name, arg_description, CURRENT_DATE(), NULL, arg_due_date)
    ;

    -- Insert assignment record for the user and admin with default role of 1 (employee)
    INSERT INTO `assignment` (`employee_id`, `project_id`, `role`, `creation_date`)
        VALUES (arg_employee_id, new_project_id, 1, CURRENT_DATE()),
               (admin_employee_id, new_project_id, 2, CURRENT_DATE())
    ;

    RETURN new_project_id;
END;;

CREATE FUNCTION update_project(
    arg_id CHAR(36),
    arg_name VARCHAR(32),
    arg_description VARCHAR(96),
    arg_due_date DATE
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    UPDATE `project`
    SET
        `name` = arg_name,
        `description` = arg_description,
        `due_date` = arg_due_date,
        `modified_date` = CURRENT_DATE()
    WHERE
        `id` = arg_id;

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

CREATE FUNCTION delete_project(
    arg_id CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE rows_affected INT;

    -- Disable foreign key checks temporarily
    SET FOREIGN_KEY_CHECKS = 0;

    -- Delete the project from the project table
    DELETE FROM `project`
    WHERE `id` = arg_id;

    -- Re-enable foreign key checks
    SET FOREIGN_KEY_CHECKS = 1;

    SET rows_affected = ROW_COUNT();

    RETURN rows_affected > 0;
END;;

CREATE FUNCTION does_project_exist(
    name_arg VARCHAR(32),
    id_arg CHAR(36)
)
RETURNS BOOLEAN
BEGIN
    DECLARE project_exists BOOLEAN;

    SELECT EXISTS(
        SELECT 1 
        FROM `project` 
        WHERE `id` = id_arg OR `name` = name_arg
    ) INTO project_exists;

    RETURN project_exists;
END;;

DELIMITER ;
