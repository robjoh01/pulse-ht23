"use strict";

const mysql = require("promise-mysql");
const config = require("./../../config/db/pulse.json");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Hash exponent

const appUtil = require("./appUtil.js");

let dbUtil = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },
    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesUserExists: async function(user) {
        const db = await this.connectDatabase();

        let sql = `SELECT does_user_exist(?, ?);`;
        let res = await db.query(sql, [user.username, user.id]);

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

        return await bcrypt.compare(user.password, hashedPassword);
    },
    createUser: async function(username, password, email) {
        const db = await this.connectDatabase();

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'SELECT create_user(?, ?, ?);';
        let res = await db.query(query, [username, hashedPassword, email]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    readUser: async function(user) {
        const db = await this.connectDatabase();

        let sql = `
            SELECT
                *
            FROM v_users
            WHERE
                username = ?
                OR employee_id = ?
            ;
        `;

        let res = await db.query(sql, [user.username, user.id]);

        db.end();

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
    getUsers: async function() {
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
        let res = await db.query(sql, [username, ""]);

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

        const isValid = await bcrypt.compare(password, hashedPassword); // Compare the hash and raw password

        if (!isValid) {
            return false;
        }

        return id;
    },
};

module.exports = dbUtil;
