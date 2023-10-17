"use strict";

const conversionUtil = require("../utils/conversionUtil.js");
const dateUtil = require('../utils/dateUtil.js');
const BaseEmail = require("./baseEmail.js");

class ReminderEmail extends BaseEmail {
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
