"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");

// Make instances
const router = express.Router();

router.get("/employee/report/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const user = appUtil.getSessionUser(req);

    if (!appUtil.isUserAnEmployee(req)) {
        new errors.AccessNotPermittedError(next, "/dashboard");
        return;
    }

    const projectId = req.params.id;
    const project = await dbUtil.fetchProject(projectId);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/dashboard");
        return;
    }

    let data = {};

    data.title = `Reporting on ${project.name}`;
    data.pageName  = "dashboard";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(user.id);
    data.project_id = projectId;
    data.project = project;
    data.categories = await dbUtil.fetchCategories();

    res.render("./../pages/report_employee.ejs", data);
});

router.post("/employee/report/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_id, f_text, f_status_id, f_category_id } = req.body;

    if (!f_text) {
        new errors.BadCredentialsError(next, `/employee/report/${f_id}`);
        return;
    }

    const user = appUtil.getSessionUser(req);

    const wasSuccessful = await dbUtil.createReport(user.id, f_id, f_text, dbUtil.statuses.pending, f_category_id);

    if (!wasSuccessful) {
        new errors.UnkownError(next, `/employee/report/${f_id}`);
        return;
    }

    res.redirect("/dashboard");
});

router.get("/manager/report/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const user = appUtil.getSessionUser(req);

    if (appUtil.isUserAnEmployee(req)) {
        new errors.AccessNotPermittedError(next, "/dashboard");
        return;
    }

    const reportId = req.params.id;
    const report = await dbUtil.fetchReport(reportId);

    if (!report) {
        new errors.ReportNotFoundError(next, "/dashboard");
        return;
    }

    let data = {};

    data.title = `Viewing report`;
    data.pageName  = "dashboard";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(user.id);
    data.report_id = reportId;
    data.report = report;

    res.render("./../pages/report_manager.ejs", data);
});

router.post("/manager/report/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_id, f_comment, f_read } = req.body;

    if (!f_id) {
        new errors.ReportNotFoundError(next, "/dashboard");
        return;
    }

    if (!f_comment) {
        new errors.BadCredentialsError(next, `/manager/report/${f_id}`);
        return;
    }

    let statusId = dbUtil.statuses.submitted;

    if (f_read === "on") {
        statusId = dbUtil.statuses.read;
    }

    const user = appUtil.getSessionUser(req);

    const wasSuccessful = await dbUtil.reviewReport(user.id, f_id, f_comment, statusId);

    if (!wasSuccessful) {
        new errors.UnkownError(next, `/manager/report/${f_id}`);
        return;
    }

    res.redirect("/dashboard");
});

router.get("/manager/report/history/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const user = appUtil.getSessionUser(req);

    const reportId = req.params.id;
    const report = await dbUtil.fetchReport(reportId);

    if (!report) {
        new errors.ReportNotFoundError(next, "/dashboard");
        return;
    }

    const history = await dbUtil.fetchReportHistory(reportId);

    let data = {};

    data.title = `Viewing comment history of ${report.project_name}`;
    data.pageName  = "dashboard";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(user.id);
    data.report_id = reportId;
    data.report = report;
    data.history = history;

    res.render("./../pages/report_history.ejs", data);
});

module.exports = router;
