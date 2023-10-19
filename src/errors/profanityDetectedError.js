const AppError = require("./appError.js");

/**
 * Class representing a profanity detected error, extending AppError.
 * @memberof errors
 * @extends AppError
 */
class ProfanityDetectedError extends AppError {
    /**
     * Create an instance of ProfanityDetectedError.
     * @constructor
     * @param {Function} next - The next middleware function.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (next, redirect = "/") {
        super(
            400,
            "Profanity Detected",
            "The input contains inappropriate language. Please use respectful and clean language.",
            redirect
        );

        // Execute the next middleware function with this error
        next(this);
    }
}

module.exports = ProfanityDetectedError;
