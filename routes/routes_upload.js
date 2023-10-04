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

    let { data, projectId, reportFreq, reportDeadline } = req.body;

    if (!data || !projectId || !reportFreq && !reportDeadline) {
        res.json({ wasUploaded: false });
        return;
    }

    const doesProjectExists = await dbUtil.doesProjectExists(null, projectId);

    if (!doesProjectExists) {
        res.json({ wasUploaded: false });
        return;
    }

    if (reportFreq) {
        reportDeadline = null;
    }

    const errs = [];
    const rows = await csv().fromString(data);

    // await Promise.all(rows.map(async (x) => {

    // }));

    for (const x of rows) {
        try {
            const doesUserExists = await dbUtil.doesUserExists(null, x.employee_id);

            if (!doesUserExists) {
                const wasCreated = await dbUtil.createUser(x.employee_id, true, x.username, "password", x.email_address);

                if (!wasCreated) {
                    new errors.UnknownError(next);
                    return;
                }

                const wasUpdated = await dbUtil.updateUser(x.employee_id, null, null, null, x.phone_number, x.image_url);

                if (!wasUpdated) {
                    new errors.UnknownError(next);
                    return;
                }

                const mail = new emails.RegistrationEmail(req, x.display_name);
                await mail.send(x.email_address);
            }

            const isEmployee = await dbUtil.isEmployee(x.employee_id);

            if (!isEmployee) {
                new errors.UnknownError(next);
                return;
            }

            const wasSuccessful = await dbUtil.assignToProject(x.employee_id, projectId);

            if (!wasSuccessful) {
                new errors.UnknownError(next);
                return;
            }
        } catch (err) {
            console.log(err);
            errs.push(err.message);
        }
    }

    if (errors.length > 0) {
        res.json({ wasUploaded: false, errors });
    } else {
        res.json({ wasUploaded: true, redirect: "/dashboard" });
    }
});

module.exports = router;
