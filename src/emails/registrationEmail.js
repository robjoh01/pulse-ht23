"use strict";

const BaseEmail = require("./baseEmail.js");

const { getBaseURL } = require("../utils/appUtil.js");

/** Docs */
class RegistrationEmail extends BaseEmail {
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
