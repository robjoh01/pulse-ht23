"use strict";

// Status code = https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

const PasswordNotMatchError = require("./passwordNotMatchError.js");
const BadCredentialsError = require("./badCredentialsError.js");
const UserNotFoundError = require("./userNotFoundError.js");
const UserNotLoggedInError = require("./userNotLoggedInError.js");
const UserAlreadyExistsError = require("./userAlreadyExistsError.js");
const ProfanityDetectedError = require("./profanityDetectedError.js");
const ProjectAlreadyExistsError = require("./projectAlreadyExistsError.js");
const AccessNotPermittedError = require("./accessNotPermittedError.js");
const ProjectNotFoundError = require("./projectNotFoundError.js");
const UnkownError = require("./unkownError.js");

module.exports = { 
    PasswordNotMatchError,
    BadCredentialsError,
    UserNotFoundError,
    UserNotLoggedInError,
    UserAlreadyExistsError,
    ProfanityDetectedError,
    ProjectAlreadyExistsError,
    AccessNotPermittedError,
    ProjectNotFoundError,
    UnkownError,
};
