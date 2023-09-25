"use strict";

const mysql = require("promise-mysql");
const config = require("./../../config/db/pulse.json");

const appUtil = require("./appUtil.js");
const hashUtil = require("./hashUtil.js");

let dbUtil = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },
    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesUserExists: async function(username, id = null) {
        const db = await this.connectDatabase();

        let sql = `SELECT does_user_exist(?, ?);`;
        let res = await db.query(sql, [username, id]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    doesUserHavePermission: async function(user) {
        const db = await this.connectDatabase();

        let sql = `SELECT fetch_password(?);`;
        let res = await db.query(sql, [user.id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        if (!hashedPassword) {
            return false;
        }

        return await hashUtil.compare(user.password, hashedPassword);
    },
    createUser: async function(id, username, password, email) {
        const db = await this.connectDatabase();

        const hashedPassword = await hashUtil.hash(password);

        const query = 'SELECT create_user(?, ?, ?, ?);';
        let res = await db.query(query, [id, username, hashedPassword, email]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    readUser: async function(id) {
        const db = await this.connectDatabase();

        let sql = `
            SELECT
                *
            FROM v_users
            WHERE
                employee_id = ?
            ;
        `;

        let res = await db.query(sql, id);

        db.end();

        if (res.length === 0) {
            return false;
        }

        return JSON.parse(JSON.stringify(res[0]));
    },
    updateUser: async function(user, display_name, email, phone_number, image_url) {
        let isValid = await this.doesUserHavePermission(user);

        if (!isValid) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT update_user(?, ?, ?, ?, ?);`;
        let res = await db.query(sql, [user.id, display_name, email, phone_number, image_url]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    updateUserPassword: async function(id, new_password) {
        const db = await this.connectDatabase();

        const hashedPassword = await hashUtil.hash(new_password);

        let sql = `CALL user_update_password(?, ?);`;
        let res = await db.query(sql, [id, hashedPassword]);

        db.end();
    },
    logoutUser: async function(id) {
        const db = await this.connectDatabase();

        let sql = `CALL user_logout(?);`;
        await db.query(sql, [id]);

        db.end();
    },
    deleteUser: async function(user) {
        let isValid = await this.doesUserHavePermission(user);

        if (!isValid) {
            return false;
        }

        const db = await this.connectDatabase();

        let sql = `SELECT delete_user(?);`;
        let res = await db.query(sql, [user.id]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    readUsers: async function() {
        const db = await this.connectDatabase();

        let sql = `
        SELECT
            *
        FROM v_users
        ;
        `;

        let res = await db.query(sql);

        db.end();

        return res;
    },
    loginUser: async function(username, password) {
        const db = await this.connectDatabase();

        let sql = `SELECT does_user_exist(?, ?);`;
        let res = await db.query(sql, [username, null]);

        const doesUserExist = res[0][Object.keys(res[0])[0]]; // Check if user is exists

        if (!doesUserExist) {
            return false;
        }

        sql = `SELECT fetch_employee_id(?);`;
        res = await db.query(sql, [username]);

        const id = res[0][Object.keys(res[0])[0]]; // Fetch the id

        if (!id) {
            return false;
        }

        sql = `SELECT fetch_password(?);`;
        res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]]; // Fetch the hash password

        if (!hashedPassword) {
            return false;
        }

        const isValid = await hashUtil.compare(password, hashedPassword); // Compare the hash and raw password

        if (!isValid) {
            return false;
        }

        return id;
    },
    createProject: async function(employeeId, name, description, dueDate) {
        const db = await this.connectDatabase();
        const query = 'SELECT create_project(?, ?, ?, ?);';

        if (!dueDate) {
            dueDate = null;
        }

        let res = await db.query(query, [employeeId, name, description, dueDate]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    readProject: async function(id) {
        const db = await this.connectDatabase();

        let sql = `
            SELECT
                *
            FROM v_projects
            WHERE
                id = ?
            ;
        `;

        let res = await db.query(sql, [id]);

        db.end();

        if (res.length === 0) {
            return false;
        }

        return JSON.parse(JSON.stringify(res[0]));
    },
    updateProject: async function(id, name, description, dueDate) {
        const db = await this.connectDatabase();
        const query = 'SELECT update_project(?, ?, ?, ?);';

        if (!dueDate) {
            dueDate = null;
        }

        let res = await db.query(query, [id, name, description, dueDate]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    deleteProject: async function(id) {
        const db = await this.connectDatabase();
        const query = 'SELECT delete_project(?);';

        let res = await db.query(query, [id]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    readProjects: async function() {
        const db = await this.connectDatabase();

        let sql = `
        SELECT
            *
        FROM v_projects
        ;
        `;

        let res = await db.query(sql);

        db.end();

        return res;
    },
    readProjects: async function(id) {
        const db = await this.connectDatabase();

        let sql = `
        SELECT
            *
        FROM v_projects
        ;
        `;

        let res = await db.query(sql);

        db.end();

        return res;
    },
    readAssignments: async function() {
        const db = await this.connectDatabase();

        let sql = `
        SELECT
            *
        FROM v_assignments
        ;
        `;

        let res = await db.query(sql);

        db.end();

        return res;
    },
    readAssignmentsForUser: async function(employeeId, accessType = "") {
        const db = await this.connectDatabase();

        let sql = `
            SELECT
                *
            FROM v_assignments_extend
            WHERE
                employee_id = ?
                OR access_type = ?
            ;
            `;

        if (accessType) {
            sql = `
            SELECT
                *
            FROM v_assignments_extend
            WHERE
                employee_id = ?
                AND access_type = ?
            ;
            `;
        }

        let res = await db.query(sql, [employeeId, accessType]);

        db.end();

        return JSON.parse(JSON.stringify(res));
    },
    readAssignmentForUser: async function(projectId, employeeId) {
        const db = await this.connectDatabase();

        let sql = `
            SELECT
                *
            FROM v_assignments
            WHERE
                project_id = ?
                AND employee_id = ?
            ;
            `;

        let res = await db.query(sql, [projectId, employeeId]);

        db.end();

        if (res.length === 0) {
            return false;
        }

        return JSON.parse(JSON.stringify(res[0]));
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
};

module.exports = dbUtil;
