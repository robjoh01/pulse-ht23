"use strict";

const {v4: uuidv4 } = require("uuid");

const bcrypt = require('bcrypt');

const dotenv = require("dotenv");
dotenv.config();

let hashUtil = {
    hash: async function(password) {
        return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    },
    compare: async function(password, hash) {
        return await bcrypt.compare(password, hash);
    },
    generateGuid: function() {
        return uuidv4();
    }
};

module.exports = hashUtil;
