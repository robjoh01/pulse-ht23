"use strict";

// Import dependencies
const express = require("express");
const bcrypt = require('bcrypt');

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");
const conversionUtil = require("./../src/utils/conversionUtil.js");
const emailUtil = require("./../src/utils/emailUtil.js");
const profanityUtil = require("./../src/utils/profanityUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");

// Make instances
const router = express.Router();

router.post("/register/posted", async (req, res, next) => {
    const { f_email, f_username, f_password, f_password_again } = req.body;

    if (!f_email ||
        !f_username ||
        !f_password ||
        !f_password_again) {
        new errors.BadCredentialsError(next, "/register");
        return;
    }

    if (profanityUtil.exists(f_username) || profanityUtil.exists(f_password) || profanityUtil.exists(f_password_again)) {
        new errors.ProfanityDetectedError(next, "/register");
        return;
    }

    if (f_password != f_password_again) {
        new errors.PasswordNotMatchError(next, "/register");
        return;
    }

    if (await dbUtil.doesUserExists(f_username)) {
        new errors.UserAlreadyExistsError(next, "/register");
        return;
    }

    let id = await dbUtil.createUser(f_username, f_password, f_email);

    // TODO: Send email notifcation via (f_email)

    if (!id) {
        // req.flash("error", "The account couldn't be created for an unknown reason. Please try again in a few seconds.");
        res.redirect("/register");
        return;
    }

    appUtil.authenticateUser(req, id, f_username, f_password);

    res.redirect("/profile");
});

router.post("/login/posted", async (req, res, next) => {
    if (appUtil.isUserAuthenticated(req)) {
        res.redirect("/");
        return;
    }

    const { f_username, f_password, f_remember } = req.body;

    if (!f_username || !f_password) {
        new errors.BadCredentialsError(next, "/login");
        return;
    }

    const id = await dbUtil.loginUser(f_username, f_password);

    if (!id) {
        new errors.UserNotFoundError(next, "/login");
        return;
    }

    appUtil.authenticateUser(req, id, f_username, f_password);

    if (f_remember) {
        req.session.cookie.maxAge = conversionUtil.daysToMilliseconds(31);
    }

    res.redirect("/");
});

router.post("/profile/posted", async (req, res) => {
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

router.post("/change_password/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_current_password, f_new_password, f_new_password_again } = req.body;

    const user = appUtil.getSessionUser(req);

    if (dbUtil.loginUser(user.username, f_current_password) && f_new_password === f_new_password_again) {
        // TODO: Add logic

        res.redirect("/profile");
        return;
    }

    res.status(403).json({ msg: "Bad Credentials" });
});

router.post("/delete/posted", async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        new errors.UserNotLoggedInError(next, "/profile");
        return;
    }

    const { f_password, f_password_again } = req.body;

    if (!f_password || !f_password_again) {
        new errors.BadCredentialsError(next, "/delete");
        return;
    }

    if (f_password != f_password_again) {
        new errors.PasswordNotMatchError(next, "/delete");
        return;
    }

    const user = appUtil.getSessionUser(req);

    const id = await dbUtil.loginUser(user.username, f_password);

    if (!id) {
        new errors.UserNotFoundError(next, "/delete");
        return;
    }

    let wasSuccessful = await dbUtil.deleteUser(user);

    if (!wasSuccessful) {
        // req.flash("error", "The account couldn't be created for an unknown reason. Please try again in a few seconds.");
        res.redirect("/profile");
        return;
    }

    appUtil.invalidateUser(req);

    // TODO: Add toast popup message for successful deletion
    // req.flash("successful", "Yay!");

    res.redirect("/login");
});

module.exports = router;

/*

  <form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" required>
    <button type="submit">Upload</button>
  </form>

  res.render('index', { helper:helper });

  <%= helper.common1() %>

*/
