const AppError = require("./appError.js");

/**
 * Class representing a project already exists error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class ProjectAlreadyExistsError extends AppError {
    /**
     * Create an instance of ProjectAlreadyExistsError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            409,
            "Project Already Exists",
            "The provided name is already in use. Please choose a different name.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = ProjectAlreadyExistsError;
