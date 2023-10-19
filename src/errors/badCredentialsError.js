const AppError = require("./appError.js");

/**
 * Class representing a bad credentials error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class BadCredentialsError extends AppError {
    /**
     * Create an instance of BadCredentialsError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            401,
            "Bad Credentials",
            "Invalid input. Please ensure you've entered the correct credentials and try again.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = BadCredentialsError;
