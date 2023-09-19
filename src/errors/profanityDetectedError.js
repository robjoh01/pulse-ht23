const AppError = require("./appError.js");

class ProfanityDetectedError extends AppError {
    constructor(next, redirect = "/") {
        super(
            400,
            "Profanity in Username or Password",
            "The username or password contains inappropriate language. Please use respectful and clean language.",
            redirect
        );
        next(this);
    }
}

module.exports = ProfanityDetectedError;
