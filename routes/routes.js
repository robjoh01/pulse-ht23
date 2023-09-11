"use strict";

const express = require("express");
const router = express.Router();
const helpers = require("./../src/helpers.js");

router.get("/", async (req, res) => {
    let data = {};

    data.title = "Home";

    res.render("./../pages/index.ejs", data);
});

router.get("/about", async (req, res) => {
    let data = {};

    data.title = "About";
    data.content = helpers.getAboutInfo();

    res.render("./../pages/about.ejs", data);
});

module.exports = router;
