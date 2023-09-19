const AppError = require("./appError.js");

class BadCredentialsError extends AppError {
    constructor(next, redirect = "/") {
        super(
            401,
            "Bad Credentials",
            "Invalid username or password. Please ensure you've entered the correct credentials and try again.",
            redirect
        );
        next(this);
    }
}

module.exports = BadCredentialsError;
