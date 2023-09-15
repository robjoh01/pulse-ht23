--
-- Delete tables, in order, depending on
-- foreign key constraints.
--
DELETE FROM access_level;
DELETE FROM user;
DELETE FROM project;
DELETE FROM assignment;

--
-- Enable LOAD DATA LOCAL INFILE on the server.
--
SET GLOBAL local_infile = 1;
SHOW VARIABLES LIKE 'local_infile';

--
-- Insert into user
--
LOAD DATA LOCAL INFILE 'users.csv'
INTO TABLE user
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`employee_id`, `username`, `display_name`, `email_address`, `phone_number`)
SET `password` = 'password'
;

-- Insert access levels into database
INSERT INTO access_level
    (`type`)
VALUES
    ("ownership"),
    ("edit"),
    ("comment"),
    ("view")
;

-- Insert admin into database
INSERT INTO user
    (`employee_id`, `username`, `password`, `display_name`, `email_address`, `phone_number`)
VALUES
    ("2e889992-6993-42c2-9366-cf9249a1e61b", "admin", "$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa", "Admin", "admin@gmail.com", "555-XXXX")
;

-- Insert project into database
INSERT INTO project
    (`id`, `name`, `description`, `creation_date`, `modified_date`, `deadline_date`)
VALUES
    ("6e885bbc-6d26-411e-b978-2962acae4bdd", "Sharp Suits", "Lorem Ipsum", "2020-08-22", "2023-09-11", "2023-12-31"),
    ("ba28b243-6889-4c54-a138-ff72333186a2", "Modern Maven", "Lorem Ipsum", "2021-08-22", "2023-09-11", "2023-12-31"),
    ("4e658238-d50c-4812-84f2-be58e8be308a", "Quirky Quarters", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31")
;

-- Insert project into database
INSERT INTO assignment
    (`employee_id`, `project_id`, `access_lvl`)
VALUES
    ("2e889992-6993-42c2-9366-cf9249a1e61b", "4e658238-d50c-4812-84f2-be58e8be308a", "1"),
    ("ca7941f7-9205-4f31-a92b-02c26bce8e17", "6e885bbc-6d26-411e-b978-2962acae4bdd", "4"),
    ("2e889992-6993-42c2-9366-cf9249a1e61b", "ba28b243-6889-4c54-a138-ff72333186a2", "2")
;

--
-- Select statements
--
SELECT * FROM access_level;
SELECT * FROM user;
SELECT * FROM project;
SELECT * FROM assignment;

--
-- Select views
--
SELECT * FROM v_users;
SELECT * FROM v_projects;
SELECT * FROM v_assignments;

--
-- Call procedures
--

--
-- Select functions
--

SELECT create_user("john_doe", "password1");

SELECT * FROM v_users;

SELECT login_user("john_doe", "password1");
SELECT fetch_password("john_doe");

-- Capture the employee_id using fetch_employee_id
SET @employee_id = (SELECT fetch_employee_id("john_doe"));

-- Call edit_user with the captured employee_id
CALL edit_user(@employee_id, NULL, "John Doe", "johndoe@example.com", NULL, @success);

-- Check the result
SELECT @success;

SELECT * FROM v_users;

SELECT delete_user("john_doe", "password1");

SELECT * FROM v_users;
