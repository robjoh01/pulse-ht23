"use strict";

const { v4: uuidv4 } = require("uuid");

const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
dotenv.config();

/**
 * Utility for handling password hashing and GUID generation.
 * @namespace
 */
const hashUtil = {
    /**
     * Hashes a password using bcrypt.
     * @function
     * @async
     * @param {string} password - The password to hash.
     * @returns {string} - The hashed password.
     */
    hash: async function (password) {
        return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    },

    /**
     * Compares a password with a hash using bcrypt.
     * @function
     * @async
     * @param {string} password - The password to compare.
     * @param {string} hash - The hash to compare against.
     * @returns {boolean} - Whether the password matches the hash.
     */
    compare: async function (password, hash) {
        return await bcrypt.compare(password, hash);
    },

    /**
     * Generates a GUID (Globally Unique Identifier).
     * @function
     * @returns {string} - The generated GUID.
     */
    generateGuid: function () {
        return uuidv4();
    }
};

module.exports = hashUtil;
