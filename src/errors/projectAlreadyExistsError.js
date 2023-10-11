const AppError = require("./appError.js");

class ProjectAlreadyExistsError extends AppError {
    constructor (next, redirect = "/") {
        super(
            409,
            "Project Already Exists",
            "The provided name is already in use. Please choose a different name.",
            redirect
        );
        next(this);
    }
}

module.exports = ProjectAlreadyExistsError;
