--
-- Create views
--

DROP VIEW IF EXISTS v_users;
DROP VIEW IF EXISTS v_projects;
DROP VIEW IF EXISTS v_assignments;
DROP VIEW IF EXISTS v_assignments_extend;
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
;

CREATE VIEW v_projects AS
SELECT
    p.id,
    p.name,
    p.description,
    p.creation_date,
    p.modified_date,
    p.due_date
FROM project AS p
GROUP BY p.id
ORDER BY p.modified_date DESC, p.creation_date DESC
;

CREATE VIEW v_assignments AS
SELECT
    u.username,
    e.id,
    p.name AS `project_name`,
    p.id AS `project_id`,
    rf.type AS `report_frequency`,
    a.creation_date AS `creation_date`
FROM assignment AS a
    JOIN `employee` AS e ON a.employee_id = e.id
    JOIN `user` AS u ON u.id = e.id
    JOIN `project` AS p ON a.project_id = p.id
    JOIN `report_frequency` AS rf ON a.report_frequency = rf.id
GROUP BY u.id, a.project_id
;

CREATE VIEW v_assignments_extend AS
SELECT
    u.username AS `employee_username`,
    e.id AS `employee_id`,
    p.name AS `project_name`,
    p.id AS `project_id`,
    a.creation_date AS `creation_date`,
    p.description AS `project_description`,
    p.creation_date AS `project_creation_date`,
    p.modified_date AS `project_modified_date`,
    p.due_date AS `project_due_date`,
    rf.type AS `report_frequency`
FROM assignment AS a
    JOIN `employee` AS e ON a.employee_id = e.id
    JOIN `user` AS u ON u.id = e.id
    JOIN `project` AS p ON a.project_id = p.id
    JOIN `report_frequency` AS rf ON a.report_frequency = rf.id
GROUP BY a.employee_id, a.project_id
;

CREATE VIEW v_reports AS
SELECT
    a.name AS `assignment_name`,
    r.creation_date AS `creation_date`,
    p.name AS `project_name`,
    p.id AS `project_id`,
    u.username AS `employee_name`,
    e.id AS `employee_id`,
    r.text
FROM report AS r
    JOIN `assignment` AS a on r.project_id = a.project_id AND r.employee_id = a.employee_id
    JOIN `employee` AS e ON a.employee_id = e.id
    JOIN `user` AS u ON u.id = e.id
    JOIN `project` AS p ON r.project_id = p.id
GROUP BY r.project_id, r.employee_id, r.creation_date
ORDER BY r.creation_date DESC
;