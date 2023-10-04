"use strict";

const BaseEmail = require('./baseEmail.js');

const { getBaseURL } = require('../utils/appUtil.js');

class RegistrationEmail extends BaseEmail {
    constructor(req, userDisplayName) {
        let data = {};

        data.name = userDisplayName;
        data.link = `${getBaseURL(req)}/user/change_password`;

        super("Welcome to Pulse", "registration.ejs", data);
    }
}

module.exports = RegistrationEmail;
