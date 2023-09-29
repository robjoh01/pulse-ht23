"use strict";

const moment = require("moment");

let dateUtil = {
    parseDate: function(date) {
        return moment(date).format("YYYY-MM-DD");
    },
    parseDateExtend: function(date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    getCurrentDate: function() {
        return moment().format("YYYY-MM-DD");
    },
    getCurrentDateExtend: function() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
    },
};

module.exports = dateUtil;
