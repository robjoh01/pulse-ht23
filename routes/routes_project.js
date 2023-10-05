"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");
const profanityUtil = require("./../src/utils/profanityUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");
const hashUtil = require('../src/utils/hashUtil.js');

// Make instances
const router = express.Router();

router.get("/project/create", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Create a new project";
    data.pageName  = "project";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/project_create.ejs", data);
});

router.post("/project/create/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_name, f_description, f_start_date, f_end_date, f_report_freq, f_report_deadline } = req.body;

    if (!f_name) {
        new errors.BadCredentialsError(next, "/project/create");
        return;
    }

    if (profanityUtil.exists(f_name)) {
        new errors.ProfanityDetectedError(next, "/project/create");
        return;
    }

    let doesProjectExists = await dbUtil.doesProjectExists(f_name);

    if (doesProjectExists) {
        new errors.ProjectAlreadyExistsError(next, "/project/create");
        return;
    }

    const user = appUtil.getSessionUser(req);

    const projectId = hashUtil.generateGuid();

    let reportFreq = f_report_freq;
    let reportDeadline = null;

    if (f_report_deadline) {
        reportFreq = null;
        reportDeadline = f_report_deadline;
    }

    const wasSuccessful = await dbUtil.createProject(
        projectId,
        user.id,
        f_name,
        f_description,
        f_start_date,
        f_end_date,
        reportFreq,
        reportDeadline
    );

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/project/create");
        return;
    }

    res.redirect("/dashboard");
});

router.get("/project/update/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const projectId = req.params.id;
    const project = await dbUtil.fetchProject(projectId);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/dashboard");
        return;
    }

    const user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    if (user.role === "Employee") {
        new errors.AccessNotPermittedError(next, "/dashboard");
        return;
    }

    let data = {};

    data.title = `Update ${project.name}`;
    data.pageName  = "project";
    data.session = appUtil.getSession(req);
    data.user = user;
    data.project_id = projectId;
    data.project = project;

    res.render("./../pages/project_update.ejs", data);
});

router.post("/project/update/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_id, f_name, f_description, f_due_date } = req.body;

    if (!f_name) {
        new errors.BadCredentialsError(next, `/project/update/${f_id}`);
        return;
    }

    const project = await dbUtil.fetchProject(f_id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/dashboard");
        return;
    }

    const wasSuccessful = await dbUtil.updateProject(
        f_id,
        f_name,
        f_description,
        f_due_date
    );

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/project/update");
        return;
    }

    res.redirect(`/project/update/${f_id}`);
});

router.get("/project/archive/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;

    let data = {};

    const project = await dbUtil.fetchProject(id);

    data.title = `Archive ${project.name}`;
    data.pageName = "project";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.project_id = id;
    data.project = project;

    res.render("./../pages/project_archive.ejs", data);
});

router.post("/project/archive/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_id } = req.body;

    const project = await dbUtil.fetchProject(f_id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/dashboard");
        return;
    }

    const wasSuccessful = await dbUtil.archiveProject(f_id);

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/project/archive");
        return;
    }

    res.redirect("/dashboard");
});

router.get("/project/view/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;
    const project = await dbUtil.fetchProject(id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/dashboard");
        return;
    }

    const user = appUtil.getSessionUser(req);
    const assignment = await dbUtil.fetchAssignmentsForEmployee(user.id);

    if (!assignment) {
        new errors.AccessNotPermittedError(next, "/dashboard");
        return;
    }

    let data = {};

    data.title = `Viewing ${project.name}`;
    data.pageName = "project";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(user.id);
    data.project = project;
    data.assignment = assignment;

    res.render("./../pages/project_view.ejs", data);
});

router.get("/project/assign/", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Assign team members";
    data.pageName  = "project";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.projects = await dbUtil.fetchProjects();

    res.render("./../pages/project_assign.ejs", data);
});

module.exports = router;
