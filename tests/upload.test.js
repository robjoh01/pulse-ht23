const uploadUtil = require("./../src/utils/uploadUtil.js");

test("Get storage", () => {
    const res = uploadUtil.getStorage();
    expect(res).not.toEqual(false);
});

