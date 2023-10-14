"use strict";

const conversionUtil = require("../utils/conversionUtil.js");
const BaseEmail = require("./baseEmail.js");

class ReminderEmail extends BaseEmail {
    constructor (hoursNotice) {
        const data = {};

        data.time = conversionUtil.getHumanReadableTime(conversionUtil.hoursToMilliseconds(hoursNotice));

        super(`Your report is due in ${data.time}`, "reminde.ejs", data);
    }
}

module.exports = ReminderEmail;
