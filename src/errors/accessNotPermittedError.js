const AppError = require("./appError.js");

class AccessNotPermittedError extends AppError {
    constructor(next, redirect = "/") {
        super(
            401,
            "Access Not Permitted",
            "You do not have permission to access this resource. Please contact the administrator if you believe this is in error.",
            redirect
        );
        next(this);
    }
}

module.exports = AccessNotPermittedError;
