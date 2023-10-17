--
-- Create views
--

DROP VIEW IF EXISTS v_categories;
DROP VIEW IF EXISTS v_statuses;

DROP VIEW IF EXISTS v_users;
DROP VIEW IF EXISTS v_employees;
DROP VIEW IF EXISTS v_project_managers;

DROP VIEW IF EXISTS v_projects;
DROP VIEW IF EXISTS v_project_archives;

DROP VIEW IF EXISTS v_assignments;

DROP VIEW IF EXISTS v_reports;
DROP VIEW IF EXISTS v_report_history;

CREATE VIEW v_categories AS
SELECT
    c.id,
    c.name
FROM `category` AS c
GROUP BY c.id
;

CREATE VIEW v_statuses AS
SELECT
    s.id,
    s.name
FROM `status` AS s
GROUP BY s.id
;

CREATE VIEW v_users AS
SELECT
    u.id,
    CASE
        WHEN u.display_name IS NOT NULL AND u.display_name != '' THEN u.display_name
        ELSE u.username
    END AS `name`,
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

CREATE VIEW v_project_deadlines AS
SELECT
    pd.id,
    pd.project_id,
    pd.report_deadline
FROM `project_deadline` AS pd
GROUP BY pd.id
ORDER BY pd.report_deadline DESC
;

CREATE VIEW v_projects AS
SELECT
    p.id,
    p.name,
    p.description,
    p.creation_date,
    p.modified_date,
    p.start_date,
    p.end_date,
    p.report_frequency,
    CASE
        WHEN COUNT(DISTINCT pd.id) > 0 THEN
            (SELECT MIN(report_deadline) FROM project_deadline WHERE report_deadline >= CURRENT_DATE())
        WHEN p.report_frequency = 'daily' THEN
            midnight_date(LEAST(GREATEST(p.start_date + INTERVAL 1 DAY, CURRENT_DATE() + INTERVAL(DAYOFWEEK(p.start_date) - DAYOFWEEK(CURRENT_DATE())) DAY) + INTERVAL 1 DAY, p.end_date))
        WHEN p.report_frequency = 'weekly' THEN
            midnight_date(LEAST(GREATEST(p.start_date + INTERVAL 1 WEEK, CURRENT_DATE() + INTERVAL(DAYOFWEEK(p.start_date) - DAYOFWEEK(CURRENT_DATE())) DAY) + INTERVAL 1 WEEK, p.end_date))
        WHEN p.report_frequency = 'fortnightly' THEN
            midnight_date(LEAST(GREATEST(p.start_date + INTERVAL 2 WEEK, CURRENT_DATE() + INTERVAL(DAYOFWEEK(p.start_date) - DAYOFWEEK(CURRENT_DATE())) DAY) + INTERVAL 2 WEEK, p.end_date))
        WHEN p.report_frequency = 'monthly' THEN
            midnight_date(LEAST(GREATEST(p.start_date + INTERVAL 1 MONTH, CURRENT_DATE() + INTERVAL(DAYOFWEEK(p.start_date) - DAYOFWEEK(CURRENT_DATE())) DAY) + INTERVAL 1 MONTH, p.end_date))
    END AS `deadline_date`,
    COUNT(DISTINCT r.id) AS `report_count`,
    COUNT(DISTINCT a.project_id) AS `assignment_count`
FROM `project` AS p
    LEFT JOIN `report` AS r ON p.id = r.project_id
    LEFT JOIN `assignment` AS a ON p.id = a.project_id
    LEFT JOIN `project_deadline` AS pd ON p.id = pd.project_id
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
    p.deadline_date AS `project_deadline_date`
FROM `assignment` AS a
    JOIN `employee` AS e ON a.employee_id = e.id
    JOIN v_projects AS p ON a.project_id = p.id
GROUP BY a.employee_id, a.project_id
ORDER BY a.creation_date DESC
;

CREATE VIEW v_reports AS
SELECT
    r.id,
    r.employee_id,
    u.name AS `employee_name`,
    p.name AS `project_name`,
    r.project_id,
    r.creation_date,
    r.text,
    s.id AS `status_id`,
    c.id AS `category_id`,
    s.name AS `status`,
    c.name AS `category`
FROM `report` AS r
    JOIN `project` AS p ON r.project_id = p.id
    JOIN `employee` AS e ON r.employee_id = e.id
    JOIN v_users AS u ON e.id = u.id
    LEFT JOIN `status` AS s ON r.status_id = s.id
    LEFT JOIN `category` AS c ON r.category_id = c.id
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
    rc.comment
FROM `report_history` AS rc
    JOIN `report` AS r ON rc.report_id = r.id
    JOIN `user` AS u ON u.id = rc.user_id
GROUP BY rc.id
ORDER BY rc.creation_date DESC
;
