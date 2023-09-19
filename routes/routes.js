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
        data.error_title = "Page Not Found ⚠️";
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
    let data = {};

    data.title = "Dashboard";
    data.session = appUtil.getSession(req);

    if (!appUtil.isUserAuthenticated(req)) {
        res.redirect("/login");
        return;
    }

    data.user = await dbUtil.readUser(appUtil.getSessionUser(req));

    // data.user = await dbUtil.getUserData(data.username);

    // [
    //   'employee_id',
    //   'username',
    //   'display_name',
    //   'email_address',
    //   'phone_number'
    // ]

    // console.table(await dbUtil.getUsers());

    res.render("./../pages/dashboard.ejs", data);
});

router.get("/about", async (req, res, next) => {
    let data = {};

    data.title = "About";
    data.session = appUtil.getSession(req);

    res.render("./../pages/about.ejs", data);
});

router.get("/contact", async (req, res, next) => {
    let data = {};

    data.title = "Contact";
    data.session = appUtil.getSession(req);

    data.gmail = process.env.GMAIL_URL;
    data.github = process.env.GITHUB_URL;
    data.phone = process.env.PHONE_URL;

    res.render("./../pages/contact.ejs", data);
});

router.get("/register", (req, res, next) => {
    let data = {};

    data.title = "Register";
    data.session = appUtil.getSession(req);

    res.render("./../pages/register.ejs", data);
});

router.get("/login", (req, res, next) => {
    let data = {};

    data.title = "Login";
    data.session = appUtil.getSession(req);

    res.render("./../pages/login.ejs", data);
});

router.get("/logout", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/login");
        return;
    }

    // TODO: Call the database and update logout date

    // TODO: Add popup window and ask: Are you sure?

    req.session.destroy();

    res.redirect("/login");
});

router.get("/profile", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/login");
        return;
    }

    let data = {};

    data.title = "Profile";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.readUser(appUtil.getSessionUser(req));

    res.render("./../pages/profile.ejs", data);
});

router.get("/change_password", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/login");
        return;
    }

    let data = {};

    data.title = "Change Password";
    data.session = appUtil.getSession(req);

    // res.sendStatus(200);

    res.render("./../pages/change_password.ejs", data);
});

router.get("/delete", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/login");
        return;
    }

    let data = {};

    data.title = "Delete Account";
    data.session = appUtil.getSession(req);

    res.render("./../pages/delete.ejs", data);
});

router.get("/project/:id", (req, res, next) => {
    let data = {};

    // const name = req.query.name;
    const id = req.params.id;

    data.title = `Project ${id}`;
    data.session = appUtil.getSession(req);

    res.render("./../pages/delete.ejs", data);
});

router.get("/assign/team_members", (req, res, next) => {
    let data = {};

    data.title = "Assign team members";
    data.session = appUtil.getSession(req);

    res.render("./../pages/assign_team_members.ejs", data);
});

module.exports = router;
