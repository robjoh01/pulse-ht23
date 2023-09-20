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

router.get("/json/", async (req, res, next) => {
    let data = {};

    data.title = "JSON";
    data.session = appUtil.getSession(req);

    res.render("./../pages/json.ejs", data);
});

router.get("/json/project/:id", async (req, res, next) => {
    const id = req.params.id;
    const data = await dbUtil.readProject(id);

    res.json(data);
});

router.get("/json/user/:id", async (req, res, next) => {
    const id = req.params.id;
    const data = await dbUtil.readUser(id);

    res.json(data);
});

router.get("/json/projects", async (req, res, next) => {
    const data = await dbUtil.readProjects();

    res.json(data);
});

router.get("/json/users", async (req, res, next) => {
    const data = await dbUtil.readUsers();

    res.json(data);
});

router.get("/json/assignments", async (req, res, next) => {
    const data = await dbUtil.readAssignments();

    res.json(data);
});

router.post("/json/project/", async (req, res, next) => {
    const { f_id } = req.body;
    const data = await dbUtil.readProject(f_id);

    res.json(data);
});

router.post("/json/user/", async (req, res, next) => {
    const { f_id } = req.body;
    const data = await dbUtil.readUser(f_id);

    res.json(data);
});

module.exports = router;
