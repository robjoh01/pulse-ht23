"use strict";

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
    }
};

module.exports = conversionUtil;
