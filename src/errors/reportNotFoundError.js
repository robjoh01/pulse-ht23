const AppError = require("./appError.js");

class ReportNotFoundError extends AppError {
    constructor (next, redirect = "/") {
        super(
            404,
            "Report Not Found",
            "The report does not exist in the database.",
            redirect
        );
        next(this);
    }
}

module.exports = ReportNotFoundError;
