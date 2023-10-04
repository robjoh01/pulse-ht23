const moment = require("moment");
const dateUtil = require('../src/utils/dateUtil.js');

test("Parse date", () => {
    const date = dateUtil.parseDate("2023-12-31");
    const res = moment(date, 'YYYY-MM-DD', true).isValid();

    expect(res).toEqual(true);
});

test("Parse date extend", () => {
    const date = dateUtil.parseDateExtend("2023-12-31 12:30");
    const res = moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid();

    expect(res).toEqual(true);
});

test("Get current date", () => {
    const date = dateUtil.getCurrentDate();
    const res = moment(date, 'YYYY-MM-DD', true).isValid();

    expect(res).toEqual(true);
});

test("Get current date extend", () => {
    const date = dateUtil.getCurrentDateExtend();
    const res = moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid();

    expect(res).toEqual(true);
}); 
