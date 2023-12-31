"use strict";

// Import dependencies
const express = require("express");
const flash = require("connect-flash");

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");
const errors = require("./../src/errors/errors.js");
const emails = require("./../src/emails/emails.js");

// Make instances
const router = express.Router();

router.get("/error", (req, res) => {
    let data = {};

    data.title = "Error";
    data.session = req.session;
    data.context = req.session.error;

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

        data.totalCount = data.assignments.length + data.reports.length;
        data.submittedCount = data.reports.length;
        data.upcomingCount = data.assignments.length;

        data.progress = (data.totalCount > 0) ? ((1 - (data.assignments.length / data.totalCount)) * 100) : 0;

        res.render("./../pages/dashboard_employee.ejs", data);
    } else {
        data.projects = (req.query?.q1) ? await dbUtil.fetchProjectsWithFilter(req.query.q1) : await dbUtil.fetchProjects();
        data.reports =  (req.query?.q2) ? await dbUtil.fetchReportsWithFilter(req.query.q2) : await dbUtil.fetchReports();

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
