--
-- Delete tables, in order, depending on
-- foreign key constraints.
--
DELETE FROM user;
DELETE FROM project;
DELETE FROM assignment;
DELETE FROM report_frequency;
DELETE FROM report;

--
-- Enable LOAD DATA LOCAL INFILE on the server.
--
SET GLOBAL local_infile = 1;
SHOW VARIABLES LIKE 'local_infile';

-- --
-- -- Insert into user
-- --
-- LOAD DATA LOCAL INFILE 'users.csv'
-- INTO TABLE user
-- CHARSET utf8
-- FIELDS
--     TERMINATED BY ','
--     ENCLOSED BY '"'
-- LINES
--     TERMINATED BY '\n'
-- IGNORE 1 LINES
--     (`employee_id`, `username`, `display_name`, `email_address`, `phone_number`)
-- SET `password` = 'password'
-- ;

INSERT INTO report_frequency
    (`type`)
VALUES
    ("daily"),
    ("weekly"),
    ("fortnightly"),
    ("monthly")
;

-- Insert admin into database
INSERT INTO user
    (`id`, `username`, `password`, `display_name`, `email_address`, `phone_number`, `image_url`, `creation_date`)
VALUES
    ("2e889992-6993-42c2-9366-cf9249a1e61b", "admin", "$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa", "John Doe", "johndoe@example.com", "555-XXXX", "https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg", CURRENT_DATE()),
    ("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "johnnyDoe", "$2a$10$LAzKDxuiDFISTLk0ruL7..POJs1YWQ6Yi/S7dBMn4zTEjjJEEzRVa", "John Doe", "johndoe@example.com", "555-XXXX", "https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg", CURRENT_DATE())
;

INSERT INTO project_manager
    (`id`)
VALUES
    ("2e889992-6993-42c2-9366-cf9249a1e61b")
;

INSERT INTO employee
    (`id`)
VALUES
    ("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef")
;

-- Insert project into database
INSERT INTO project
    (`id`, `name`, `description`, `creation_date`, `modified_date`, `due_date`)
VALUES
    ("6e885bbc-6d26-411e-b978-2962acae4bdd", "Sharp Suits", "Lorem Ipsum", "2020-08-22", "2023-09-11", "2023-12-31"),
    ("ba28b243-6889-4c54-a138-ff72333186a2", "Modern Maven", "Lorem Ipsum", "2021-08-22", "2023-09-11", "2023-12-31"),
    ("4e658238-d50c-4812-84f2-be58e8be308a", "Quirky Quarters", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31"),

    ("38a3315d-fe13-4692-b001-872d6656689a", "Project A", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31"),
    ("bf23b742-a36b-4251-84d1-4db5fb30248d", "Project B", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31"),
    ("445390fb-509e-4e3b-985a-f20df536512c", "Project C", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31"),
    ("d615786c-4610-4558-b2b6-113348aa5dac", "Project D", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31"),
    ("1650f7ca-9b08-4907-af57-671342a219a2", "Project E", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31"),
    ("8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9", "Project F", "Lorem Ipsum", "2019-08-22", "2023-10-11", "2023-12-31")
;

-- Insert project into database
INSERT INTO assignment
    (`name`, `employee_id`, `project_id`, `creation_date`, `report_frequency`)
VALUES
    ("Assignment A", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "4e658238-d50c-4812-84f2-be58e8be308a", CURRENT_DATE(), 1),
    ("Assignment B", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "ba28b243-6889-4c54-a138-ff72333186a2", CURRENT_DATE(), 2),
    ("Assignment C", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "38a3315d-fe13-4692-b001-872d6656689a", CURRENT_DATE(), 3),
    ("Assignment D", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "bf23b742-a36b-4251-84d1-4db5fb30248d", CURRENT_DATE(), 4),
    ("Assignment E", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "445390fb-509e-4e3b-985a-f20df536512c", CURRENT_DATE(), 1),
    ("Assignment F", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "d615786c-4610-4558-b2b6-113348aa5dac", CURRENT_DATE(), 2),
    ("Assignment G", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "1650f7ca-9b08-4907-af57-671342a219a2", CURRENT_DATE(), 3),
    ("Assignment H", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9", CURRENT_DATE(), 4)
;

INSERT INTO report
    (`employee_id`, `project_id`, `creation_date`, `text`)
VALUES
    ("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9", " 2023-12-24",
    "Hello, World!"),
    ("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "ba28b243-6889-4c54-a138-ff72333186a2", "2000-09-25",
    "Hello, World!"),
    ("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef", "bf23b742-a36b-4251-84d1-4db5fb30248d", CURRENT_DATE(),
    "Hello, World!")
;
