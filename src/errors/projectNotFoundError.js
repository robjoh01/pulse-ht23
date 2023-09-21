const AppError = require("./appError.js");

class ProjectNotFoundError extends AppError {
    constructor(next, redirect = "/") {
        super(
            404,
            "Project Not Found",
            "The project does not exist in the database.",
            redirect
        );
        next(this);
    }
}

module.exports = ProjectNotFoundError;
