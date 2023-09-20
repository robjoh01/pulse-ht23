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
const errors = require("../src/errors/errors.js");

// Make instances
const router = express.Router();

router.get("/user/register", (req, res, next) => {
    let data = {};

    data.title = "Register";
    data.session = appUtil.getSession(req);

    res.render("./../pages/register.ejs", data);
});

router.get("/user/login", (req, res, next) => {
    let data = {};

    data.title = "Login";
    data.session = appUtil.getSession(req);

    res.render("./../pages/login.ejs", data);
});

router.get("/user/logout", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    // TODO: Call the database and update logout date

    // TODO: Add popup window and ask: Are you sure?

    req.session.destroy();

    res.redirect("/user/login");
});

router.get("/user/profile", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Profile";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.readUser(appUtil.getSessionUser(req));

    res.render("./../pages/profile.ejs", data);
});

router.get("/user/change_password", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Change Password";
    data.session = appUtil.getSession(req);

    // res.sendStatus(200);

    res.render("./../pages/change_password.ejs", data);
});

router.get("/user/delete", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Delete Account";
    data.session = appUtil.getSession(req);

    res.render("./../pages/delete.ejs", data);
});

router.post("/user/register/posted", async (req, res, next) => {
    const { f_email, f_username, f_password, f_password_again } = req.body;

    if (!f_email ||
        !f_username ||
        !f_password ||
        !f_password_again) {
        new errors.BadCredentialsError(next, "/user/register");
        return;
    }

    if (profanityUtil.exists(f_username) || profanityUtil.exists(f_password) || profanityUtil.exists(f_password_again)) {
        new errors.ProfanityDetectedError(next, "/user/register");
        return;
    }

    if (f_password != f_password_again) {
        new errors.PasswordNotMatchError(next, "/user/register");
        return;
    }

    if (await dbUtil.doesUserExists(f_username)) {
        new errors.UserAlreadyExistsError(next, "/user/register");
        return;
    }

    let id = await dbUtil.createUser(f_username, f_password, f_email);

    // TODO: Send email notifcation via (f_email)

    if (!id) {
        // req.flash("error", "The account couldn't be created for an unknown reason. Please try again in a few seconds.");
        res.redirect("/user/register");
        return;
    }

    appUtil.authenticateUser(req, id, f_username, f_password);

    res.redirect("/user/profile");
});

router.post("/user/login/posted", async (req, res, next) => {
    if (appUtil.isUserAuthenticated(req)) {
        res.redirect("/");
        return;
    }

    const { f_username, f_password, f_remember } = req.body;

    if (!f_username || !f_password) {
        new errors.BadCredentialsError(next, "/user/login");
        return;
    }

    const id = await dbUtil.loginUser(f_username, f_password);

    if (!id) {
        new errors.UserNotFoundError(next, "/user/login");
        return;
    }

    appUtil.authenticateUser(req, id, f_username, f_password);

    if (f_remember) {
        req.session.cookie.maxAge = conversionUtil.daysToMilliseconds(31);
    }

    res.redirect("/");
});

router.post("/user/profile/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_display_name, f_email, f_phone_number, f_image_url } = req.body;

    let isValid = await dbUtil.updateUser(
        appUtil.getSessionUser(req),
        f_display_name,
        f_email,
        f_phone_number,
        f_image_url
    );

    if (!isValid) {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    } else {
        // req.flash("error", "The account couldn't be updated for an unknown reason. Please try again in a few seconds.");
    }

    res.redirect("/profile");
});

router.post("/user/change_password/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_current_password, f_new_password, f_new_password_again } = req.body;

    const user = appUtil.getSessionUser(req);

    if (dbUtil.loginUser(user.username, f_current_password) && f_new_password === f_new_password_again) {
        // TODO: Add logic

        res.redirect("/user/profile");
        return;
    }

    res.status(403).json({ msg: "Bad Credentials" });
});

router.post("/user/delete/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/profile");
        return;
    }

    const { f_password, f_password_again } = req.body;

    if (!f_password || !f_password_again) {
        new errors.BadCredentialsError(next, "/user/delete");
        return;
    }

    if (f_password != f_password_again) {
        new errors.PasswordNotMatchError(next, "/user/delete");
        return;
    }

    const user = appUtil.getSessionUser(req);

    const id = await dbUtil.loginUser(user.username, f_password);

    if (!id) {
        new errors.UserNotFoundError(next, "/user/delete");
        return;
    }

    let wasSuccessful = await dbUtil.deleteUser(user);

    if (!wasSuccessful) {
        // req.flash("error", "The account couldn't be created for an unknown reason. Please try again in a few seconds.");
        res.redirect("/user/profile");
        return;
    }

    appUtil.invalidateUser(req);

    // TODO: Add toast popup message for successful deletion
    // req.flash("successful", "Yay!");

    res.redirect("/user/login");
});

module.exports = router;
