const AppError = require("./appError.js");

class UnknownError extends AppError {
    constructor (next, redirect = "/") {
        super(
            404,
            "Unknown Error",
            "Lorem Ipsum",
            redirect
        );
        next(this);
    }
}

module.exports = UnknownError;
