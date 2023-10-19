"use strict";

const moment = require("moment");

/**
 * Utility for handling date and time operations.
 * @namespace
 */
const dateUtil = {
    /**
     * Parses a date into the format "YYYY-MM-DD".
     * @function
     * @param {Date} date - The date to parse.
     * @returns {string} - The parsed date.
     */
    parseDate: function (date) {
        return moment(date).format("YYYY-MM-DD");
    },

    /**
     * Parses a date into the format "YYYY-MM-DD HH:mm:ss".
     * @function
     * @param {Date} date - The date to parse.
     * @returns {string} - The parsed date.
     */
    parseDateExtend: function (date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },

    /**
     * Parses a date into a human-readable string format.
     * @function
     * @param {Date} date - The date to parse.
     * @returns {string} - The parsed date as a human-readable string.
     */
    parseDateToReadableString: function (date) {
        return moment(date).format("YYYY-MM-DD hh:mm A");
    },

    /**
     * Gets the current date in the format "YYYY-MM-DD".
     * @function
     * @returns {string} - The current date.
     */
    getCurrentDate: function () {
        return moment().format("YYYY-MM-DD");
    },

    /**
     * Gets the current date and time in the format "YYYY-MM-DD HH:mm:ss".
     * @function
     * @returns {string} - The current date and time.
     */
    getCurrentDateExtend: function () {
        return moment().format("YYYY-MM-DD HH:mm:ss");
    },

    /**
     * Calculates the time left between the given datetime and now.
     * @function
     * @param {string} datetime - The datetime to calculate time left from.
     * @returns {Object} - The duration Object representing time left.
     */
    calcTimeLeft: function (datetime) {
        const now = moment();
        const then = moment(datetime, "YYYY-MM-DD hh:mm A");
        return moment.duration(then.diff(now));
    },

    /**
     * Calculates and formats the time left as a human-readable string.
     * @function
     * @param {string} datetime - The datetime to calculate time left from.
     * @returns {string} - The formatted time left as a human-readable string.
     */
    calcTimeLeftAsString: function (datetime) {
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

    /**
     * Checks if two dates are the same.
     * @function
     * @param {Date} dateA - The first date.
     * @param {Date} dateB - The second date.
     * @returns {boolean} - True if the dates are the same, false otherwise.
     */
    isSameDates: function (dateA, dateB) {
        return moment(dateA).isSame(moment(dateB), "D");
    },

    /**
     * Checks if a date is between two other dates.
     * @function
     * @param {Date} date - The date to check.
     * @param {Date} dateA - The start date.
     * @param {Date} dateB - The end date.
     * @returns {boolean} - True if the date is between the specified dates, false otherwise.
     */
    isBetweenDates: function (date, dateA, dateB) {
        return date.isBetween(dateA, dateB, "days", true);
    }
};

module.exports = dateUtil;
