"use strict";

// Import dependencies
const express = require("express");

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");

// Make instances
const router = express.Router();

router.get("/json", async (req, res) => {
    const data = {
        "fetches": [
            "/json/projects",
            "/json/archive_projects",
            "/json/assignments",
            "/json/reports",
            "/json/users",
            "/json/employees",
            "/json/managers",
        ],
        "examples": [
            "/json/projects/6e885bbc-6d26-411e-b978-2962acae4bdd",
            "/json/archive_project/4e658238-d50c-4812-84f2-be58e8be308a",
            "/json/assignment/6e885bbc-6d26-411e-b978-2962acae4bdd/c3dc5b5e-d54c-494c-afcc-ffd709b7b2ef",
            "/json/reports/1",
            "/json/report/history/1",
            "/json/users/2e889992-6993-42c2-9366-cf9249a1e61b",
        ]
    }

    res.json(data);
});

router.get("/json/projects", async (req, res) => {
    const data = await dbUtil.fetchProjects();

    res.json(data);
});

router.get("/json/projects/:id", async (req, res) => {
    const data = await dbUtil.fetchProject(req.params.id);

    res.json(data);
});

router.get("/json/archive_project/:id", async (req, res) => {
    const data = await dbUtil.fetchArchiveProjects(req.params.id);

    res.json(data);
});

router.get("/json/archive_projects", async (req, res) => {
    const data = await dbUtil.fetchArchiveProjects();

    res.json(data);
});

router.get("/json/assignment/:projectId/:employeeId", async (req, res) => {
    const data = await dbUtil.fetchAssignment(req.params.projectId, req.params.employeeId);

    res.json(data);
});

router.get("/json/assignments", async (req, res) => {
    const data = await dbUtil.fetchAssignments();

    res.json(data);
});

router.get("/json/reports", async (req, res) => {
    const data = await dbUtil.fetchReports();

    res.json(data);
});

router.get("/json/reports/:id", async (req, res) => {
    const data = await dbUtil.fetchReport(req.params.id);

    res.json(data);
});

router.get("/json/report/history/:id", async (req, res) => {
    const data = await dbUtil.fetchReportHistory(req.params.id);

    res.json(data);
});

router.get("/json/users", async (req, res) => {
    const data = await dbUtil.fetchUsers();

    res.json(data);
});

router.get("/json/users/:id", async (req, res) => {
    const data = await dbUtil.fetchUser(req.params.id);

    res.json(data);
});

router.get("/json/employees", async (req, res) => {
    const data = await dbUtil.fetchEmployees();

    res.json(data);
});

router.get("/json/managers", async (req, res) => {
    const data = await dbUtil.fetchProjectManagers();

    res.json(data);
});

module.exports = router;
