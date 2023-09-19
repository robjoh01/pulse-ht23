"use strict";

export default {
    minutesToMilliseconds: function(minutes) {
        return minutes * 60000;
    },
    hoursToMilliseconds: function(hours) {
        return hours * 3600000;
    },
    daysToMilliseconds: function(days) {
        return days * 86400000;
    },
    /**
    * MB to bytes
    * @return {Number} A value in bytes.
    */
    megabytesToBytes: function(megabytes) {
        return megabytes * 1000000;
    },
    /**
    * Bytes to MB
    * @return {Number} A value in MB.
    */
    bytesToMegabytes: function(bytes) {
        return bytes / 1000000;
    }
};
