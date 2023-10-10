"use strict";

const mysql = require("promise-mysql");
const config = require("./../../config/db/pulse.json");

// const appUtil = require("./appUtil.js");
const hashUtil = require("./hashUtil.js");
const dateUtil = require("./dateUtil.js");

let dbUtil = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },

    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesProjectExists: async function(name = null, id = null) {
        const db = await this.connectDatabase();

        let sql = `SELECT does_project_exists(?, ?);`;
        let res = await db.query(sql, [name, id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },
    createProject: async function(id, managerId, name, description = null, startDate, endDate, reportFrequency, reportDeadline) {
        const db = await this.connectDatabase();
        const query = `CALL create_project(?, ?, ?, ?, ?, ?, ?, ?, @success); SELECT @success as success;`;

        let res = await db.query(query, [id, managerId, name, description, startDate, endDate, reportFrequency, reportDeadline]);

        db.end();

        return Boolean(res[1][0].success);
    },
    updateProject: async function(id, name = null, description = null, startDate = null, endDate = null, reportFrequency = null, reportDeadline = null) {
        const db = await this.connectDatabase();
        const query = `CALL update_project(?, ?, ?, ?, ?, ?, ?, @success); SELECT @success as success;`;

        let res = await db.query(query, [id, name, description, startDate, endDate, reportFrequency, reportDeadline]);

        db.end();

        return Boolean(res[1][0].success);
    },
    archiveProject: async function(id) {
        const db = await this.connectDatabase();
        const query = `CALL archive_project(?, @success); SELECT @success as success;`;

        let res = await db.query(query, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },
    deleteArchiveProject: async function(id) {
        const db = await this.connectDatabase();
        const query = `CALL delete_archive_project(?, @success); SELECT @success as success;`;

        let res = await db.query(query, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },
    assignToProject: async function(employeeId, projectId) {
        const doesUserExists = await this.doesUserExists(null, employeeId);

        if (!doesUserExists) {
            return false;
        }

        const doesProjectExists = await this.doesProjectExists(null, projectId);

        if (!doesProjectExists) {
            return false;
        }

        const db = await this.connectDatabase();
        const query = `CALL assign_to_project(?, ?, @success); SELECT @success as success;`;

        let res = await db.query(query, [employeeId, projectId]);

        db.end();

        return Boolean(res[1][0].success);
    },

    isEmployee: async function(id) {
        if (!id) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT is_user_employee(?);`;
        let res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },
    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesUserExists: async function(username = null, id = null) {
        if (!username && !id) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT does_user_exists(?, ?);`;
        let res = await db.query(sql, [username, id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },
    doesUserHavePermission: async function(id, password) {
        if (!id || !password) {
            return false;
        }

        const doesUserExist = await this.doesUserExists(null, id); // Check if user is exists

        if (!doesUserExist) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT get_user_password(?);`;
        let res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        return await hashUtil.compare(password, hashedPassword);
    },
    createUser: async function(id, isEmployee, username, password, email) {
        const db = await this.connectDatabase();

        const sql = 'CALL create_user(?, ?, ?, ?, ?, @success); SELECT @success as success;';
        const hashedPassword = await hashUtil.hash(password);

        let res = await db.query(sql, [id, isEmployee, username, hashedPassword, email]);

        db.end();

        return Boolean(res[1][0].success);
    },
    updateUser: async function(id, newPassword = null, newDisplayName = null, newEmailAddress = null, newPhoneNumber = null, newImageURL = null) {
        const db = await this.connectDatabase();
    
        let hashedPassword = null;

        if (newPassword) {
            hashedPassword = await hashUtil.hash(newPassword);
        }

        let sql = `CALL update_user(?, ?, ?, ?, ?, ?, @success); SELECT @success as success;`;
        let res = await db.query(sql, [id, hashedPassword, newDisplayName, newEmailAddress, newPhoneNumber, newImageURL]);

        db.end();

        return Boolean(res[1][0].success);
    },
    deleteUser: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL delete_user(?, @success); SELECT @success as success;`;

        let res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },
    loginUser: async function(username, password) {
        const doesUserExist = await this.doesUserExists(username); // Check if user is exists

        if (!doesUserExist) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT get_user_id(?);`;
        let res = await db.query(sql, [username]);

        const id = res[0][Object.keys(res[0])[0]]; // Get user's id

        sql = `SELECT get_user_password(?);`;
        res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]]; // Get user's password
        const isValid = await hashUtil.compare(password, hashedPassword); // Compare the hash and raw password

        if (!isValid) {
            return false;
        }

        return id;
    },
    logoutUser: async function(id) {
        const db = await this.connectDatabase();

        let sql = `CALL user_logout(?);`;
        await db.query(sql, [id]);

        db.end();

        return true;
    },

    doesReportExists: async function(id) {
        if (!id) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT does_report_exists(?);`;
        let res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },
    createReport: async function(employeeId, projectId, text) {
        const doesUserExists = await this.doesUserExists(null, employeeId);

        if (!doesUserExists) {
            return false;
        }

        const doesProjectExists = await this.doesProjectExists(null, projectId);

        if (!doesProjectExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = 'CALL create_report(?, ?, ?, @success, @report_id); SELECT @success as success, @report_id as report_id;';

        let res = await db.query(sql, [employeeId, projectId, text]);

        db.end();

        const success = Boolean(res[1][0].success);
        const reportId = success ? parseInt(res[1][0].report_id) : null;

        return { success, reportId };
    },
    reviewReport: async function(managerId, reportId, comment, markedAsRead) {
        const doesUserExists = await this.doesUserExists(null, managerId);

        if (!doesUserExists) {
            return false;
        }

        const isEmployee = await this.isEmployee(managerId);

        if (isEmployee) {
            return false;
        }

        const doesReportExists = await this.doesReportExists(reportId);

        if (!doesReportExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = 'CALL review_report(?, ?, ?, ?, @success); SELECT @success as success;';

        let res = await db.query(sql, [managerId, reportId, comment, markedAsRead]);

        db.end();

        return Boolean(res[1][0].success);
    },

    fetchStatuses: async function() {
        const db = await this.connectDatabase();
        const  sql = `CALL fetch_statuses();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },
    fetchCategories: async function() {
        const db = await this.connectDatabase();
        const  sql = `CALL fetch_categories();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },
    fetchEmployee: async function(id) {
        const db = await this.connectDatabase();

        let sql = `CALL fetch_employee(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        return data;
    },
    fetchEmployees: async function() {
        const db = await this.connectDatabase();
        const  sql = `CALL fetch_employees();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },
    fetchProjectManager: async function(id) {
        const db = await this.connectDatabase();

        let sql = `CALL fetch_project_manager(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        return data;
    },
    fetchProjectManagers: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_project_managers();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },
    fetchUser: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_user(?);`;

        const res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        data.is_employee = Boolean(data.is_employee);
        data.creation_date = dateUtil.parseDate(data.creation_date);
        data.logout_date = dateUtil.parseDate(data.logout_date);

        return data;
    },
    fetchUsers: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_users();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.is_employee = Boolean(x.is_employee);
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.logout_date = dateUtil.parseDate(x.logout_date);
        });

        return data;
    },
    fetchProject: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_project(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        data.creation_date = dateUtil.parseDate(data.creation_date);
        data.modified_date = dateUtil.parseDate(data.modified_date);
        data.start_date = dateUtil.parseDate(data.start_date);
        data.end_date = dateUtil.parseDate(data.end_date);

        return data;
    },
    fetchProjects: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_projects();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.modified_date = dateUtil.parseDate(x.modified_date);
            x.start_date = dateUtil.parseDate(x.start_date);
            x.end_date = dateUtil.parseDate(x.end_date);
        });

        return data;
    },
    fetchArchiveProject: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_project_archive(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        data.creation_date = dateUtil.parseDate(data.creation_date);

        return data;
    },
    fetchArchiveProjects: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_project_archives();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
        });

        return data;
    },
    fetchProjectsWithFilter: async function(query) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_projects_with_filter(?, ?);`;

        const [rows] = await db.query(sql, [query, `%${query}%`]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.modified_date = dateUtil.parseDate(x.modified_date);
            x.start_date = dateUtil.parseDate(x.start_date);
            x.end_date = dateUtil.parseDate(x.end_date);
        });

        return data;
    },
    fetchAssignment: async function(projectId, employeeId) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_assignment(?, ?);`;

        let res = await db.query(sql, [projectId, employeeId]);

        db.end();

        const data = {...res[0][0]};

        data.creation_date = dateUtil.parseDate(data.creation_date);
        data.project_start_date = dateUtil.parseDate(data.project_start_date);
        data.project_end_date = dateUtil.parseDate(data.project_end_date);
        data.deadline_date = dateUtil.parseDateExtend(data.deadline_date);

        return data;
    },
    fetchAssignments: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_assignments();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.project_start_date = dateUtil.parseDate(x.project_start_date);
            x.project_end_date = dateUtil.parseDate(x.project_end_date);
            x.deadline_date = dateUtil.parseDateExtend(x.deadline_date);
        });

        return data;
    },
    fetchAssignmentsForEmployee: async function(employeeId) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_assignments_for_employee(?);`;

        const [rows] =  await db.query(sql, [employeeId]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.project_start_date = dateUtil.parseDate(x.project_start_date);
            x.project_end_date = dateUtil.parseDate(x.project_end_date);
            x.deadline_date = dateUtil.parseDateExtend(x.deadline_date);
            x.time_left = dateUtil.calcTimeLeft(x.deadline_date);
        });

        return data;
    },
    fetchReport: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_report(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        // creation_date: 2070-12-30T23:00:00.000Z,

        data.creation_date = dateUtil.parseDateExtend(data.creation_date);

        return data;
    },
    fetchReportHistory: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_report_history(?);`;

        const [rows] = await db.query(sql, [id]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateExtend(x.creation_date);
        });

        return data;
    },
    fetchReports: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_reports();`;

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateExtend(x.creation_date);
        });

        return data;
    },
    fetchReportsForEmployee: async function(employeeId) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_reports_for_employee(?);`;

        const [rows] =  await db.query(sql, [employeeId]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
        });

        return data;
    },
};

module.exports = dbUtil;
