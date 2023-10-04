const dbUtil = require("../src/utils/dbUtil.js");
const hashUtil = require('../src/utils/hashUtil.js');

// expect();
// .toBe();
// .toEqual();
// .not.toEqual();

const admindId = "2e889992-6993-42c2-9366-cf9249a1e61b";
const username = "mrrobin";
let password = "password1";
const userId = hashUtil.generateGuid();
const projectId = hashUtil.generateGuid();
let reportId = null;

test("Create a already existing user", async () => {
    const res = await dbUtil.createUser(
        admindId,
        true,
        "admin",
        "password1",
        "admin@example.com"
    );

    expect(res).toBe(false);
});

test("Create a new user", async () => {
    const res = await dbUtil.createUser(
        userId,
        true,
        username,
        password,
        "mrrobin@example.com"
    );

    expect(res).toBe(true);
});

test("Does a user exists", async () => {
    const res = await dbUtil.doesUserExists(
        null,
        userId
    );

    expect(res).toBe(true);
});

test("Does a user exists (not valid version)", async () => {
    const res = await dbUtil.doesUserExists();

    expect(res).toEqual(false);
});

test("Update a user", async () => {
    password = "newPassword";

    const res = await dbUtil.updateUser(
        userId,
        password,
        "Robin Johannesson",
        null,
        "564654645",
        null
    );

    expect(res).toBe(true);
});

test("Check if a user is an employee", async () => {
    const res = await dbUtil.isEmployee(
        userId
    );

    expect(res).not.toEqual(false);
});

test("Check if a user is an employee (not valid version)", async () => {
    const res = await dbUtil.isEmployee();

    expect(res).toEqual(false);
});

test("Check if a user has permission", async () => {
    const res = await dbUtil.doesUserHavePermission(
        userId,
        password
    );

    expect(res).not.toEqual(false);
});

test("Check if a user has permission (not valid version)", async () => {
    const res = await dbUtil.doesUserHavePermission(
        "",
        password
    );

    expect(res).toEqual(false);

    const res2 = await dbUtil.doesUserHavePermission(
        userId,
        ""
    );

    expect(res2).toEqual(false);
});

test("Login for a user", async () => {
    const res = await dbUtil.loginUser(
        username,
        password,
    );

    expect(res).not.toEqual(false);
});

test("Login for a user (not valid version)", async () => {
    const res = await dbUtil.loginUser(
        "",
        password,
    );

    expect(res).toEqual(false);

    const res2 = await dbUtil.loginUser(
        username,
        "password",
    );

    expect(res2).toEqual(false);
});

test("Logout a user", async () => {
    const res = await dbUtil.logoutUser(
        userId,
        password,
    );

    expect(res).not.toEqual(false);
});

test("Create a already existing project", async () => {
    const res = await dbUtil.createProject(
        "4e658238-d50c-4812-84f2-be58e8be308a",
        "Quirky Quarters",
        "Lorem Ipsum",
        "2023-12-31"
    );

    expect(res).toBe(false);
});

test("Create a new project", async () => {
    const res = await dbUtil.createProject(
        projectId,
        "2e889992-6993-42c2-9366-cf9249a1e61b",
        "Quirky Quarters 2",
        "Lorem Ipsum",
        "2023-12-31",
        "2024-12-31",
        "weekly"
    );

    expect(res).toBe(true);
});

test("Does a project exists", async () => {
    const res = await dbUtil.doesProjectExists(
        null,
        projectId,
    );

    expect(res).toBe(true);
});

test("Update a project", async () => {
    const res = await dbUtil.updateProject(
        projectId,
        "Project Unknown",
        "Hello, World!",
        null,
        null,
        null,
        "2024-01-01 12:30"
    );

    expect(res).toBe(true);
});

test("Assign a employee to a project", async () => {
    const res = await dbUtil.assignToProject(
        userId,
        projectId,
    );

    expect(res).toEqual(true);
});

test("Create a report", async () => {
    const res = await dbUtil.createReport(
        userId,
        projectId,
        "Hello, World!"
    );

    reportId = res.reportId;

    expect(res.success).toEqual(true);
});

test("Review a report", async () => {
    const res = await dbUtil.reviewReport(
        admindId,
        reportId,
        "OK!",
        true
    );

    expect(res).toEqual(true);
});

test("Archive a project", async () => {
    const res = await dbUtil.archiveProject(projectId);

    expect(res).toBe(true);
});

test("Delete an archive project", async () => {
    const res = await dbUtil.deleteArchiveProject(projectId);

    expect(res).toBe(true);
});

test("Delete a user", async () => {
    const res = await dbUtil.deleteUser(userId);

    expect(res).toBe(true);
});
