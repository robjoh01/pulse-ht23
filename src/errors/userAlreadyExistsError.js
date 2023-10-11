const AppError = require("./appError.js");

class UserAlreadyExistsError extends AppError {
    constructor (next, redirect = "/") {
        super(
            409,
            "User Already Exists",
            "The provided username is already in use. Please choose a different username or proceed with login using the correct credentials.",
            redirect
        );
        next(this);
    }
}

module.exports = UserAlreadyExistsError;
