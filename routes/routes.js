"use strict";

const express = require("express");
const router = express.Router();
const helpers = require("./../src/helpers.js");

router.get("/", async (req, res) => {
    let data = {};

    data.title = "Dashboard";

    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    const username = req.session.user.username;
    data.user = await helpers.getUserData(username);
    console.table(await helpers.getUsers());

    // [
    //   'employee_id',
    //   'username',
    //   'display_name',
    //   'email_address',
    //   'phone_number'
    // ]

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

    res.render("./../pages/contact.ejs", data);
});

router.get("/error", (req, res) => {
    let data = {};

    data.title = "Error";

    data.error_code = "404";
    data.error_title = "Page Not Found ⚠️";
    data.error_message = "We couldn′t find the page you are looking for.";

    res.render("./../pages/error.ejs", data);
});

router.get("/register", (req, res) => {
    let data = {};

    data.title = "Register";

    res.render("./../pages/register.ejs", data);
});

router.post("/register/posted", async (req, res) => {
    const { f_username, f_email, f_password, f_password_again } = req.body;

    res.redirect("/profile");
});

router.get("/login", (req, res) => {
    let data = {};

    data.title = "Login";

    res.render("./../pages/login.ejs", data);
});

router.post("/login/posted", async (req, res) => {
    const { f_username, f_password, f_remember } = req.body;

    if (!f_username || !f_password) {
        res.status(403).json({ msg: "Bad Credentials" });
        res.redirect("/login");
        return;
    }

    if (!await helpers.loginUser(f_username, f_password)) {
        res.status(403).json({ msg: "Account not found" });
        res.redirect("/login");
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
        req.session.cookie.maxAge = helpers.daysToMilliseconds(31);
    }

    res.redirect("/");
});

router.get("/logout", (req, res) => {
    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    // TODO: Call the database and update logout date

    req.session.destroy();

    res.redirect("/login");
});

router.get("/profile", (req, res) => {
    let data = {};

    data.title = "Profile";

    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    res.render("./../pages/profile.ejs", data);
});

router.post("/profile/posted", async (req, res) => {
    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    const { f_profile_image, f_username, f_display_name, f_email, f_phone_number } = req.body;

    res.redirect("/profile");
});

router.get("/change_password", (req, res) => {
    let data = {};

    data.title = "Change Password";

    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    // res.sendStatus(200);

    res.render("./../pages/change_password.ejs", data);
});

router.post("/change_password/posted", async (req, res) => {
    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    const { f_current_password, f_new_password, f_new_password_again } = req.body;

    if (helpers.loginUser(req.session.user.username, f_current_password) && f_new_password === f_new_password_again) {
        // TODO: Add logic

        res.redirect("/profile");
        return;
    }

    res.status(403).json({ msg: "Bad Credentials" });
});

router.get("/delete", (req, res) => {
    let data = {};

    data.title = "Delete Account";

    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
        return;
    }

    res.render("./../pages/delete.ejs", data);
});

router.post("/delete/posted", async (req, res) => {
    // Checks if you are logged in, if not, sign in. Otherwise, continue back on the site.
    if (!req.session.authenticated) {
        res.redirect("/login");
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

    if (!helpers.loginUser(username, f_password)) {
        res.status(403).json({ msg: "Account not found" });
        return;
    }

    if (!await helpers.deleteUser(username, f_password)) {
        res.status(403).json({ msg: "Deletion could not be executed" });
        return;
    }

    // TODO: Add toast popup message for successful deletion

    console.table(await helpers.getUsers());

    res.redirect("/login");
});

module.exports = router;
