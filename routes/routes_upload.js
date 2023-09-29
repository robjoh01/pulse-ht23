"use strict";

// Import dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const csv = require("csvtojson");

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");

// Make instances
const router = express.Router();

router.post("/project/assign/upload", fileUpload({ limits: { fileSize: 10 * 1000 } }), async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        throw new errors.UserNotLoggedInError(next, "/user/login");
    }

    const { projectId, reportFreq, reportDate } = req.body;

    if (!projectId || !reportFreq && !reportDate) {
        throw new errors.BadCredentialsError(next, "/project/assign");
    }

    const doesProjectExists = await dbUtil.doesProjectExists(null, projectId);

    if (!doesProjectExists) {
        throw new errors.ProjectNotFoundError(next, "/project/assign");
    }

    const files = Object.values(req.files);
    const csvData = files[0].data.toString('utf8');

    const csvRow = await csv().fromString(csvData);

    for (const x of csvRow) {
        const doesUserExist = await dbUtil.doesUserExists(null, x.employee_id);
        let wasSuccessful = true;

        if (!doesUserExist) {
            wasSuccessful = await dbUtil.createUser(x.employee_id, true, x.username, "password", x.email_address);

            if (!wasSuccessful) {
                throw new errors.UnkownError(next, "/project/assign");
            }

            wasSuccessful = await dbUtil.updateUser(x.employee_id, null, x.display_name, null, x.phone_number, null);

            if (!wasSuccessful) {
                throw new errors.UnkownError(next, "/project/assign");
            }
        }

        // TODO: Fix the integration with reportFreq and reportDate

        wasSuccessful = await dbUtil.assignToProject(projectId, x.employee_id, reportFreq, null);

        if (!wasSuccessful) {
            throw new errors.UnkownError(next, "/project/assign");
        }
    }

    res.redirect("/dashboard");
});

module.exports = router;
