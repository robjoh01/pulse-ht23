"use strict";

const BaseEmail = require('./baseEmail.js');

const { getBaseURL } = require('../utils/appUtil.js');

class PasswordEmail extends BaseEmail {
    constructor(req, userId, password, userDisplayName) {
        let data = {};

        data.name = userDisplayName;
        data.link = `${getBaseURL(req)}/user/change_password/${userId}/${password}`;

        super("Password Change Confirmation", "password.ejs", data);
    }
}

module.exports = PasswordEmail;
