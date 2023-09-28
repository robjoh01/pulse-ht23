const dbUtil = require("../src/utils/dbUtil.js");

// expect();
// .toBe();
// .toEqual();
// .not.toEqual();

test("Fetch user", async () => {
    const res = await dbUtil.fetchUser("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef");

    expect(res).not.toEqual(false);
});

test("Fetch users", async () => {
    const res = await dbUtil.fetchUsers();

    expect(res.length).not.toBeLessThan(0);
});

test("Fetch employee", async () => {
    const res = await dbUtil.fetchEmployee("c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef");

    expect(res).not.toEqual(false);
});

test("Fetch employees", async () => {
    const res = await dbUtil.fetchEmployees();

    expect(res.length).not.toBeLessThan(0);
});

test("Fetch project manager", async () => {
    const res = await dbUtil.fetchProjectManager("2e889992-6993-42c2-9366-cf9249a1e61b");

    expect(res).not.toEqual(false);
});

test("Fetch project managers", async () => {
    const res = await dbUtil.fetchProjectManagers();

    expect(res.length).not.toBeLessThan(0);
});

test("Fetch project", async () => {
    const res = await dbUtil.fetchProject("4e658238-d50c-4812-84f2-be58e8be308a");

    expect(res).not.toEqual(false);
});

test("Fetch projects", async () => {
    const res = await dbUtil.fetchProjects();

    expect(res.length).not.toBeLessThan(0);
});

test("Fetch assignment", async () => {
    const res = await dbUtil.fetchAssignment("4e658238-d50c-4812-84f2-be58e8be308a", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef");

    expect(res).not.toEqual(false);
});

test("Fetch assignments", async () => {
    const res = await dbUtil.fetchAssignments();

    expect(res.length).not.toBeLessThan(0);
});

test("Fetch report", async () => {
    const res = await dbUtil.fetchReport("8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9", "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef");

    expect(res).not.toEqual(false);
});

test("Fetch reports", async () => {
    const res = await dbUtil.fetchReports();

    expect(res.length).not.toBeLessThan(0);
});

