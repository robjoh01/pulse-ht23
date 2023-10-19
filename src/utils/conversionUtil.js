"use strict";

const timeScalars = [1000, 60, 60, 24, 7, 52];
const timeUnits = ["now", "seconds", "minutes", "hours", "days", "weeks", "years"];

/**
 * Conversion utilities for various time and size units.
 * @namespace
 */
const conversionUtil = {
    /**
     * Convert minutes to milliseconds.
     * @function
     * @param {number} minutes - The value in minutes to convert.
     * @return {number} The converted value in milliseconds.
     */
    minutesToMilliseconds: function (minutes) {
        return minutes * 60000;
    },

    /**
     * Convert hours to milliseconds.
     * @function
     * @param {number} hours - The value in hours to convert.
     * @return {number} The converted value in milliseconds.
     */
    hoursToMilliseconds: function (hours) {
        return hours * 3600000;
    },

    /**
     * Convert days to milliseconds.
     * @function
     * @param {number} days - The value in days to convert.
     * @return {number} The converted value in milliseconds.
     */
    daysToMilliseconds: function (days) {
        return days * 86400000;
    },

    /**
     * Convert megabytes to bytes.
     * @function
     * @param {number} megabytes - The value in megabytes to convert.
     * @return {number} The converted value in bytes.
     */
    megabytesToBytes: function (megabytes) {
        return megabytes * 1000000;
    },

    /**
     * Convert bytes to megabytes.
     * @function
     * @param {number} bytes - The value in bytes to convert.
     * @return {number} The converted value in megabytes.
     */
    bytesToMegabytes: function (bytes) {
        return bytes / 1000000;
    },

    /**
     * Convert milliseconds to a human-readable time format.
     * @function
     * @param {number} milliseconds - The value in milliseconds to convert.
     * @param {number} [dp=0] - The number of decimal places for the result.
     * @return {string} The human-readable time.
     */
    getHumanReadableTime: function (milliseconds, dp = 0) {
        let timeScalarIndex = 0;
        let scaledTime = milliseconds;

        while (scaledTime > timeScalars[timeScalarIndex]) {
            scaledTime /= timeScalars[timeScalarIndex++];
        }

        return `${scaledTime.toFixed(dp)} ${timeUnits[timeScalarIndex]}`;
    }
};

module.exports = conversionUtil;
