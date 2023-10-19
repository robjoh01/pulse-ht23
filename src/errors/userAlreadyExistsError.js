const AppError = require("./appError.js");

/**
 * Class representing a user already exists error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class UserAlreadyExistsError extends AppError {
    /**
     * Create an instance of UserAlreadyExistsError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            409,
            "User Already Exists",
            "The provided username is already in use. Please choose a different username or proceed with login using the correct credentials.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = UserAlreadyExistsError;
