// Written by Robin Johannesson

"use strict";

const mysql = require("promise-mysql");
const config = require("./../../config/db/pulse.json");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Hash exponent

let dbUtil = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },
    createUser: async function(username, password, displayName = "", email = "", phoneNumber = "") {
        try {
            const db = await this.connectDatabase();

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = 'SELECT create_user(?, ?);';
            let res = await db.query(query, [username, hashedPassword]);

            db.end();

            return res[0][Object.keys(res[0])[0]] === 1;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    },
    loginUser: async function(username, password) {
        const db = await this.connectDatabase();

        let sql = `SELECT fetch_password(?);`;
        let res = await db.query(sql, [username]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        if (!hashedPassword) {
            return false;
        }

        return await bcrypt.compare(password, hashedPassword);
    },
    fetchUserID: async function(username) {
        const db = await this.connectDatabase();

        let sql = `SELECT fetch_employee_id(?);`;
        let res = await db.query(sql, [username]);

        db.end();

        return res[0][Object.keys(res[0])[0]];
    },
    getUserData: async function(keyword) {
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

        let res = await db.query(sql, [keyword, keyword]);

        db.end();

        return JSON.parse(JSON.stringify(res[0]));
    },
    deleteUser: async function(username, password) {
        const db = await this.connectDatabase();

        // TODO: Throw instead of returning false?

        let sql = `SELECT fetch_password(?);`;
        let res = await db.query(sql, [username]);

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        if (!hashedPassword) {
            return false;
        }

        let isValid = await bcrypt.compare(password, hashedPassword);

        if (!isValid) {
            return false;
        }

        sql = `SELECT delete_user(?, ?);`;
        res = await db.query(sql, [username, hashedPassword]);

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
    /**
    * Checks if the user exists in the database.
    * @return {Boolean} A value either {true} or {false}.
    */
    doesUserExists: async function() {

    },
};

module.exports = dbUtil;
