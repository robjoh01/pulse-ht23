const AppError = require("./appError.js");

/**
 * Class representing an unknown error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class UnknownError extends AppError {
    /**
     * Create an instance of UnknownError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            404,
            "Unknown Error",
            "You got an error for unknown reason. Please, try again later on.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = UnknownError;
