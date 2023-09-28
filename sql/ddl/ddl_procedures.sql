--
-- Create procedures
--

DROP PROCEDURE IF EXISTS fetch_user;
DROP PROCEDURE IF EXISTS fetch_users;

DROP PROCEDURE IF EXISTS fetch_employee;
DROP PROCEDURE IF EXISTS fetch_employees;

DROP PROCEDURE IF EXISTS fetch_project_manager;
DROP PROCEDURE IF EXISTS fetch_project_managers;

DROP PROCEDURE IF EXISTS fetch_project;
DROP PROCEDURE IF EXISTS fetch_projects;

DROP PROCEDURE IF EXISTS fetch_project_archive;
DROP PROCEDURE IF EXISTS fetch_project_archives;

DROP PROCEDURE IF EXISTS fetch_assignment;
DROP PROCEDURE IF EXISTS fetch_assignments;
DROP PROCEDURE IF EXISTS fetch_assignments_filter;

DROP PROCEDURE IF EXISTS fetch_report;
DROP PROCEDURE IF EXISTS fetch_reports;

DELIMITER ;;

CREATE PROCEDURE fetch_user(
    arg_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_users
    WHERE
        `id` = arg_id
    ;
END;;

CREATE PROCEDURE fetch_users()
BEGIN
    SELECT
        *
    FROM v_users
    ;
END;;

CREATE PROCEDURE fetch_employee(
    arg_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_employees
    WHERE
        `employee_id` = arg_id
    ;
END;;

CREATE PROCEDURE fetch_employees()
BEGIN
    SELECT
        *
    FROM v_employees
    ;
END;;

CREATE PROCEDURE fetch_project_manager(
    arg_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_project_managers
    WHERE
        `project_manager_id` = arg_id
    ;
END;;

CREATE PROCEDURE fetch_project_managers()
BEGIN
    SELECT
        *
    FROM v_project_managers
    ;
END;;

CREATE PROCEDURE fetch_project(
    arg_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_projects
    WHERE
        `project_id` = arg_id
    ;
END;;

CREATE PROCEDURE fetch_projects()
BEGIN
    SELECT
        *
    FROM v_projects
    ;
END;;

CREATE PROCEDURE fetch_project_archive(
    arg_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_project_archives
    WHERE
        `project_id` = arg_id
    ;
END;;

CREATE PROCEDURE fetch_project_archives()
BEGIN
    SELECT
        *
    FROM v_project_archives
    ;
END;;

CREATE PROCEDURE fetch_assignment(
    arg_project_id CHAR(36),
    arg_employee_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_assignments
    WHERE
        `project_id` = arg_project_id
        AND `employee_id` = arg_employee_id
    ;
END;;

CREATE PROCEDURE fetch_assignments()
BEGIN
    SELECT
        *
    FROM v_assignments
    ;
END;;

CREATE PROCEDURE fetch_assignments_filter(
    arg_project_id CHAR(36),
    arg_employee_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_assignments
    WHERE
        `project_id` = arg_project_id
        OR `employee_id` = arg_employee_id
    ;
END;;

CREATE PROCEDURE fetch_report(
    arg_project_id CHAR(36),
    arg_employee_id CHAR(36)
)
BEGIN
    SELECT
        *
    FROM v_reports
    WHERE
        `project_id` = arg_project_id
        AND `employee_id` = arg_employee_id
    ;
END;;

CREATE PROCEDURE fetch_reports()
BEGIN
    SELECT
        *
    FROM v_reports
    ;
END;;

DELIMITER ;

source ./ddl/procedures/ddl_procedures_user.sql
source ./ddl/procedures/ddl_procedures_project.sql
