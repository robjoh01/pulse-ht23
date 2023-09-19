const AppError = require("./appError.js");

class PasswordNotMatchError extends AppError {
    constructor(next, redirect = "/") {
        super(
            400,
            "Passwords Don't Match",
            "The passwords entered do not match. Please ensure both passwords match to proceed.",
            redirect
        );
        next(this);
    }
}

module.exports = PasswordNotMatchError;
