"use strict";

const BaseEmail = require("./baseEmail.js");

/**
 * Class representing an email for notifying user account status (deactivation or reactivation).
 * @memberof emails
 * @extends BaseEmail
 */
class StatusEmail extends BaseEmail {
    /**
     * Create an instance of StatusEmail.
     * @constructor
     * @param {boolean} wasDeactivated - Indicates whether the account was deactivated.
     * @param {string} name - The user's name.
     */
    constructor (wasDeactivated, name) {
        const data = {};

        data.wasDeactivated = wasDeactivated;
        data.name = name;

        super(wasDeactivated ? "Your account was deactivated" : "Your account was reinstated", "status.ejs", data);
    }
}

module.exports = StatusEmail;
