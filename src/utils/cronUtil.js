"use strict";

const cron = require("node-cron");

/*

    # ┌────────────── second (optional)
    # │ ┌──────────── minute
    # │ │ ┌────────── hour
    # │ │ │ ┌──────── day of month
    # │ │ │ │ ┌────── month
    # │ │ │ │ │ ┌──── day of week
    # │ │ │ │ │ │
    # │ │ │ │ │ │
    # * * * * * *

    cron.schedule('1,2,4,5 * * * *', () => {
        console.log('running every minute 1, 2, 4 and 5');
    });

*/

/**
 * Utility for scheduling tasks using cron expressions.
 * @namespace
 */
const cronUtil = {
    /**
     * Schedule a task based on a cron expression.
     * @function
     * @param {string} cronExpression - The cron expression for scheduling.
     * @param {Function} callback - The function to execute on the defined schedule.
     */
    schedule: function (cronExpression, callback) {
        cron.schedule(cronExpression, callback, {
            scheduled: true,
            timezone: "Europe/Stockholm"
        });
    }
};

module.exports = cronUtil;
