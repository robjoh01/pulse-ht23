"use strict";

const mysql = require("promise-mysql");
const config = require("./../../config/db/pulse.json");

// const appUtil = require("./appUtil.js");
const hashUtil = require("./hashUtil.js");
const dateUtil = require("./dateUtil.js");

/**
 * Utility for handling database connection and related constants.
 * @namespace
 */
const dbUtil = {
    /**
     * Enum representing various statuses.
     * @enum {number}
     * @readonly
     * @property {number} pending - Pending status.
     * @property {number} submitted - Submitted status.
     * @property {number} read - Read status.
     * @property {number} archived - Archived status.
     */
    statuses: {
        pending: 1,
        submitted: 2,
        read: 3,
        archived: 4
    },

    /**
     * Enum representing various categories.
     * @enum {number}
     * @readonly
     * @property {number} financial_reports - Financial reports category.
     * @property {number} sales_and_marketing - Sales and marketing category.
     * @property {number} project_progress - Project progress category.
     * @property {number} customer_feedback - Customer feedback category.
     * @property {number} operational_efficiency - Operational efficiency category.
     * @property {number} human_resources - Human resources category.
     * @property {number} product_development - Product development category.
     * @property {number} market_research - Market research category.
     * @property {number} budget_and_expenses - Budget and expenses category.
     */
    categories: {
        financial_reports: 1,
        sales_and_marketing: 2,
        project_progress: 3,
        customer_feedback: 4,
        operational_efficiency: 5,
        human_resources: 6,
        product_development: 7,
        market_research: 8,
        budget_and_expenses: 9
    },

    /**
     * Establishes a connection to the database.
     * @async
     * @return {Promise<mysql.Connection>} A Promise that resolves to a MySQL database connection.
     * @memberof dbUtil
     */
    connectDatabase: async function () {
        return await mysql.createConnection(config);
    },

    /**
     * Checks if a project with the provided name or ID exists in the database.
     * @async
     * @param {string|null} name - Project name.
     * @param {string|null} id - Project ID.
     * @return {Promise<boolean>} A boolean value indicating if the project exists.
     * @memberof dbUtil
     */
    doesProjectExists: async function (name = null, id = null) {
        const db = await this.connectDatabase();

        const sql = "SELECT does_project_exists(?, ?);";
        const res = await db.query(sql, [name, id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },

    /**
     * Creates a new project in the database.
     * @async
     * @param {string} id - Project ID.
     * @param {string} managerId - Manager ID.
     * @param {string} name - Project name.
     * @param {string|null} [description=null] - Project description.
     * @param {string} startDate - Project start date.
     * @param {string} endDate - Project end date.
     * @param {string} reportFrequency - Project report frequency.
     * @return {Promise<boolean>} A boolean value indicating if the project was created successfully.
     * @memberof dbUtil
     */
    createProject: async function (id, managerId, name, description = null, startDate, endDate, reportFrequency) {
        const db = await this.connectDatabase();
        const query = "CALL create_project(?, ?, ?, ?, ?, ?, ?, @success); SELECT @success as success;";

        const res = await db.query(query, [id, managerId, name, description, startDate, endDate, reportFrequency]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Creates a project deadline in the database.
     * @async
     * @param {string} projectId - The ID of the project associated with the deadline.
     * @param {string} reportDeadline - The report deadline.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
     * @memberof dbUtil
     */
    createProjectDeadline: async function (projectId, reportDeadline) {
        const db = await this.connectDatabase();
        const query = "CALL create_project_deadline(?, ?, @success); SELECT @success as success;";

        const res = await db.query(query, [projectId, reportDeadline]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Updates project information in the database.
     * @async
     * @param {string} id - The ID of the project to be updated.
     * @param {string|null} [name=null] - The new name for the project.
     * @param {string|null} [description=null] - The new description for the project.
     * @param {string|null} [startDate=null] - The new start date for the project.
     * @param {string|null} [endDate=null] - The new end date for the project.
     * @param {string|null} [reportFrequency=null] - The new report frequency for the project.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
     * @memberof dbUtil
     */
    updateProject: async function (id, name = null, description = null, startDate = null, endDate = null, reportFrequency = null) {
        const db = await this.connectDatabase();
        const query = "CALL update_project(?, ?, ?, ?, ?, ?, @success); SELECT @success as success;";

        const res = await db.query(query, [id, name, description, startDate, endDate, reportFrequency]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Archives a project in the database, marking it as archived.
     * @async
     * @param {string} id - The ID of the project to be archived.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
     * @memberof dbUtil
     */
    archiveProject: async function (id) {
        const db = await this.connectDatabase();
        const query = "CALL archive_project(?, @success); SELECT @success as success;";

        const res = await db.query(query, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Deletes an archived project from the database.
     * @async
     * @param {string} id - The ID of the project to be deleted.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
     * @memberof dbUtil
     */
    deleteArchiveProject: async function (id) {
        const db = await this.connectDatabase();
        const query = "CALL delete_archive_project(?, @success); SELECT @success as success;";

        const res = await db.query(query, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Checks if an assignment for the given employee and project exists in the database.
     * @async
     * @param {string} employeeId - The ID of the employee.
     * @param {string} projectId - The ID of the project.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the assignment exists.
     * @memberof dbUtil
     */
    doesAssignmentExists: async function (employeeId, projectId) {
        const db = await this.connectDatabase();

        const sql = "SELECT does_assignment_exists(?, ?);";
        const res = await db.query(sql, [employeeId, projectId]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },

    /**
     * Assigns an employee to a project in the database.
     * @async
     * @param {string} employeeId - The ID of the employee to be assigned.
     * @param {string} projectId - The ID of the project to which the employee will be assigned.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the assignment.
     * @memberof dbUtil
     */
    assignToProject: async function (employeeId, projectId) {
        const doesUserExists = await this.doesUserExists(null, employeeId);

        if (!doesUserExists) {
            return false;
        }

        const doesProjectExists = await this.doesProjectExists(null, projectId);

        if (!doesProjectExists) {
            return false;
        }

        const db = await this.connectDatabase();
        const query = "CALL assign_to_project(?, ?, @success); SELECT @success as success;";

        const res = await db.query(query, [employeeId, projectId]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Gets the user's ID based on the username.
     * @async
     * @param {string} username - The username of the user.
     * @return {Promise<string|false>} A Promise that resolves to the user's ID or false if the user doesn't exist.
     * @memberof dbUtil
     */
    getUserId: async function (username) {
        const doesUserExists = await this.doesUserExists(username); // Check if user is exists

        if (!doesUserExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT get_user_id(?);";
        const res = await db.query(sql, [username]);

        return res[0][Object.keys(res[0])[0]]; // Get user's id
    },

    /**
     * Checks if a user is an employee based on the user's ID.
     * @async
     * @param {string} id - The ID of the user.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the user is an employee.
     * @memberof dbUtil
     */
    isEmployee: async function (id) {
        if (!id) {
            return false;
        }

        const doesUserExists = await this.doesUserExists(null, id);

        if (!doesUserExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT is_user_employee(?);";
        const res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },

    /**
     * Checks if a user is activated based on the user's ID.
     * @async
     * @param {string} id - The ID of the user.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the user is activated.
     * @memberof dbUtil
     */
    isUserActivated: async function (id) {
        if (!id) {
            return false;
        }

        const doesUserExists = await this.doesUserExists(null, id);

        if (!doesUserExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT is_user_activated(?);";
        const res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },

    /**
     * Checks if the user exists in the database based on the username or ID.
     * @async
     * @param {string|null} username - The username of the user.
     * @param {string|null} id - The ID of the user.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the user exists.
     * @memberof dbUtil
     */
    doesUserExists: async function (username = null, id = null) {
        if (!username && !id) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT does_user_exists(?, ?);";
        const res = await db.query(sql, [username, id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },

    /**
     * Checks if the user has the correct password based on the user's ID.
     * @async
     * @param {string} id - The ID of the user.
     * @param {string} password - The user's password to check.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating whether the user has the correct password.
     * @memberof dbUtil
     */
    doesUserHavePermission: async function (id, password) {
        if (!id || !password) {
            return false;
        }

        const doesUserExist = await this.doesUserExists(null, id); // Check if user is exists

        if (!doesUserExist) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT get_user_password(?);";
        const res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]];

        return await hashUtil.compare(password, hashedPassword);
    },

    /**
     * Creates a new user in the database.
     * @async
     * @param {string} id - The ID of the new user.
     * @param {boolean} isEmployee - Indicates if the user is an employee.
     * @param {string} username - The username for the new user.
     * @param {string} password - The password for the new user.
     * @param {string} email - The email address for the new user.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if user creation was successful.
     * @memberof dbUtil
     */
    createUser: async function (id, isEmployee, username, password, email) {
        const db = await this.connectDatabase();

        const sql = "CALL create_user(?, ?, ?, ?, ?, @success); SELECT @success as success;";
        const hashedPassword = await hashUtil.hash(password);

        const res = await db.query(sql, [id, isEmployee, username, hashedPassword, email]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Updates user information in the database.
     * @async
     * @param {string} id - The ID of the user to update.
     * @param {string|null} newPassword - The new password (optional).
     * @param {string|null} newDisplayName - The new display name (optional).
     * @param {string|null} newEmailAddress - The new email address (optional).
     * @param {string|null} newPhoneNumber - The new phone number (optional).
     * @param {string|null} newImageURL - The new image URL (optional).
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if the update was successful.
     * @memberof dbUtil
     */
    updateUser: async function (id, newPassword = null, newDisplayName = null, newEmailAddress = null, newPhoneNumber = null, newImageURL = null) {
        const db = await this.connectDatabase();

        let hashedPassword = null;

        if (newPassword) {
            hashedPassword = await hashUtil.hash(newPassword);
        }

        const sql = "CALL update_user(?, ?, ?, ?, ?, ?, @success); SELECT @success as success;";
        const res = await db.query(sql, [id, hashedPassword, newDisplayName, newEmailAddress, newPhoneNumber, newImageURL]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Deletes a user from the database.
     * @async
     * @param {string} id - The ID of the user to delete.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if user deletion was successful.
     * @memberof dbUtil
     */
    deleteUser: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL delete_user(?, @success); SELECT @success as success;";

        const res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Reactivates a user by their ID.
     * @async
     * @param {string} id - The ID of the user to reactivate.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if reactivation was successful.
     * @memberof dbUtil
     */
    reactivateUser: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL reactivate_user(?, @success); SELECT @success as success;";

        const res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Deactivates a user by their ID.
     * @async
     * @param {string} id - The ID of the user to deactivate.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if deactivation was successful.
     * @memberof dbUtil
     */
    deactivateUser: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL deactivate_user(?, @success); SELECT @success as success;";

        const res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Checks if the provided password matches the user's stored password based on their ID.
     * @async
     * @param {string} id - The ID of the user.
     * @param {string} password - The password to check.
     * @return {Promise<string|boolean>} A Promise that resolves to the user's ID if the password is valid, otherwise false.
     * @memberof dbUtil
     */
    checkPassword: async function (id, password) {
        const doesUserExists = await this.doesUserExists(null, id); // Check if user is exists

        if (!doesUserExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT get_user_password(?);";
        const res = await db.query(sql, [id]);

        db.end();

        const hashedPassword = res[0][Object.keys(res[0])[0]]; // Get user's password
        const isValid = await hashUtil.compare(password, hashedPassword); // Compare the hash and raw password

        if (!isValid) {
            return false;
        }

        return id;
    },

    /**
     * Logs out a user based on their ID.
     * @async
     * @param {string} id - The ID of the user to log out.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if the logout was successful.
     * @memberof dbUtil
     */
    logoutUser: async function (id) {
        const db = await this.connectDatabase();

        const sql = "CALL user_logout(?);";
        await db.query(sql, [id]);

        db.end();

        return true;
    },

    /**
     * Checks if a report exists in the database.
     * @async
     * @param {string} id - The ID of the report to check.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if the report exists.
     * @memberof dbUtil
     */
    doesReportExists: async function (id) {
        if (!id) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "SELECT does_report_exists(?);";
        const res = await db.query(sql, [id]);

        db.end();

        return Boolean(res[0][Object.keys(res[0])[0]]);
    },

    /**
     * Creates a new report in the database.
     * @async
     * @param {string} employeeId - The ID of the employee creating the report.
     * @param {string} projectId - The ID of the project the report is associated with.
     * @param {string} text - The content of the report.
     * @param {number} statusId - The ID of the status of the report.
     * @param {number} categoryId - The ID of the category of the report.
     * @return {Promise<{ success: boolean, reportId: number }>} A Promise that resolves to an object indicating if the report creation was successful and the report ID.
     * @memberof dbUtil
     */
    createReport: async function (employeeId, projectId, text, statusId, categoryId) {
        const doesUserExists = await this.doesUserExists(null, employeeId);

        if (!doesUserExists) {
            return false;
        }

        const doesProjectExists = await this.doesProjectExists(null, projectId);

        if (!doesProjectExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "CALL create_report(?, ?, ?, ?, ?, @success, @report_id); SELECT @success as success, @report_id as report_id;";

        const res = await db.query(sql, [employeeId, projectId, text, statusId, categoryId]);

        db.end();

        const success = Boolean(res[1][0].success);
        const reportId = success ? parseInt(res[1][0].report_id) : null;

        return { success, reportId };
    },

    /**
     * Reviews a report in the database.
     * @async
     * @param {string} managerId - The ID of the manager reviewing the report.
     * @param {string} reportId - The ID of the report to review.
     * @param {string} comment - The comment provided during the review.
     * @param {number} statusId - The ID of the status of the report after review.
     * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if the review was successful.
     * @memberof dbUtil
     */
    reviewReport: async function (managerId, reportId, comment, statusId) {
        const doesUserExists = await this.doesUserExists(null, managerId);

        if (!doesUserExists) {
            return false;
        }

        const isEmployee = await this.isEmployee(managerId);

        if (isEmployee) {
            return false;
        }

        const doesReportExists = await this.doesReportExists(reportId);

        if (!doesReportExists) {
            return false;
        }

        const db = await this.connectDatabase();

        const sql = "CALL review_report(?, ?, ?, ?, @success); SELECT @success as success;";

        const res = await db.query(sql, [managerId, reportId, comment, statusId]);

        db.end();

        return Boolean(res[1][0].success);
    },

    /**
     * Fetches the available statuses from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of status objects.
     * @memberof dbUtil
     */
    fetchStatuses: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_statuses();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },

    /**
     * Fetches the available categories from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of category objects.
     * @memberof dbUtil
     */
    fetchCategories: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_categories();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },

    /**
     * Fetches employee details from the database based on the provided ID.
     * @async
     * @param {string} id - The ID of the employee to fetch.
     * @return {Promise<Object>} A Promise that resolves to an object representing the employee details.
     * @memberof dbUtil
     */
    fetchEmployee: async function (id) {
        const db = await this.connectDatabase();

        const sql = "CALL fetch_employee(?);";

        const res = await db.query(sql, [id]);

        db.end();

        const data = { ...res[0][0] };

        return data;
    },

    /**
     * Fetches all employees' details from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of employee objects.
     * @memberof dbUtil
     */
    fetchEmployees: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_employees();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },

    /**
     * Fetches project manager details from the database based on the provided ID.
     * @async
     * @param {string} id - The ID of the project manager to fetch.
     * @return {Promise<Object>} A Promise that resolves to an object representing the project manager details.
     * @memberof dbUtil
     */
    fetchProjectManager: async function (id) {
        const db = await this.connectDatabase();

        const sql = "CALL fetch_project_manager(?);";

        const res = await db.query(sql, [id]);

        db.end();

        const data = { ...res[0][0] };

        return data;
    },

    /**
     * Fetches all project managers' details from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of project manager objects.
     * @memberof dbUtil
     */
    fetchProjectManagers: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_project_managers();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        return data;
    },

    /**
     * Fetches user details from the database based on the provided ID.
     * @async
     * @param {string} id - The ID of the user to fetch.
     * @return {Promise<Object>} A Promise that resolves to an object representing the user details.
     * @memberof dbUtil
     */
    fetchUser: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_user(?);";

        const res = await db.query(sql, [id]);

        db.end();

        const data = { ...res[0][0] };

        data.is_employee = Boolean(data.is_employee);
        data.creation_date = dateUtil.parseDate(data.creation_date);
        data.logout_date = dateUtil.parseDate(data.logout_date);

        return data;
    },

    /**
     * Fetches all users' details from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of user objects.
     * @memberof dbUtil
     */
    fetchUsers: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_users();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.is_employee = Boolean(x.is_employee);
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.logout_date = dateUtil.parseDate(x.logout_date);
        });

        return data;
    },

    /**
     * Fetches project details from the database based on the provided ID.
     * @async
     * @param {string} id - The ID of the project to fetch.
     * @return {Promise<Object>} A Promise that resolves to an object representing the project details.
     * @memberof dbUtil
     */
    fetchProject: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_project(?);";

        const res = await db.query(sql, [id]);

        db.end();

        const data = { ...res[0][0] };

        data.creation_date = dateUtil.parseDateToReadableString(data.creation_date);
        data.modified_date = dateUtil.parseDateToReadableString(data.modified_date);
        data.start_date = dateUtil.parseDate(data.start_date);
        data.end_date = dateUtil.parseDate(data.end_date);
        data.deadline_date = dateUtil.parseDateToReadableString(data.deadline_date);

        return data;
    },

    /**
     * Fetches all projects' details from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of project objects.
     * @memberof dbUtil
     */
    fetchProjects: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_projects();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateToReadableString(x.creation_date);
            x.modified_date = dateUtil.parseDateToReadableString(x.modified_date);
            x.start_date = dateUtil.parseDate(x.start_date);
            x.end_date = dateUtil.parseDate(x.end_date);
            x.deadline_date = dateUtil.parseDateToReadableString(x.deadline_date);
        });

        return data;
    },

    /**
     * Fetches projects' details from the database based on a query.
     * @async
     * @param {string} query - The query to filter projects.
     * @return {Promise<Object[]>} A Promise that resolves to an array of filtered project objects.
     * @memberof dbUtil
     */
    fetchProjectsWithFilter: async function (query) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_projects_with_filter(?, ?);";

        const [rows] = await db.query(sql, [query, `%${query}%`]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateToReadableString(x.creation_date);
            x.modified_date = dateUtil.parseDateToReadableString(x.modified_date);
            x.start_date = dateUtil.parseDate(x.start_date);
            x.end_date = dateUtil.parseDate(x.end_date);
            x.deadline_date = dateUtil.parseDateToReadableString(x.deadline_date);
        });

        return data;
    },

    /**
     * Fetches archived project details from the database based on the provided ID.
     * @async
     * @param {string} id - The ID of the archived project to fetch.
     * @return {Promise<Object>} A Promise that resolves to an object representing the archived project details.
     * @memberof dbUtil
     */
    fetchArchiveProject: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_project_archive(?);";

        const res = await db.query(sql, [id]);

        db.end();

        const data = { ...res[0][0] };

        data.creation_date = dateUtil.parseDateToReadableString(data.creation_date);

        return data;
    },

    /**
     * Fetches all archived projects' details from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of archived project objects.
     * @memberof dbUtil
     */
    fetchArchiveProjects: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_project_archives();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateToReadableString(x.creation_date);
        });

        return data;
    },

    /**
     * Fetches an assignment's details from the database based on the provided project and employee IDs.
     * @async
     * @param {string} projectId - The ID of the project associated with the assignment.
     * @param {string} employeeId - The ID of the employee associated with the assignment.
     * @return {Promise<Object>} A Promise that resolves to an object representing the assignment details.
     * @memberof dbUtil
     */
    fetchAssignment: async function (projectId, employeeId) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_assignment(?, ?);";

        const res = await db.query(sql, [projectId, employeeId]);

        db.end();

        const data = { ...res[0][0] };

        data.creation_date = dateUtil.parseDate(data.creation_date);
        data.project_start_date = dateUtil.parseDate(data.project_start_date);
        data.project_end_date = dateUtil.parseDate(data.project_end_date);
        data.project_deadline_date = dateUtil.parseDateToReadableString(data.project_deadline_date);

        return data;
    },

    /**
     * Fetches details of all assignments from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of assignment objects.
     * @memberof dbUtil
     */
    fetchAssignments: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_assignments();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.project_start_date = dateUtil.parseDate(x.project_start_date);
            x.project_end_date = dateUtil.parseDate(x.project_end_date);
            x.project_deadline_date = dateUtil.parseDateToReadableString(x.project_deadline_date);
        });

        return data;
    },

    /**
     * Fetches assignments for a specific employee from the database based on the provided employee ID.
     * @async
     * @param {string} employeeId - The ID of the employee for whom assignments are to be fetched.
     * @return {Promise<Object[]>} A Promise that resolves to an array of assignment objects for the specified employee.
     * @memberof dbUtil
     */
    fetchAssignmentsForEmployee: async function (employeeId) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_assignments_for_employee(?);";

        const [rows] = await db.query(sql, [employeeId]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
            x.project_start_date = dateUtil.parseDate(x.project_start_date);
            x.project_end_date = dateUtil.parseDate(x.project_end_date);
            x.project_deadline_date = dateUtil.parseDateToReadableString(x.project_deadline_date);
            x.time_left = dateUtil.calcTimeLeftAsString(x.project_deadline_date);
        });

        return data;
    },

    /**
     * Fetches a report's details from the database based on the provided report ID.
     * @async
     * @param {string} id - The ID of the report to fetch.
     * @return {Promise<Object>} A Promise that resolves to an object representing the report details.
     * @memberof dbUtil
     */
    fetchReport: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_report(?);";

        const res = await db.query(sql, [id]);

        db.end();

        const data = { ...res[0][0] };

        data.creation_date = dateUtil.parseDateToReadableString(data.creation_date);

        return data;
    },

    /**
     * Fetches the history of a report from the database based on the provided report ID.
     * @async
     * @param {string} id - The ID of the report for which to fetch the history.
     * @return {Promise<Object[]>} A Promise that resolves to an array of report history objects.
     * @memberof dbUtil
     */
    fetchReportHistory: async function (id) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_report_history(?);";

        const [rows] = await db.query(sql, [id]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateToReadableString(x.creation_date);
        });

        return data;
    },

    /**
     * Fetches details of all reports from the database.
     * @async
     * @return {Promise<Object[]>} A Promise that resolves to an array of report objects.
     * @memberof dbUtil
     */
    fetchReports: async function () {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_reports();";

        const [rows] = await db.query(sql);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateToReadableString(x.creation_date);
        });

        return data;
    },

    /**
     * Fetches reports from the database with a filter query.
     * @async
     * @param {string} query - The query to filter reports.
     * @return {Promise<Object[]>} A Promise that resolves to an array of filtered report objects.
     * @memberof dbUtil
     */
    fetchReportsWithFilter: async function (query) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_reports_with_filter(?, ?);";

        const [rows] = await db.query(sql, [query, `%${query}%`]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDateToReadableString(x.creation_date);
        });

        return data;
    },

    /**
     * Fetches reports for a specific employee from the database based on the provided employee ID.
     * @async
     * @param {string} employeeId - The ID of the employee for whom reports are to be fetched.
     * @return {Promise<Object[]>} A Promise that resolves to an array of report objects for the specified employee.
     * @memberof dbUtil
     */
    fetchReportsForEmployee: async function (employeeId) {
        const db = await this.connectDatabase();
        const sql = "CALL fetch_reports_for_employee(?);";

        const [rows] = await db.query(sql, [employeeId]);

        db.end();

        const data = JSON.parse(JSON.stringify(rows));

        data.forEach(x => {
            x.creation_date = dateUtil.parseDate(x.creation_date);
        });

        return data;
    }
};

module.exports = dbUtil;
