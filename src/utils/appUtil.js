"use strict";

/**
 * Utility functions related to the application.
 * @namespace appUtil
 */
const appUtil = {
    /**
     * Get the base URL from the request.
     * @function
     * @param {Object} req - The request Object.
     * @return {string} The base URL.
     * @memberof appUtil
     */
    getBaseURL: function (req) {
        const protocol = req.protocol;
        const host = req.hostname;
        const port = process.env.PORT;

        return `${protocol}://${host}:${port}`;
    },

    /**
     * Gets the full URL including protocol, host, port, and the original URL.
     * @function
     * @param {Object} req - The request Object.
     * @return {string} The full URL.
     * @memberof appUtil
     */
    getFullURL: function (req) {
        const protocol = req.protocol;
        const host = req.hostname;
        const url = req.originalUrl;
        const port = process.env.PORT;

        return `${protocol}://${host}:${port}${url}`;
    },

    /**
     * Retrieves the session Object from the request.
     * @function
     * @param {Object} req - The request Object.
     * @return {Object} The session Object.
     * @memberof appUtil
     */
    getSession: function (req) {
        return req.session;
    },

    /**
     * Retrieves the user Object from the session.
     * @function
     * @param {Object} req - The request Object.
     * @return {Object} The user Object from the session.
     * @memberof appUtil
     */
    getSessionUser: function (req) {
        return req.session.user;
    },

    /**
     * Checks if the user is an employee.
     * @function
     * @param {Object} req - The request Object.
     * @return {boolean} A value indicating if the user is an employee.
     * @memberof appUtil
     */
    isUserAnEmployee: function (req) {
        return req.session.user.isEmployee;
    },

    /**
     * Checks if the user is authenticated (logged in).
     * @function
     * @param {Object} req - The request Object.
     * @return {boolean} A value indicating if the user is authenticated.
     * @memberof appUtil
     */
    isUserAuthenticated: function (req) {
        return req.session.authenticated;
    },

    /**
     * Checks if the user is authenticated.
     * If not, redirects to the login page.
     * @function
     * @param {Object} req - The request Object.
     * @param {Object} res - The response Object.
     * @return {boolean} A value either true or false.
     * @memberof appUtil
     */
    hasUserLoggedIn: function (req, res) {
        if (!this.isUserAuthenticated(req)) {
            res.redirect("/user/login");
            return false;
        }

        return true;
    },

    /**
     * Authenticates a user and sets up a global access to the user by storing user information in the session (server-side).
     * @function
     * @param {Object} req - The request Object.
     * @param {string} id - The user ID.
     * @param {boolean} isEmployee - Indicates if the user is an employee.
     * @memberof appUtil
     */
    authenticateUser: function (req, id, isEmployee) {
        req.session.authenticated = true;

        req.session.user = {
            id,
            isEmployee
        };
    },

    /**
     * Invalidate a user's session and log them out.
     * @function
     * @param {Object} req - The request Object.
     * @memberof appUtil
     */
    invalidateUser: function (req) {
        req.session.authenticated = false;
        req.session.user = { };
    }
};

module.exports = appUtil;
