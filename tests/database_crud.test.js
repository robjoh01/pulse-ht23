const dbUtil = require("../src/utils/dbUtil.js");

// expect();
// .toBe();
// .toEqual();
// .not.toEqual();

test("Create a already existing user", async () => {
    const res = await dbUtil.createUser(
        "c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef",
        true,
        "mrrobin",
        "password1",
        "mrrobin@example.com"
    );

    expect(res).toBe(false);
});

test("Create a new user", async () => {
    const res = await dbUtil.createUser(
        "e833e08e-fe45-4bc7-a2a3-6987fdd401ee",
        true,
        "mrrobin",
        "password1",
        "mrrobin@example.com"
    );

    expect(res).toBe(true);
});

test("Update a user", async () => {
    const res = await dbUtil.updateUser(
        "e833e08e-fe45-4bc7-a2a3-6987fdd401ee",
        "newPassword",
        "Robin Johannesson",
        null,
        "564654645",
        null
    );

    expect(res).toBe(true);
});

test("Delete a user", async () => {
    const res = await dbUtil.deleteUser("e833e08e-fe45-4bc7-a2a3-6987fdd401ee");

    expect(res).toBe(true);
});

test("Create a already existing project", async () => {
    const res = await dbUtil.createProject(
        "8f973318-dfb8-4ee9-9cc2-ef01ca0a26c9",
        "Project ABC",
        "Lorem Ipsum",
        "2023-12-31"
    );

    expect(res).toBe(false);
});

test("Create a new project", async () => {
    const res = await dbUtil.createProject(
        "d763fa50-3d53-41e1-8311-f1f25fa06c1c",
        "Project ABC",
        "Lorem Ipsum",
        "2023-12-31"
    );

    expect(res).toBe(true);
});

test("Update a project", async () => {
    const res = await dbUtil.updateProject(
        "d763fa50-3d53-41e1-8311-f1f25fa06c1c",
        "Project CBA",
        "Hello, World!",
        "2025-01-01"
    );

    expect(res).toBe(true);
});

test("Archive a project", async () => {
    const res = await dbUtil.archiveProject("d763fa50-3d53-41e1-8311-f1f25fa06c1c");

    expect(res).toBe(true);
});

test("Delete an archive project", async () => {
    const res = await dbUtil.deleteArchiveProject("d763fa50-3d53-41e1-8311-f1f25fa06c1c");

    expect(res).toBe(true);
});
