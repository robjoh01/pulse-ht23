"use strict";

const BaseEmail = require("./baseEmail.js");

const { getBaseURL } = require("../utils/appUtil.js");

/**
 * Class representing an email for user registration confirmation.
 * @memberof emails
 * @extends BaseEmail
 */
class RegistrationEmail extends BaseEmail {
    /**
     * Create an instance of RegistrationEmail.
     * @constructor
     * @param {object} req - The Express request object.
     * @param {string} name - The user's name.
     * @param {string} username - The user's chosen username.
     * @param {string} password - The user's chosen password.
     */
    constructor (req, name, username, password) {
        const data = {};

        data.name = name;
        data.username = username;
        data.password = password;
        data.link = `${getBaseURL(req)}/user/change_password`;

        super("Welcome to Pulse", "registration.ejs", data);
    }
}

module.exports = RegistrationEmail;
