"use strict";

const BaseEmail = require("./baseEmail.js");

class StatusEmail extends BaseEmail {
    constructor (wasDeactivated, name) {
        const data = {};

        data.wasDeactivated = wasDeactivated;
        data.name = name;

        super(wasDeactivated ? "Your account was deactivated" : "Your account was reinstated", "status.ejs", data);
    }
}

module.exports = StatusEmail;
