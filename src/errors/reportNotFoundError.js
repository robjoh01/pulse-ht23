const AppError = require("./appError.js");

/**
 * Class representing a report not found error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class ReportNotFoundError extends AppError {
    /**
     * Create an instance of ReportNotFoundError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            404,
            "Report Not Found",
            "The report does not exist in the database.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = ReportNotFoundError;
