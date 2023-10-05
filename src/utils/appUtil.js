"use strict";

// Import errors
const errors = require("./../errors/errors.js");

let appUtil = {
    getBaseURL: function(req) {
        const protocol = req.protocol;
        const host = req.hostname;
        const url = req.originalUrl;
        const port = process.env.PORT || PORT;

        return `${protocol}://${host}:${port}`;
    },
    getFullURL: function(req) {
        const protocol = req.protocol;
        const host = req.hostname;
        const url = req.originalUrl;
        const port = process.env.PORT || PORT;

        return `${protocol}://${host}:${port}${url}`;
    },
    getSession: function(req) {
        return req.session;
    },
    getSessionUser: function(req) {
        return req.session.user;
    },
    isUserAnEmployee: function(req) {
        return req.session.user.isEmployee;
    },
    /**
    * Checks if the user is logged in. If not, sign in page will be redirected. Otherwise, continue back on the page.
    * @return {Boolean} A value either {true} or {false}.
    */
    isUserAuthenticated: function(req) {
        return req.session.authenticated;
    },
    /**
    * Checks if the user is logged in. If not, sign in page will be redirected. Otherwise, continue back on the page.
    * @return {Boolean} A value either {true} or {false}.
    */
    hasUserLoggedIn: function(req, res) {
        if (!this.isUserAuthenticated(req)) {
            res.redirect("/user/login");
            return false;
        }

        return true;
    },
    /**
    * Authenticate and set up a global access to the user. Stores inside a cookie session (server-side).
    * @return {void}
    */
    authenticateUser: function(req, id, isEmployee) {
        req.session.authenticated = true;

        req.session.user = {
            id,
            isEmployee
        };
    },
    /**
    * Invalidate a user. Removes the privileges from authentication.
    * @return {void}
    */
    invalidateUser: function(req) {
        req.session.authenticated = false;
        req.session.user = { };
    }
};

module.exports = appUtil;
