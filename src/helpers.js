// Written by Robin Johannesson

"use strict";

const mysql = require("promise-mysql");
const config = require("./../config/db/pulse.json");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Hash exponent

let helpers = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },
    createUser: async function(username, password) {
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

        let sql = `SELECT get_hashed_password(?);`;
        let res = await db.query(sql, [username]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        if (!hashedPassword) {
            return false;
        }

        return await bcrypt.compare(password, hashedPassword);
    },
    deleteUser: async function(username, password) {
        const db = await this.connectDatabase();

        let sql = `SELECT get_hashed_password(?);`;
        let res = await db.query(sql, [username]);

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        if (!hashedPassword) {
            return false;
        }

        let isValid = await bcrypt.compare(password, hashedPassword);

        if (!isValid) return;

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
};

module.exports = helpers;
