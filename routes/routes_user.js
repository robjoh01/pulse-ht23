"use strict";

// Import dependencies
const express = require("express");
const multer  = require("multer");
const upload = multer({ dest: "uploads/" });

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");
const conversionUtil = require("../src/utils/conversionUtil.js");
const emailUtil = require("../src/utils/emailUtil.js");
const profanityUtil = require("./../src/utils/profanityUtil.js");
const hashUtil = require('../src/utils/hashUtil.js');

// Import errors
const errors = require("../src/errors/errors.js");

// Make instances
const router = express.Router();

router.get("/user/register", (req, res, next) => {
    let data = {};

    data.title = "Register";
    data.pageName  = "user-register";
    data.session = appUtil.getSession(req);

    res.render("./../pages/user_register.ejs", data);
});

router.get("/user/login", (req, res, next) => {
    if (appUtil.isUserAuthenticated(req)) {
        res.redirect("/");
        return;
    }

    if (process.env.FORCE_AS_ADMIN === "true") {
        appUtil.authenticateUser(
            req,
            process.env.ADMIN_ID,
            process.env.ADMIN_USER,
            process.env.ADMIN_PASS,
            false
        );

        res.redirect("/");
        return;
    }

    let data = {};

    data.title = "Login";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);

    res.render("./../pages/user_login.ejs", data);
});

router.get("/user/logout", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const user = appUtil.getSessionUser(req);

    await dbUtil.logoutUser(user.id);

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
    data.pageName  = "user";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/user_profile.ejs", data);
});

router.get("/user/change_password", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Change Password";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);

    res.render("./../pages/user_change_password.ejs", data);
});

router.get("/user/delete", (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Delete Account";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);

    res.render("./../pages/user_delete.ejs", data);
});

router.post("/user/register/posted", async (req, res, next) => {
    const { f_email, f_username, f_password, f_password_again, f_employee, f_privacy_policy } = req.body;

    if (!f_email ||
        !f_username ||
        !f_password ||
        !f_password_again ||
        !f_employee ||
        !f_privacy_policy) {
        new errors.BadCredentialsError(next, "/user/register");
        return;
    }

    if (profanityUtil.exists(f_username)) {
        new errors.ProfanityDetectedError(next, "/user/register");
        return;
    }

    if (f_password != f_password_again) {
        new errors.PasswordNotMatchError(next, "/user/register");
        return;
    }

    let doesUserExists = await dbUtil.doesUserExists(f_username);

    if (doesUserExists) {
        new errors.UserAlreadyExistsError(next, "/user/register");
        return;
    }

    const id = hashUtil.generateGuid();

    if (!id) {
        new errors.UnkownError(next, "/user/register");
        return;
    }

    console.log(f_employee);

    const wasSuccessful = await dbUtil.createUser(id, f_employee, f_username, f_password, f_email);

    if (!wasSuccessful) {
        // req.flash("error", "The account couldn't be created for an unknown reason. Please try again in a few seconds.");
        res.redirect("/user/register");
        return;
    }

    // TODO: Enable this for production ready
    //emailUtil.sendMailAsServer(f_email, "Welcome to Pulse!", "<h1>Hello, World!</h1>\n<p>Welcome To Jurassic Park</p>\n<a href=\"www.google.com\">Click here</a>");

    appUtil.authenticateUser(req, id, f_username, f_password, f_employee);

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

    res.redirect("/user/profile");
});

router.post("/user/change_password/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_current_password, f_new_password, f_new_password_again } = req.body;

    if (!f_current_password ||
        !f_new_password ||
        !f_new_password_again) {
        new errors.BadCredentialsError(next, "/user/profile");
        return;
    }

    if (f_new_password != f_new_password_again) {
        new errors.PasswordNotMatchError(next, "/user/profile");
        return;
    }

    await dbUtil.updateUserPassword(user.id, f_new_password);

    req.session.user.password = f_new_password; // Update password in the session.

    res.redirect("/user/profile");
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

router.post("/user/profile/image/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/profile");
        return;
    }

    // TODO: Create logic for retrive the image and updating the data table in the database.
    // https://www.npmjs.com/package/multer

    res.redirect("/user/profile");
});

module.exports = router;
