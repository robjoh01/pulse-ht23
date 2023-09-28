"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");
const conversionUtil = require("./../src/utils/conversionUtil.js");
const emailUtil = require("./../src/utils/emailUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");

// Make instances
const router = express.Router();

router.get("/error", (req, res) => {
    let data = {};

    data.title = "Error";
    data.session = appUtil.getSession(req);
    data.context = appUtil.getSessionContext(req);

    if (!data.context) {
        data.error_code = "404";
        data.error_title = "Page Not Found";
        data.error_message = "We couldn′t find the page, that you are looking for."
        data.error_redirect = "/";
    } else {
        const err = data.context;
        data.error_code = err.code;
        data.error_title = err.title;
        data.error_message = err.msg;
        data.error_redirect = err.redirect;
    }

    res.render("./../pages/error.ejs", data);
});

router.get("/", async (req, res, next) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    res.redirect("/dashboard");
});

router.get("/dashboard", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Dashboard";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    // [
    //   'employee_id',
    //   'username',
    //   'display_name',
    //   'email_address',
    //   'phone_number'
    // ]

    res.render("./../pages/dashboard.ejs", data);
});

router.get("/calendar", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Calendar";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/calendar.ejs", data);
});

router.get("/projects", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Projects";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/projects.ejs", data);
});

router.get("/reports", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Reports";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/reports.ejs", data);
});

router.get("/help", async (req, res, next) => {
    let data = {};

    data.title = "Help";
    data.session = appUtil.getSession(req);

    data.gmail = process.env.GMAIL_URL;
    data.github = process.env.GITHUB_URL;
    data.phone = process.env.PHONE_URL;

    res.render("./../pages/contact.ejs", data);
});

module.exports = router;
