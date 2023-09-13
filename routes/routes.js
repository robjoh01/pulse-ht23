"use strict";

const express = require("express");
const router = express.Router();
const helpers = require("./../src/helpers.js");

router.get("/", async (req, res) => {
    let data = {};

    data.title = "";

    // Checks if you are logged in, if not, sign in. Otherwise, continue back on dashboard site.

    res.redirect("/login");
});

router.get("/dashboard", (req, res) => {
    let data = {};

    data.title = "Dashboard";

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
    const data = req.body;

    console.log(data);

    // let orderId = await helpers.createOrder(data.f_customer_id);

    // let inventory = await helpers.getInventory();

    // for (let i = 0; i < data.f_amount.length; i++) {
    //     if (data.f_amount[i] <= 0) {
    //         continue;
    //     }

    //     await helpers.addOrderRow(orderId, inventory[i].product_code, data.f_amount[i]);
    // }

    res.redirect("/profile");
});

router.get("/login", (req, res) => {
    let data = {};

    data.title = "Login";

    res.render("./../pages/login.ejs", data);
});

router.post("/login/posted", async (req, res) => {
    const data = req.body;

    console.log(data);

    // let orderId = await helpers.createOrder(data.f_customer_id);

    // let inventory = await helpers.getInventory();

    // for (let i = 0; i < data.f_amount.length; i++) {
    //     if (data.f_amount[i] <= 0) {
    //         continue;
    //     }

    //     await helpers.addOrderRow(orderId, inventory[i].product_code, data.f_amount[i]);
    // }

    res.redirect("/profile");
});

router.get("/logout", (req, res) => {
    res.redirect("/login");
});

router.get("/profile", (req, res) => {
    let data = {};

    data.title = "Profile";

    res.render("./../pages/profile.ejs", data);
});

router.get("/change_password", (req, res) => {
    let data = {};

    data.title = "Change Password";

    // res.sendStatus(200);

    res.render("./../pages/change_password.ejs", data);
});

router.post("/change_password/posted", async (req, res) => {
    const data = req.body;

    console.log(data);

    // let orderId = await helpers.createOrder(data.f_customer_id);

    // let inventory = await helpers.getInventory();

    // for (let i = 0; i < data.f_amount.length; i++) {
    //     if (data.f_amount[i] <= 0) {
    //         continue;
    //     }

    //     await helpers.addOrderRow(orderId, inventory[i].product_code, data.f_amount[i]);
    // }

    res.redirect("/profile");
});

module.exports = router;
