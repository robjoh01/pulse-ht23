--
-- Create views
--

DROP VIEW IF EXISTS v_users;
DROP VIEW IF EXISTS v_employees;
DROP VIEW IF EXISTS v_project_managers;

DROP VIEW IF EXISTS v_projects;
DROP VIEW IF EXISTS v_project_archives;
DROP VIEW IF EXISTS v_assignments;
DROP VIEW IF EXISTS v_reports;

CREATE VIEW v_users AS
SELECT
    u.id,
    u.username,
    u.display_name,
    u.email_address,
    u.phone_number,
    u.image_url,
    u.creation_date,
    u.logout_date
FROM user AS u
GROUP BY u.id
ORDER BY u.logout_date DESC, u.creation_date DESC
;

CREATE VIEW v_employees AS
SELECT
    e.id AS `employee_id`,
    u.username,
    u.display_name,
    u.email_address,
    u.phone_number,
    u.image_url,
    u.creation_date,
    u.logout_date
FROM `employee` AS e
    JOIN `user` AS u ON u.id = e.id
GROUP BY e.id
ORDER BY u.logout_date DESC, u.creation_date DESC
;

CREATE VIEW v_project_managers AS
SELECT
    pm.id AS `project_manager_id`,
    u.username,
    u.display_name,
    u.email_address,
    u.phone_number,
    u.image_url,
    u.creation_date,
    u.logout_date
FROM `project_manager` AS pm
    JOIN `user` AS u ON u.id = pm.id
GROUP BY pm.id
ORDER BY u.logout_date DESC, u.creation_date DESC
;

CREATE VIEW v_projects AS
SELECT
    p.id AS `project_id`,
    p.name,
    p.description,
    p.creation_date,
    p.modified_date,
    p.due_date,
    p.start_date,
    p.end_date,
    p.report_frequency
FROM `project` AS p
GROUP BY p.id
ORDER BY p.modified_date DESC, p.creation_date DESC
;

CREATE VIEW v_project_archives AS
SELECT
    p.id AS `project_id`,
    p.name,
    p.description,
    p.creation_date
FROM project_archive AS p
GROUP BY p.id
ORDER BY p.creation_date DESC
;

CREATE VIEW v_assignments AS
SELECT
    a.name,
    a.employee_id,
    a.project_id,
    a.creation_date,
    a.report_frequency,
    a.report_custom_submission_date
FROM `assignment` AS a
    JOIN `employee` AS e ON a.employee_id = e.id
GROUP BY a.employee_id, a.project_id
ORDER BY a.creation_date DESC
;

CREATE VIEW v_reports AS
SELECT
    r.employee_id,
    r.project_id,
    r.creation_date,
    r.text,
    r.has_been_read
FROM `report` AS r
    JOIN `employee` AS e ON r.employee_id = e.id
GROUP BY r.employee_id, r.project_id
ORDER BY r.has_been_read DESC, r.creation_date DESC
;
