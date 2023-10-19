"use strict";

const BaseEmail = require("./baseEmail.js");

/**
 * Class representing a welcome email for new users.
 * @memberof emails
 * @extends BaseEmail
 */
class WelcomeEmail extends BaseEmail {
    /**
     * Create an instance of WelcomeEmail.
     * @constructor
     */
    constructor () {
        const data = {};

        super("Welcome to Pulse", "welcome.ejs", data);
    }
}

module.exports = WelcomeEmail;
