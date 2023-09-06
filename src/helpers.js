// Written by Robin Johannesson

"use strict";

const mysql = require("promise-mysql");
const config = require("../config/db/pulse.json");

let helpers = {
    connectDatabase: async function() {
        return await mysql.createConnection(config);
    },
};

module.exports = helpers;
