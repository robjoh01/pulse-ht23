"use strict";

const timeScalars = [1000, 60, 60, 24, 7, 52];
const timeUnits = ['ms', 'secs', 'mins', 'hrs', 'days', 'weeks', 'years'];

/** @namespace */
const conversionUtil = {
    minutesToMilliseconds: function (minutes) {
        return minutes * 60000;
    },
    hoursToMilliseconds: function (hours) {
        return hours * 3600000;
    },
    daysToMilliseconds: function (days) {
        return days * 86400000;
    },
    /**
    * MB to bytes
    * @return {number} A value in bytes.
    * @memberof conversionUtil
    */
    megabytesToBytes: function (megabytes) {
        return megabytes * 1000000;
    },
    /**
    * Bytes to MB
    * @return {number} A value in MB.
    * @memberof conversionUtil
    */
    bytesToMegabytes: function (bytes) {
        return bytes / 1000000;
    },
    /**
    * Text
    * @return {string} Text
    * @memberof conversionUtil
    */
    getHumanReadableTime: function (milliseconds, dp = 0) {
        let timeScalarIndex = 0, scaledTime = milliseconds;

        while (scaledTime > timeScalars[timeScalarIndex]) {
            scaledTime /= timeScalars[timeScalarIndex++];
        }

        return `${scaledTime.toFixed(dp)} ${timeUnits[timeScalarIndex]}`;
    },
};

module.exports = conversionUtil;
