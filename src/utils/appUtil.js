// Written by Robin Johannesson

"use strict";

let appUtil = {
    /**
    * Checks if the user is logged in.
    * @return {Boolean} A value either {true} or {false}.
    */
    isUserLoggedIn: function(req) {
        return req.session.authenticated;
    },
    /**
    * Checks if the user is logged in. If not, sign in page will be redirected. Otherwise, continue back on the page.
    * @return {Boolean} A value either {true} or {false}.
    */
    hasUserLoggedIn: function(req, res) {
        if (!req.session.authenticated) {
            res.redirect("/login");
            return false;
        }

        return true;
    },
    /**
    * Checks if the user is logged in. If not, sign in page will be redirected. Otherwise, continue back on the page.
    * @return {String} A {string} value of the user's name.
    */
    getUsername: function(req) {
        return req.session.user.username;
    },
};

module.exports = appUtil;
