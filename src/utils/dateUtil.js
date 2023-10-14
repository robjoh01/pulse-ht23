"use strict";

const moment = require("moment");

const dateUtil = {
    parseDate: function (date) {
        return moment(date).format("YYYY-MM-DD");
    },
    parseDateExtend: function (date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    parseDateToReadableString: function (date) {
        return moment(date).format("YYYY-MM-DD hh:mm A");
    },
    getCurrentDate: function () {
        return moment().format("YYYY-MM-DD");
    },
    getCurrentDateExtend: function () {
        return moment().format("YYYY-MM-DD HH:mm:ss");
    },
    calcTimeLeft: function (datetime) {
        const now = moment();
        const then = moment(datetime, "YYYY-MM-DD hh:mm A");
        const duration = moment.duration(then.diff(now));

        if (duration.asMilliseconds() < 0) {
            return "Time has passed";
        } else if (duration.asMonths() > 1) {
            const months = Math.floor(duration.asMonths());
            return months + ` ${months > 1 ? "months left" : "month left"}`;
        } else if (duration.asWeeks() > 1) {
            const weeks = Math.floor(duration.asWeeks());
            return weeks + ` ${weeks > 1 ? "weeks left" : "week left"}`;
        } else if (duration.asDays() > 1) {
            const days = Math.floor(duration.asDays());
            return days + ` ${days > 1 ? "days left" : "day left"}`;
        } else if (duration.asHours() > 1) {
            const hours = Math.floor(duration.asHours());
            return hours + ` ${hours > 1 ? "hours left" : "hour left"}`;
        } else {
            const minutes = Math.floor(duration.asMinutes());
            return minutes + ` ${minutes > 1 ? "minutes left" : "minute left"}`;
        }
    },
};

module.exports = dateUtil;
