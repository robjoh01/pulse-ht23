--
-- Delete tables, in order, depending on
-- foreign key constraints.
--
DELETE FROM user;
DELETE FROM employee;
DELETE FROM project_manager;
DELETE FROM project;
DELETE FROM assignment;
DELETE FROM report;

--
-- Enable LOAD DATA LOCAL INFILE on the server.
--
SET GLOBAL local_infile = 1;
SHOW VARIABLES LIKE 'local_infile';

--
-- Insert into user 
--
LOAD DATA LOCAL INFILE 'csv/users.csv'
INTO TABLE user
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`id`, `username`, `password`, `display_name`, `email_address`, `phone_number`, `image_url`)
;

--
-- Insert into employee 
--
LOAD DATA LOCAL INFILE 'csv/employees.csv'
INTO TABLE employee
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`id`)
;

--
-- Insert into project_manager 
--
LOAD DATA LOCAL INFILE 'csv/project_managers.csv'
INTO TABLE project_manager
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`id`)
;

--
-- Insert into project
--
LOAD DATA LOCAL INFILE 'csv/projects.csv'
INTO TABLE project
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`project_manager_id`, `id`, `name`, `description`, `creation_date`, `modified_date`, `start_date`, `end_date`, `report_frequency`, `report_deadline`)
;

--
-- Insert into assignment
--
LOAD DATA LOCAL INFILE 'csv/assignments.csv'
INTO TABLE assignment
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`employee_id`, `project_id`, `creation_date`)
;

--
-- Insert into report
--
LOAD DATA LOCAL INFILE 'csv/reports.csv'
INTO TABLE report
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`employee_id`, `project_id`, `creation_date`, `text`, `status`)
;
