"use strict";

const express = require("express");
const router = express.Router();
const helpers = require("../helpers.js");

router.get("/pulse/index", (req, res) => {
    let data = {};

    data.title = "Home";

    res.render("../pages/index.ejs", data);
});

router.get("/pulse/about", async (req, res) => {
    let data = {};

    data.title = "About";
    data.content = helpers.getAboutInfo();

    res.render("../pages/about.ejs", data);
});

module.exports = router;
