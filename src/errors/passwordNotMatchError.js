const AppError = require("./appError.js");

/**
 * Class representing a password mismatch error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class PasswordNotMatchError extends AppError {
    /**
     * Create an instance of PasswordNotMatchError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            400,
            "Passwords Don't Match",
            "The passwords entered do not match. Please ensure both passwords match to proceed.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = PasswordNotMatchError;
