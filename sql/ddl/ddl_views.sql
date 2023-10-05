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
DROP VIEW IF EXISTS v_report_history;

CREATE VIEW v_users AS
SELECT
    u.id,
    u.username,
    u.display_name,
    u.email_address,
    u.phone_number,
    u.image_url,
    u.creation_date,
    u.logout_date,
    CASE
        WHEN e.id IS NOT NULL THEN 1
        WHEN pm.id IS NOT NULL THEN 0
        ELSE -1
    END AS `is_employee`
FROM user AS u
    LEFT JOIN employee AS e ON u.id = e.id
    LEFT JOIN project_manager AS pm ON u.id = pm.id
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
    p.start_date,
    p.end_date,
    GROUP_CONCAT(pc.category SEPARATOR ', ') AS `categories`
FROM `project` AS p
    LEFT JOIN `project_category` AS pc ON p.id = pc.project_id
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
    a.employee_id,
    a.project_id,
    a.creation_date,
    p.name AS `project_name`,
    p.start_date AS `project_start_date`,
    p.end_date AS `project_end_date`,
    CASE 
        WHEN p.report_deadline IS NOT NULL THEN 
            p.report_deadline
        WHEN p.report_frequency = 'daily' THEN
            LEAST(GREATEST(DATE(p.start_date) + INTERVAL 1 DAY, CURRENT_DATE() + INTERVAL 1 DAY), p.end_date)
        WHEN p.report_frequency = 'weekly' THEN
            LEAST(GREATEST(DATE(p.start_date) + INTERVAL 1 WEEK, CURRENT_DATE() + INTERVAL (7 - DAYOFWEEK(CURRENT_DATE()) + DAYOFWEEK(p.start_date)) DAY), p.end_date)
        WHEN p.report_frequency = 'fortnightly' THEN
            LEAST(GREATEST(DATE(p.start_date) + INTERVAL 2 WEEK, CURRENT_DATE() + INTERVAL (14 - DAYOFWEEK(CURRENT_DATE()) + DAYOFWEEK(p.start_date)) DAY), p.end_date)
        WHEN p.report_frequency = 'monthly' THEN
            -- LEAST(GREATEST(DATE(p.start_date) + INTERVAL 1 MONTH, CURRENT_DATE() + INTERVAL (LAST_DAY(DATE(p.start_date)) - DAYOFMONTH(CURRENT_DATE()) + 1) DAY), p.end_date)
            LEAST(GREATEST(DATE_ADD(p.start_date, INTERVAL 1 MONTH), DATE_ADD(CURRENT_DATE(), INTERVAL (DAYOFWEEK(CURRENT_DATE()) - DAYOFWEEK(p.start_date) - 1) DAY)), p.end_date)
    END + INTERVAL 23 HOUR + INTERVAL 59 MINUTE + INTERVAL 59 SECOND AS `deadline_date`
FROM `assignment` AS a
    JOIN `employee` AS e ON a.employee_id = e.id
    JOIN `project` AS p ON a.project_id = p.id
GROUP BY a.employee_id, a.project_id
ORDER BY a.creation_date DESC
;

CREATE VIEW v_reports AS
SELECT
    r.id,
    r.employee_id,
    u.display_name AS `employee_name`,
    p.name AS `project_name`,
    r.project_id,
    r.creation_date,
    r.text,
    r.status
FROM `report` AS r
    JOIN `project` AS p ON r.project_id = p.id
    JOIN `employee` AS e ON r.employee_id = e.id
    JOIN `user` AS u ON e.id = u.id
GROUP BY r.id
ORDER BY r.creation_date DESC
;

CREATE VIEW v_report_history AS
SELECT
    u.id AS `user_id`,
    u.display_name AS `user_name`,
    rc.id,
    rc.creation_date,
    rc.report_id,
    rc.comment,
    rc.status
FROM `report_comment` AS rc
    JOIN `report` AS r ON rc.report_id = r.id
    JOIN `user` AS u ON u.id = rc.user_id
GROUP BY rc.id
ORDER BY rc.creation_date DESC
;
