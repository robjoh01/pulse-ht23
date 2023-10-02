"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");
const conversionUtil = require("../src/utils/conversionUtil.js");
const emailUtil = require("../src/utils/emailUtil.js");
const profanityUtil = require("./../src/utils/profanityUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");

// Make instances
const router = express.Router();

router.get("/projects", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    if (appUtil.isUserAnEmployee(req)) {
        new errors.AccessNotPermittedError(next, "/dashboard");
        return;
    }

    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = process.env.PORT || PORT;

    let data = {};

    data.title = "Projects";
    data.pageName  = "projects";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.baseUrl = `${protocol}://${host}:${port}`;
    data.fullUrl = `${protocol}://${host}:${port}${url}`;
    data.projects = (req.query?.q) ? await dbUtil.fetchProjectsWithFilter(req.query.q) : await dbUtil.fetchProjects();

    res.render("./../pages/projects.ejs", data);
});

router.get("/project/create", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Create a new project";
    data.pageName  = "projects";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/project_create.ejs", data);
});

router.post("/project/create/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_name, f_description, f_due_date } = req.body;

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

    let id = await dbUtil.createProject(user.id, f_name, f_description, f_due_date);

    if (!id) {
        // req.flash("error", "The account couldn't be created for an unknown reason. Please try again in a few seconds.");
        res.redirect("/project/create");
        return;
    }

    res.redirect("/projects");
});

router.get("/project/update/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const projectId = req.params.id;
    const project = await dbUtil.fetchProject(projectId);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/projects");
        return;
    }

    const user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    if (user.role === "Employee") {
        new errors.AccessNotPermittedError(next, "/projects");
        return;
    }

    let data = {};

    data.title = `Update ${project.name}`;
    data.pageName  = "projects";
    data.session = appUtil.getSession(req);
    data.user = user;
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
        new errors.ProjectNotFoundError(next, "/projects");
        return;
    }

    let isValid = await dbUtil.updateProject(
        f_id,
        f_name,
        f_description,
        f_due_date
    );

    if (!isValid) {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    } else {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    }

    res.redirect(`/project/update/${f_id}`);
});

router.get("/project/delete/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;

    let data = {};

    const project = await dbUtil.fetchProject(id);

    data.title = `Delete ${project.name}`;
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.project = project;

    res.render("./../pages/project_delete.ejs", data);
});

router.post("/project/delete/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_id } = req.body;

    const project = await dbUtil.fetchProject(f_id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/projects");
        return;
    }

    let isValid = await dbUtil.deleteProject(f_id);

    if (!isValid) {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    } else {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    }

    res.redirect("/projects");
});

router.get("/project/view/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;
    const project = await dbUtil.fetchProject(id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/projects");
        return;
    }

    const user = appUtil.getSessionUser(req);
    const assignment = await dbUtil.fetchAssignmentsWithFilter(id, user.id);

    if (!assignment) {
        new errors.AccessNotPermittedError(next, "/projects");
        return;
    }

    let data = {};
    data.title = `Viewing ${project.name}`;
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.project = project;
    data.assignment = assignment;

    res.render("./../pages/project_view.ejs", data);
});

router.get("/project/assign/", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;

    let data = {};

    data.title = "Assign team members";
    data.pageName  = "projects";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.projects = await dbUtil.fetchProjects();

    res.render("./../pages/project_assign.ejs", data);
});

module.exports = router;
