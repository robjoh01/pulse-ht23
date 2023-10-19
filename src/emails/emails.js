"use strict";

const BaseEmail = require("./baseEmail.js");
const WelcomeEmail = require("./welcomeEmail.js");
const RegistrationEmail = require("./registrationEmail.js");
const PasswordEmail = require("./passwordEmail.js");
const ReminderEmail = require("./reminderEmail.js");
const StatusEmail = require("./statusEmail.js");

/** @namespace */
module.exports = {
    BaseEmail,
    WelcomeEmail,
    RegistrationEmail,
    PasswordEmail,
    ReminderEmail,
    StatusEmail
};
