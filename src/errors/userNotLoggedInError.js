const AppError = require("./appError.js");

/**
 * Class representing a user not logged in error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class UserNotLoggedInError extends AppError {
    /**
     * Create an instance of UserNotLoggedInError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            401,
            "User Not Logged In",
            "You are not logged in and cannot perform this action. Please log in to continue.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = UserNotLoggedInError;
