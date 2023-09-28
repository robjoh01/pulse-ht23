"use strict";

const mysql = require("promise-mysql");
const config = require("./../../config/db/pulse.json");

// const appUtil = require("./appUtil.js");
const hashUtil = require("./hashUtil.js");

let dbUtil = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },

    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesProjectExists: async function(name, id = "") {
        const db = await this.connectDatabase();

        let sql = `SELECT does_project_exist(?, ?);`;
        let res = await db.query(sql, [name, id]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
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

        return res[0][Object.keys(res[0])[0]];
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

        return {...res[0][0]};
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

        return {...res[0][0]};
    },
    fetchProjects: async function() {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_projects();`;

        const [rows] = await db.query(sql);

        db.end();

        return JSON.parse(JSON.stringify(rows));
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
    fetchAssignmentsWithFilter: async function(projectId = null, employeeId = null) {
        const db = await this.connectDatabase();
        const sql = `CALL fetch_assignments_filter(?, ?);`;

        const [rows] =  await db.query(sql, [projectId, employeeId]);

        db.end();

        return JSON.parse(JSON.stringify(rows));
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
