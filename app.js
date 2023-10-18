"use strict";

// $ npx expose-wsl@latest # Expose server to Windows

// Import dependencies
const ejs = require("ejs");
const flash = require("connect-flash");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const routes = require("./routes/routes.js");
const routesUser = require("./routes/routes_user.js");
const routesProject = require("./routes/routes_project.js");
const routesReport = require("./routes/routes_report.js");
const routesUpload = require("./routes/routes_upload.js");
const routesJSON = require("./routes/routes_json.js");

const { minutesToMilliseconds } = require("./src/utils/conversionUtil.js");

const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const cronUtil = require("./src/utils/cronUtil.js");
const dbUtil = require("./src/utils/dbUtil.js");
const dateUtil = require("./src/utils/dateUtil.js");
const emails = require("./src/emails/emails.js");

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const app = express();
const store = new session.MemoryStore();

const port = process.env.PORT;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: minutesToMilliseconds(45) },
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.use(flash());

app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 4);

app.use(express.urlencoded({ extended: false }));

app.use(routes);
app.use(routesUser);
app.use(routesProject);
app.use(routesReport);
app.use(routesUpload);
app.use(routesJSON);

app.use((error, req, res, next) => {
    if (error.type == 'redirect') {
        req.session.error = error;
        res.redirect('/error');
    }
    else if (error.type == 'time-out')
        res.status(408).send(error);
    else
        res.status(500).send(error);
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

if (process.env.CONFIG_MODE === "dist") {
    // Schedule everyday at 12 PM (24:00)
    cronUtil.schedule("0 12 * * *", async () => {
        const assignments = await dbUtil.fetchAssignments();

        assignments.forEach(async (x) => {
            const duration = dateUtil.calcTimeLeft(x.project_deadline_date);

            if (duration.asHours() <= 24) {
                await sendEmailReminder(x, 24);
            } else if (duration.asHours() <= 36) {
                await sendEmailReminder(x, 36);
            }
        });
    });
}

async function sendEmailReminder (assignment, hours) {
    const userData = await dbUtil.fetchUser(assignment.employee_id);
    const mail = new emails.ReminderEmail(assignment, hours);
    await mail.send(userData.email_address);
}
