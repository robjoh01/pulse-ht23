/**
 * Class representing a custom application error.
 * @memberof errors
 * @extends Error
 */
class AppError extends Error {
    /**
     * Create an instance of AppError.
     * @constructor
     * @param {number} code - The error code.
     * @param {string} title - The title or name of the error.
     * @param {string} message - The error message.
     * @param {string} [redirect="/"] - The redirect URL.
     */
    constructor (code, title, message, redirect = "/") {
        super(message);

        this.name = this.constructor.name;
        this.type = "redirect";

        this.code = code;
        this.title = title;
        this.msg = message;
        this.redirect = redirect;
    }
}

module.exports = AppError;
