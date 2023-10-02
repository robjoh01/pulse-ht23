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

        let sql = `SELECT does_project_exist(?, ?);`;
        let res = await db.query(sql, [name, id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },
    createProject: async function(id, name, description = null, dueDate = null) {
        const db = await this.connectDatabase();
        const query = `CALL create_project(?, ?, ?, ?, @success); SELECT @success as success;`;

        if (!dueDate) {
            dueDate = null;
        }

        let res = await db.query(query, [id, name, description, dueDate]);

        db.end();

        return Boolean(res[1][0].success);
    },
    updateProject: async function(id, name = null, description = null, dueDate = null) {
        const db = await this.connectDatabase();
        const query = `CALL update_project(?, ?, ?, ?, @success); SELECT @success as success;`;

        if (!dueDate) {
            dueDate = null;
        }

        let res = await db.query(query, [id, name, description, dueDate]);

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
    assignToProject: async function(projectId, employeeId, reportFreq, reportDate) {
        const db = await this.connectDatabase();
        const query = `CALL assign_to_project(?, ?, ?, ?, @success); SELECT @success as success;`;

        let res = await db.query(query, [projectId, employeeId, reportFreq, reportDate]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesUserExists: async function(username = null, id = null) {
        const db = await this.connectDatabase();

        if (!username && !id) {
            return false;
        }

        let sql = `SELECT does_user_exist(?, ?);`;
        let res = await db.query(sql, [username, id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },
    doesUserHavePermission: async function(id, password) {
        const db = await this.connectDatabase();

        let sql = `SELECT get_user_password(?);`;
        let res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        if (!hashedPassword) {
            return false;
        }

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

        let sql = `CALL update_user(?, ?, ?, ?, ?, ?, @success); SELECT @success as success;`;
        let res = await db.query(sql, [id, newPassword, newDisplayName, newEmailAddress, newPhoneNumber, newImageURL]);

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

        if (!id) {
            return false;
        }

        sql = `SELECT get_user_password(?);`;
        res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]]; // Get user's password

        if (!hashedPassword) {
            return false;
        }

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
    },

    fetchEmployee: async function(id) {
        const db = await this.connectDatabase();

        let sql = `CALL fetch_employee(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        return {...res[0][0]};
    },
    fetchEmployees: async function() {
        const db = await this.connectDatabase();
        const  sql = `CALL fetch_employees();`;

        const [rows] = await db.query(sql);

        db.end();

        return JSON.parse(JSON.stringify(rows));
    },
    fetchProjectManager: async function(id) {
        const db = await this.connectDatabase();

        let sql = `CALL fetch_project_manager(?);`;

        let res = await db.query(sql, [id]);

        db.end();

        return {...res[0][0]};
    },
    fetchProjectManagers: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_project_managers();`;

        const [rows] = await db.query(sql);

        db.end();

        return JSON.parse(JSON.stringify(rows));
    },
    fetchUser: async function(id) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_user(?);`;

        const res = await db.query(sql, [id]);

        db.end();

        const data = {...res[0][0]};

        if (!data.image_url) {
            data.image_url = "https://demos.themeselection.com/materio-mui-react-nextjs-admin-template-free/images/avatars/1.png"; // Default image
        }

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

        return JSON.parse(JSON.stringify(rows));
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

        return {...res[0][0]};
    },
    fetchAssignments: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_assignments();`;

        const [rows] = await db.query(sql);

        db.end();

        return JSON.parse(JSON.stringify(rows));
    },
    fetchAssignmentsForEmployee: async function(employeeId = null) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_assignments_for_employee(?);`;

        const [rows] =  await db.query(sql, [employeeId]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.project_start_date = dateUtil.parseDate(x.project_start_date);
            x.project_end_date = dateUtil.parseDate(x.project_end_date);
            x.report_custom_submission_date = dateUtil.parseDate(x.report_custom_submission_date);
        });

        return data;
    },
    fetchReport: async function(projectId, employeeId) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_report(?, ?);`;

        let res = await db.query(sql, [projectId, employeeId]);

        db.end();

        return {...res[0][0]};
    },
    fetchReports: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_reports();`;

        const [rows] = await db.query(sql);

        db.end();

        return JSON.parse(JSON.stringify(rows));
    },
};

module.exports = dbUtil;
