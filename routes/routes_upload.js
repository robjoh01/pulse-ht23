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

    let output = {
        stack: [],
        isValid: true,
    };

    for (const x of rows) {
        const doesUserExists = await dbUtil.doesUserExists(null, x.employee_id);

        if (!doesUserExists) {
            const wasCreated = await dbUtil.createUser(x.employee_id, true, x.username, defaultPassword, x.email_address);

            if (!wasCreated) {
                output.stack.push({
                    wasSuccessful: false,
                    message: `Error! Failure when creating employee: ${x.employee_id}.`
                });
                output.isValid = false;
                continue;
            }

            const wasUpdated = await dbUtil.updateUser(x.employee_id, null, null, null, x.phone_number, x.image_url);

            if (!wasUpdated) {
                output.stack.push({
                    wasSuccessful: false,
                    message: `Error! Failure when updating employee: ${x.employee_id}.`
                });
                output.isValid = false;
                continue;
            }

            const mail = new emails.RegistrationEmail(
                req,
                x.username,
                x.username,
                defaultPassword
            );

            await mail.send(x.email_address);
        }

        const isEmployee = await dbUtil.isEmployee(x.employee_id);

        if (!isEmployee) {
            output.stack.push({
                wasSuccessful: false,
                message: `Error! User ${x.employee_id} is not an employee.`
            });
            output.isValid = false;
            continue;
        }

        const doesAssignmentExists = await dbUtil.doesAssignmentExists(x.employee_id, projectId);

        if (doesAssignmentExists) {
            output.stack.push({
                wasSuccessful: false,
                message: `Warning! Employee ${x.employee_id} is already assigned to this project.`
            });
            output.isValid = false;
            continue;
        }

        const wasSuccessful = await dbUtil.assignToProject(x.employee_id, projectId);

        if (!wasSuccessful) {
            output.stack.push({
                wasSuccessful: false,
                message: `Error! Couldn't assign ${x.employee_id} to the project. Try again, later on.`
            });
            output.isValid = false;
            continue;
        }
    }

    output.stack.push({
        wasSuccessful: true,
        message: "Data was successfully uploaded"
    });

    res.json({ output, redirect: "/dashboard" });
});

module.exports = router;
