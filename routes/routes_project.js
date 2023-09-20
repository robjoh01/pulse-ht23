"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("../src/utils/dbUtil.js");
const appUtil = require("../src/utils/appUtil.js");
const conversionUtil = require("../src/utils/conversionUtil.js");
const emailUtil = require("../src/utils/emailUtil.js");

// Import errors
const errors = require("../src/errors/errors.js");

// Make instances
const router = express.Router();

router.get("/project/:id", async (req, res, next) => {
    let data = {};

    // const name = req.query.name;
    const id = req.params.id;
    const project = await dbUtil.readProject(id);

    data.title = `Project ${id}`;
    data.session = appUtil.getSession(req);
    data.project = project;

    res.render("./../pages/delete.ejs", data);
});

router.get("/project/create", (req, res, next) => {
    let data = {};

    data.title = "Assign team members";
    data.session = appUtil.getSession(req);

    res.render("./../pages/assign_team_members.ejs", data);
});

router.get("/project/update", (req, res, next) => {
    let data = {};

    data.title = "Assign team members";
    data.session = appUtil.getSession(req);

    res.render("./../pages/assign_team_members.ejs", data);
});

router.get("/project/delete", (req, res, next) => {
    let data = {};

    data.title = "Assign team members";
    data.session = appUtil.getSession(req);

    res.render("./../pages/assign_team_members.ejs", data);
});

router.get("/project/assign", (req, res, next) => {
    let data = {};

    data.title = "Assign team members";
    data.session = appUtil.getSession(req);

    res.render("./../pages/assign_team_members.ejs", data);
});

router.post("/project/create/posted", async (req, res, next) => {
    res.redirect("/login");
});

router.post("/project/update/posted", async (req, res, next) => {
    res.redirect("/login");
});

router.post("/project/delete/posted", async (req, res, next) => {
    res.redirect("/login");
});

module.exports = router;
