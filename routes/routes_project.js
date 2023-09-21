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

router.get("/project/managed", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = `Managed Projects`;
    data.session = appUtil.getSession(req);

    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = process.env.PORT || PORT;
  
    data.baseUrl = `${protocol}://${host}:${port}`;
    data.fullUrl = `${protocol}://${host}:${port}${url}`;

    const user = appUtil.getSessionUser(req);

    data.assignments = await dbUtil.readAssignmentsForUser(user.id);

    res.render("./../pages/project_managed.ejs", data);
});

router.get("/project/create", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Create a new project";
    data.session = appUtil.getSession(req);

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

    res.redirect("/project/managed");
});

router.get("/project/update/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;
    const project = await dbUtil.readProject(id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/project/managed");
        return;
    }

    const user = appUtil.getSessionUser(req);
    const assignment = await dbUtil.readAssignmentForUser(id, user.id);

    if (!assignment) {
        new errors.AccessNotPermittedError(next, "/project/managed");
        return;
    }

    if (assignment.access_type === "comment" || assignment.access_type === "view") {
        res.redirect(`/project/view/${id}`);
        return;
    }

    let data = {};
    data.title = `Update ${project.name}`;
    data.session = appUtil.getSession(req);
    data.project = project;
    data.assignment = assignment;

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

    const project = await dbUtil.readProject(f_id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/project/managed");
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

    const project = await dbUtil.readProject(id);

    data.title = `Delete ${project.name}`;
    data.session = appUtil.getSession(req);
    data.project = project;

    res.render("./../pages/project_delete.ejs", data);
});

router.post("/project/delete/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const { f_id } = req.body;

    const project = await dbUtil.readProject(f_id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/project/managed");
        return;
    }

    let isValid = await dbUtil.deleteProject(f_id);

    if (!isValid) {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    } else {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    }

    res.redirect("/project/managed");
});

router.get("/project/view/:id", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;
    const project = await dbUtil.readProject(id);

    if (!project) {
        new errors.ProjectNotFoundError(next, "/project/managed");
        return;
    }

    const user = appUtil.getSessionUser(req);
    const assignment = await dbUtil.readAssignmentForUser(id, user.id);

    if (!assignment) {
        new errors.AccessNotPermittedError(next, "/project/managed");
        return;
    }

    let data = {};
    data.title = `Viewing ${project.name}`;
    data.session = appUtil.getSession(req);
    data.project = project;
    data.assignment = assignment;

    res.render("./../pages/project_view.ejs", data);
});

router.get("/project/assign/", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const id = req.params.id;

    let data = {};

    data.title = "Assign team members";
    data.session = appUtil.getSession(req);

    res.render("./../pages/project_assign.ejs", data);
});

module.exports = router;
