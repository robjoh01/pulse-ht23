const AppError = require("./appError.js");

/**
 * Class representing a project not found error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class ProjectNotFoundError extends AppError {
    /**
     * Create an instance of ProjectNotFoundError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            404,
            "Project Not Found",
            "The project does not exist in the database.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = ProjectNotFoundError;
