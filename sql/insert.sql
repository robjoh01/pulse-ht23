--
-- Delete tables, in order, depending on
-- foreign key constraints.
--
DELETE FROM user;
DELETE FROM project;
DELETE FROM assignment;

-- DESCRIBE user;
-- DESCRIBE project;
-- DESCRIBE assignment;

--
-- Enable LOAD DATA LOCAL INFILE on the server.
--
SET GLOBAL local_infile = 1;
SHOW VARIABLES LIKE 'local_infile';

--
-- Insert into user
--
LOAD DATA LOCAL INFILE 'user.csv'
INTO TABLE user
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
    (`employee_id`, `name`, `email_address`, `mobile_number`)
;

-- Insert admin into database
INSERT INTO user
    (`employee_id`, `name`, `email_address`, `mobile_number`)
VALUES
    ("000", `Admin`, `admin@gmail.com`, `555-XXXX`)
;

SELECT * FROM user;
SELECT * FROM project;
SELECT * FROM assignment;
