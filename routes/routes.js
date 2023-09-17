"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");
const miscUtil = require("../src/utils/miscUtil.js");
const emailUtil = require("../src/utils/emailUtil.js");

// Import classes
const Filter = require("bad-words");

// Import errors
const AppError = require("../src/errors/appError.js");

// Make instances
const filter = new Filter();
const router = express.Router();

// Status code = https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

router.get("/error", (req, res) => {
    let data = {};

    data.title = "Error";

    if (!req.session.context) {
        data.error_code = "404";
        data.error_title = "Page Not Found ⚠️";
        data.error_message = "We couldn′t find the page, that you are looking for."
        data.error_redirect = "/";
    } else {
        const err = req.session.context;
        data.error_code = err.code;
        data.error_title = err.title;
        data.error_message = err.msg;
        data.error_redirect = err.redirect;
    }

    console.log(data);

    res.render("./../pages/error.ejs", data);
});

router.get("/", async (req, res, next) => {
    let data = {};

    data.title = "Dashboard";

    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const username = appUtil.getUsername();
    data.user = await dbUtil.getUserData(username);

    // [
    //   'employee_id',
    //   'username',
    //   'display_name',
    //   'email_address',
    //   'phone_number'
    // ]

    console.table(await dbUtil.getUsers());

    res.render("./../pages/dashboard.ejs", data);
});

router.get("/about", async (req, res) => {
    let data = {};

    data.title = "About";

    res.render("./../pages/about.ejs", data);
});

router.get("/contact", async (req, res) => {
    let data = {};

    data.title = "Contact";

    data.gmail = process.env.GMAIL_URL;
    data.github = process.env.GITHUB_URL;
    data.phone = process.env.PHONE_URL;

    res.render("./../pages/contact.ejs", data);
});

router.get("/register", (req, res) => {
    let data = {};

    data.title = "Register";

    res.render("./../pages/register.ejs", data);
});

router.post("/register/posted", async (req, res) => {
    const { f_username, f_password, f_password_again, f_display_name, f_email, f_phone_number } = req.body;

    if (!f_username ||
        !f_password ||
        !f_password_again) {
            // TODO: Throw error
            return;
        }

    if (filter.isProfane(f_username, f_password)) {
        // TODO: Throw error
        return;
    }

    if (f_password != f_password_again) {
        // TODO: Throw error
        return;
    }

    if (dbUtil.doesUserExists(f_username)) {
        // TODO: Throw error
        return;
    }

    // TODO: Fix this function
    dbUtil.createUser(f_username, f_password, f_display_name, f_email, f_phone_number);

    res.redirect("/profile");
});

router.get("/login", (req, res) => {
    let data = {};

    data.title = "Login";

    res.render("./../pages/login.ejs", data);
});

router.post("/login/posted", async (req, res, next) => {
    const { f_username, f_password, f_remember } = req.body;

    if (!f_username || !f_password) {
        res.status(403).json({ msg: "Bad Credentials" });
        res.redirect("/login");
        return;
    }

    if (!await dbUtil.loginUser(f_username, f_password)) {
        const err = new AppError(403, "Account not found ⚠️", "We couldn′t find the account, that you are looking for.", "/login");
        next(err);

        // res.status(403).json({ msg: "" });
        // res.redirect("/login");
        return;
    }

    if (req.session.authenticated) {
        res.redirect("/");
        return;
    }

    req.session.authenticated = true;

    req.session.user = {
        username: f_username,
    };

    if (f_remember) {
        req.session.cookie.maxAge = dbUtil.daysToMilliseconds(31);
    }

    res.redirect("/");
});

router.get("/logout", (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    // TODO: Call the database and update logout date

    // TODO: Add popup window and ask: Are you sure?

    req.session.destroy();

    res.redirect("/login");
});

router.get("/profile", (req, res) => {
    let data = {};

    data.title = "Profile";

    res.render("./../pages/profile.ejs", data);
});

router.post("/profile/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_profile_image, f_username, f_display_name, f_email, f_phone_number } = req.body;

    res.redirect("/profile");
});

router.get("/change_password", (req, res) => {
    let data = {};

    data.title = "Change Password";

    // res.sendStatus(200);

    res.render("./../pages/change_password.ejs", data);
});

router.post("/change_password/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_current_password, f_new_password, f_new_password_again } = req.body;

    if (dbUtil.loginUser(req.session.user.username, f_current_password) && f_new_password === f_new_password_again) {
        // TODO: Add logic

        res.redirect("/profile");
        return;
    }

    res.status(403).json({ msg: "Bad Credentials" });
});

router.get("/delete", (req, res) => {
    let data = {};

    data.title = "Delete Account";

    res.render("./../pages/delete.ejs", data);
});

router.post("/delete/posted", async (req, res) => {
    if (!appUtil.hasUserLoggedIn(req, res)) {
        return;
    }

    const { f_password, f_password_again } = req.body;
    const username = req.session.user.username;

    if (!username || !f_password || !f_password_again) {
        res.status(403).json({ msg: "Bad Credentials" });
        return;
    }

    if (f_password != f_password_again) {
        res.status(403).json({ msg: "Password do not match" });
        return;
    }

    if (!dbUtil.loginUser(username, f_password)) {
        res.status(403).json({ msg: "Account not found" });
        return;
    }

    if (!await dbUtil.deleteUser(username, f_password)) {
        res.status(403).json({ msg: "Deletion could not be executed" });
        return;
    }

    // TODO: Add toast popup message for successful deletion

    console.table(await dbUtil.getUsers());

    res.redirect("/login");
});

module.exports = router;
