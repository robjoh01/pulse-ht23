"use strict";

// $ npx expose-wsl@latest # Expose server to Windows

// Import dependencies
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
dotenv.config();

const app = express();
const store = new session.MemoryStore();

const port = process.env.PORT;

app.set("view engine", "ejs");

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: minutesToMilliseconds(45) },
    resave: false,
    saveUninitialized: false,
    store: store,
});

app.use(sessionMiddleware);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.set('json spaces', 4);

app.use(routes);
app.use(routesUser);
app.use(routesProject);
app.use(routesReport);
app.use(routesUpload);
app.use(routesJSON);

app.use((error, req, res, next) => {
    if (error.type == 'redirect') {
        req.session.context = error;
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
