"use strict";

const conversionUtil = require("../utils/conversionUtil.js");
const BaseEmail = require("./baseEmail.js");

/**
 * Class representing a reminder email for impending project report deadlines.
 * @memberof emails
 * @extends BaseEmail
 */
class ReminderEmail extends BaseEmail {
    /**
     * Create an instance of ReminderEmail.
     * @constructor
     * @param {object} assignment - The assignment details including project information.
     * @param {number} hoursNotice - The number of hours before the report deadline.
     */
    constructor (assignment, hoursNotice) {
        const data = {};

        data.project_id = assignment.project_id;
        data.project_name = assignment.project_name;
        data.project_deadline_date = assignment.project_deadline_date;
        data.time = conversionUtil.getHumanReadableTime(conversionUtil.hoursToMilliseconds(hoursNotice));

        super(`Your report is due in ${data.time}`, "reminder.ejs", data);
    }
}

module.exports = ReminderEmail;
