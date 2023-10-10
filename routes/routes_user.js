"use strict";

// Import dependencies
const express = require("express");
const multer  = require("multer");
const upload = multer({ dest: "uploads/" });

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");
const conversionUtil = require("../src/utils/conversionUtil.js");
const profanityUtil = require("./../src/utils/profanityUtil.js");
const hashUtil = require('../src/utils/hashUtil.js');
const errors = require("../src/errors/errors.js");
const emails = require("./../src/emails/emails.js");

// Make instances
const router = express.Router();

router.get("/user/register", (req, res, next) => {
    let data = {};

    data.title = "Register";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);

    res.render("./../pages/user_register.ejs", data);
});

router.get("/user/login", async (req, res, next) => {
    if (appUtil.isUserAuthenticated(req)) {
        res.redirect("/");
        return;
    }

    if (process.env.CONFIG_MODE === "dev") {
        if (process.env.FORCE_LOGIN === "true") {
            const isEmployee = await dbUtil.isEmployee(process.env.FORCE_ID);

            appUtil.authenticateUser(
                req,
                process.env.FORCE_ID,
                isEmployee
            );

            res.redirect("/");
            return;
        }
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

    const wasSuccessful = true;

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/user/profile");
        return;
    }

    await dbUtil.logoutUser(user.id);

    req.session.destroy();

    res.redirect("/user/login");
});

router.get("/user/profile", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const user = appUtil.getSessionUser(req);

    let data = {};

    data.title = "Profile";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);
    data.user_id = user.id;
    data.user = await dbUtil.fetchUser(user.id);

    res.render("./../pages/user_profile.ejs", data);
});

router.get("/user/change_password", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Change Password";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);
    data.password = req.session.password ? req.session.password : "";

    console.log(data.password);

    res.render("./../pages/user_change_password.ejs", data);
});

router.get("/user/change_password/:id/:password", async (req, res, next) => {
    const id = req.params.id;
    const password = req.params.password;

    const isValid = await dbUtil.doesUserHavePermission(id, password);

    if (!isValid) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    const isEmployee = await dbUtil.isEmployee(id);

    appUtil.authenticateUser(req, id, isEmployee);

    req.session.password = password;

    res.redirect("/user/change_password");
});

router.get("/user/delete", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/user/login");
        return;
    }

    let data = {};

    data.title = "Delete Account";
    data.pageName  = "user";
    data.session = appUtil.getSession(req);
    data.user = await dbUtil.fetchUser(appUtil.getSessionUser(req).id);

    res.render("./../pages/user_delete.ejs", data);
});

router.post("/user/register/posted", async (req, res, next) => {
    const { f_email, f_username, f_password, f_password_again, f_role, f_privacy_policy } = req.body;

    if (!f_email ||
        !f_username ||
        !f_password ||
        !f_password_again ||
        !f_role ||
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
        new errors.UnknownError(next, "/user/register");
        return;
    }
    
    const isEmployee = Boolean(f_role);
    const wasSuccessful = await dbUtil.createUser(id, isEmployee, f_username, f_password, f_email);

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/user/register");
        return;
    }

    appUtil.authenticateUser(req, id, isEmployee);

    const mail = new emails.WelcomeEmail();
    mail.send(f_email);

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

    const isEmployee = await dbUtil.isEmployee(id);

    appUtil.authenticateUser(req, id, isEmployee);

    if (f_remember) {
        req.session.cookie.maxAge = conversionUtil.daysToMilliseconds(31);
    }

    res.redirect("/");
});

router.post("/user/profile/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const user = appUtil.getSessionUser(req);

    const { f_display_name, f_email, f_phone_number, f_image_url } = req.body;

    const wasSuccessful = await dbUtil.updateUser(
        user.id,
        null,
        f_display_name,
        f_email,
        f_phone_number,
        f_image_url
    );

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/user/profile");
        return;
    }

    res.redirect("/user/profile");
});

router.post("/user/change_password/posted", async (req, res, next) => {
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

    const user = appUtil.getSessionUser(req);

    const wasSuccessful = await dbUtil.updateUser(user.id, f_new_password);

    if (!wasSuccessful) {
        new errors.UnknownError(next, "/user/profile");
        return;
    }

    const userData = await dbUtil.fetchUser(user.id);
    const mail = new emails.PasswordEmail(req, user.id, f_new_password, userData.display_name);
    mail.send(userData.email_address);

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

    const id = await dbUtil.doesUserHavePermission(user.id, f_password);

    if (!id) {
        new errors.UserNotFoundError(next, "/user/delete");
        return;
    }

    let wasSuccessful = await dbUtil.deleteUser(user.id);

    if (!wasSuccessful) {
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
