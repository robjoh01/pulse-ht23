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

router.get("/calendar", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Calendar";
    data.pageName  = "calendar";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/calendar.ejs", data);
});

router.get("/dashboard", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const user = appUtil.getSessionUser(req);

    let data = {};

    data.title = "Dashboard";
    data.pageName  = "dashboard";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(user.id);

    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = process.env.PORT || PORT;

    data.baseUrl = `${protocol}://${host}:${port}`;
    data.fullUrl = `${protocol}://${host}:${port}${url}`;

    if (appUtil.isUserAnEmployee(req)) {
        data.assignments = await dbUtil.fetchAssignmentsForEmployee(user.id);
        data.reports = await dbUtil.fetchReportsForEmployee(user.id);

        const totalCount = data.assignments.length + data.reports.length;
        data.progress = (totalCount > 0) ? ((1 - (data.assignments.length / totalCount)) * 100) : 0;

        res.render("./../pages/dashboard_employee.ejs", data);
    } else {
        data.projects = (req.query?.q) ? await dbUtil.fetchProjectsWithFilter(req.query.q) : await dbUtil.fetchProjects();
        data.reports = await dbUtil.fetchReports();

        res.render("./../pages/dashboard_manager.ejs", data);
    }
});

router.get("/help", async (req, res, next) => {
    let data = {};

    data.title = "Help";
    data.pageName  = "help";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(user.id);

    data.gmail = process.env.GMAIL_URL;
    data.github = process.env.GITHUB_URL;
    data.phone = process.env.PHONE_URL;

    res.render("./../pages/contact.ejs", data);
});

module.exports = router;
