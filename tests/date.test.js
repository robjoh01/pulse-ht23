const moment = require("moment");
const dateUtil = require("./../src/utils/dateUtil.js");

test("Parse date", () => {
    const date = dateUtil.parseDate("2023-12-31");
    const res = moment(date, "YYYY-MM-DD", true).isValid();

    expect(res).toEqual(true);
});

test("Parse date extend", () => {
    const date = dateUtil.parseDateExtend("2023-12-31 12:30");
    const res = moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid();

    expect(res).toEqual(true);
});

test("Parse date to readable string", () => {
    const date = dateUtil.parseDateToReadableString("2023-12-31 18:30");
    const res = moment(date, "YYYY-MM-DD hh:mm A", false).isValid();

    expect(res).toEqual(true);
});

test("Get current date", () => {
    const date = dateUtil.getCurrentDate();
    const res = moment(date, "YYYY-MM-DD", true).isValid();

    expect(res).toEqual(true);
});

test("Get current date extend", () => {
    const date = dateUtil.getCurrentDateExtend();
    const res = moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid();

    expect(res).toEqual(true);
});

test("Calculate time left", () => {
    const res = dateUtil.calcTimeLeftAsString(moment());

    expect(res).toEqual(expect.any(String));
});

test("Calculate time left (5+ minutes)", () => {
    const res = dateUtil.calcTimeLeftAsString(moment().add(5, "minutes"));

    expect(res).toEqual(expect.any(String));
});

test("Calculate time left (1+ day)", () => {
    const res = dateUtil.calcTimeLeftAsString(moment().add(1, "days"));

    expect(res).toEqual(expect.any(String));
});

test("Calculate time left (1+ week)", () => {
    const res = dateUtil.calcTimeLeftAsString(moment().add(1, "weeks"));

    expect(res).toEqual(expect.any(String));
});

test("Calculate time left (2+ weeks)", () => {
    const res = dateUtil.calcTimeLeftAsString(moment().add(2, "weeks"));

    expect(res).toEqual(expect.any(String));
});

test("Calculate time left (1+ months)", () => {
    const res = dateUtil.calcTimeLeftAsString(moment().add(1, "months"));

    expect(res).toEqual(expect.any(String));
});

test("Calculate time left (1+ years)", () => {
    const res = dateUtil.calcTimeLeftAsString(moment().add(1, "years"));

    expect(res).toEqual(expect.any(String));
});
