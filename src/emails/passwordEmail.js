"use strict";

const BaseEmail = require("./baseEmail.js");

const { getBaseURL } = require("../utils/appUtil.js");

/**
 * Class representing an email for password change confirmation.
 * @memberof emails
 * @extends BaseEmail
 */
class PasswordEmail extends BaseEmail {
    /**
     * Create an instance of PasswordEmail.
     * @constructor
     * @param {object} req - The Express request object.
     * @param {string} userId - The user's unique identifier.
     * @param {string} password - The user's password.
     * @param {string} userDisplayName - The user's display name.
     */
    constructor (req, userId, password, userDisplayName) {
        const data = {};

        data.name = userDisplayName;
        data.link = `${getBaseURL(req)}/user/change_password/${userId}/${password}`;

        super("Password Change Confirmation", "password.ejs", data);
    }
}

module.exports = PasswordEmail;
