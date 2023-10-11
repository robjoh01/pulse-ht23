"use strict";

const BaseEmail = require("./baseEmail.js");

class WelcomeEmail extends BaseEmail {
    constructor () {
        const data = {};

        super("Welcome to Pulse", "welcome.ejs", data);
    }
}

module.exports = WelcomeEmail;
