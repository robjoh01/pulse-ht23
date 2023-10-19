const AppError = require("./appError.js");

/**
 * Class representing a user not found error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class UserNotFoundError extends AppError {
    /**
     * Create an instance of UserNotFoundError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            404,
            "User Not Found",
            "The user does not exist in the database. Please double-check your username and your password. Or register as a new user.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = UserNotFoundError;
