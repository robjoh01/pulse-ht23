class AppError extends Error {
    constructor(code, title, message, redirect = "/") {
        super(message);

        this.name = this.constructor.name;  // Use the class name for consistency
        this.type = "redirect";

        this.code = code;
        this.title = title;
        this.msg = message;
        this.redirect = redirect;
    }
}

module.exports = AppError;
