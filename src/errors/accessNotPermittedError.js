const AppError = require("./appError.js");

/**
 * Class representing an access not permitted error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class AccessNotPermittedError extends AppError {
    /**
     * Create an instance of AccessNotPermittedError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            401,
            "Access Not Permitted",
            "You do not have permission to access this resource. Please contact the administrator if you believe this is in error.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = AccessNotPermittedError;
