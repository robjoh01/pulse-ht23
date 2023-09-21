const AppError = require("./appError.js");

class UserNotFoundError extends AppError {
    constructor(next, redirect = "/") {
        super(
            404,
            "User Not Found",
            "The user does not exist in the database. Please double-check your username and your password. Or register as a new user.",
            redirect
        );
        next(this);
    }
}

module.exports = UserNotFoundError;
