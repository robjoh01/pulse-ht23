// Written by Robin Johannesson

"use strict";

let miscUtil = {
    minutesToMilliseconds: function(minutes) {
        return minutes * 60000;
    },
    hoursToMilliseconds: function(hours) {
        return hours * 3600000;
    },
    daysToMilliseconds: function(days) {
        return days * 86400000;
    },
};

module.exports = miscUtil;
