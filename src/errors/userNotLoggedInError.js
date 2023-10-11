const AppError = require("./appError.js");

// Hello
class UserNotLoggedInError extends AppError {
    constructor (next, redirect = "/") {
        super(
            401,
            "User Not Logged In",
            "You are not logged in and cannot perform this action. Please log in to continue.",
            redirect
        );
        next(this);
    }
}

module.exports = UserNotLoggedInError;
