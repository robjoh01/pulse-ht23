"use strict";

// Import dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const csv = require("csvtojson");

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");
const errors = require("./../src/errors/errors.js");
const emails = require("./../src/emails/emails.js");

// Make instances
const router = express.Router();

router.post("/project/assign/upload", fileUpload({ limits: { fileSize: 10 * 1000 } }), async (req, res, next) => {
    if (!appUtil.isUserAuthenticated(req)) {
        res.json({ wasUploaded: false });
        return;
    }

    let { data, projectId } = req.body;

    if (!data || !projectId) {
        res.json({ wasUploaded: false });
        return;
    }

    const doesProjectExists = await dbUtil.doesProjectExists(null, projectId);

    if (!doesProjectExists) {
        res.json({ wasUploaded: false });
        return;
    }

    const defaultPassword = "password";
    const rows = await csv().fromString(data);

    // TODO: Add ability to tell the client, if there was an issue during this process.

    for (const x of rows) {
        const doesUserExists = await dbUtil.doesUserExists(null, x.employee_id);

        if (!doesUserExists) {
            const wasCreated = await dbUtil.createUser(x.employee_id, true, x.username, defaultPassword, x.email_address);

            if (!wasCreated) {
                continue;
            }

            const wasUpdated = await dbUtil.updateUser(x.employee_id, null, null, null, x.phone_number, x.image_url);

            if (!wasUpdated) {
                continue;
            }

            const mail = new emails.RegistrationEmail(
                req,
                x.username,
                defaultPassword,
                x.display_name
            );

            await mail.send(x.email_address);
        }

        const isEmployee = await dbUtil.isEmployee(x.employee_id);

        if (!isEmployee) {
            continue;
        }

        const wasSuccessful = await dbUtil.assignToProject(x.employee_id, projectId);

        if (!wasSuccessful) {
            continue;
        }
    }

    res.json({ wasUploaded: true, redirect: "/dashboard" });
});

module.exports = router;
