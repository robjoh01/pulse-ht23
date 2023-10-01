"use strict";

// Import errors
const errors = require("./../errors/errors.js");

let appUtil = {
    getSession: function(req) {
        return req.session;
    },
    getSessionContext: function(req) {
        return req.session.context;
    },
    getSessionUser: function(req) {
        return req.session.user;
    },
    isUserAnEmployee: function(req) {
        return req.session.isEmployee;
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
    authenticateUser: function(req, id, username, password, isEmployee) {
        req.session.authenticated = true;
        req.session.isEmployee = isEmployee;

        req.session.user = {
            id,
            username,
            password
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
